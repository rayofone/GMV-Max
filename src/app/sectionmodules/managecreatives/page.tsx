"use client";

import React, { useState, useEffect } from "react";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { useFirebase, type Creative } from "@/contexts/FirebaseContext";
import Step1 from "./managecreativescomponents/Step1";
import Step2 from "./managecreativescomponents/Step2";
import Step3 from "./managecreativescomponents/Step3";
import Step4 from "./managecreativescomponents/Step4";

export default function ManageCreatives() {
  // Get data from Firebase context
  const {
    accounts: availableAccounts,
    accountsLoading,
    accountsError,
    creatives: availableCreatives,
    creativesLoading,
    creativesError,
  } = useFirebase();

  const [autoMode, setAutoMode] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  // TABS
  const [TikTokPostsTab, setTikTokPostsTab] = useState(true);
  const [AffiliatesTab, setAffiliatesTab] = useState(false);
  // VIDEO ERROR STATES
  const [videoErrors, setVideoErrors] = useState<Set<string | number>>(
    new Set()
  );

  const handleTikTokPostsClick = () => {
    setTikTokPostsTab(true);
    setAffiliatesTab(false);
  };

  const handleAffiliatesClick = () => {
    setTikTokPostsTab(false);
    setAffiliatesTab(true);
  };

  // SEARCH CREATIVE STATES
  const [searchCreativeTerm, setSearchCreativeTerm] = useState("");

  // SEARCH ACCOUNT STATES
  const [searchTerm, setSearchTerm] = useState("");

  // EXCLUDE STATES - Store as strings to handle both string and number IDs
  const [excludedCreativeIds, setExcludedCreativeIds] = useState<
    (string | number)[]
  >([]);

  // SELECTED ACCOUNTS STATE
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

  // Handle account toggle
  const handleAccountToggle = (accountId: string) => {
    setSelectedAccountIds((prev) => {
      if (prev.includes(accountId)) {
        return prev.filter((id) => id !== accountId);
      } else {
        return [...prev, accountId];
      }
    });
  };

  // SEARCH FUNCTIONALITY ACCOUNTS
  // 2. Filter data based on search term
  const filteredAccounts = availableAccounts.filter((account) =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // SEARCH FUNCTIONALITY  ACCOUNTS
  // 3. Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // AUTO TO MANUAL HANDLER
  const handleModeChange = (value: boolean) => {
    setAutoMode(value);
  };

  // CREATIVES DATA - Now fetched from Firebase (see useEffect above)

  // SEARCH FUNCTIONALITY CREATIVES
  // 2. Filter data based on search term
  const filteredCreatives = availableCreatives.filter(
    (creative) =>
      creative.name.toLowerCase().includes(searchCreativeTerm.toLowerCase()) ||
      creative.shop.toLowerCase().includes(searchCreativeTerm.toLowerCase()) ||
      creative.id.toString().includes(searchCreativeTerm) ||
      creative.type.toLowerCase().includes(searchCreativeTerm.toLowerCase())
  );

  // SEARCH FUNCTIONALITY  ACCOUNTS
  // 3. Handle search input change
  const handleCreativeSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchCreativeTerm(event.target.value);
  };

  // EXCLUDE FUNCTIONALITY
  // Handler to add/remove creative ID from the exclusion list
  const handleCreativeToggle = (creativeId: string | number) => {
    setExcludedCreativeIds((prevIds) => {
      if (prevIds.includes(creativeId)) {
        // If present, remove it (re-include it)
        return prevIds.filter((id) => id !== creativeId);
      } else {
        // If not present, add it (exclude it)
        return [...prevIds, creativeId];
      }
    });
  };

  // Apply the Exclusion Filter
  // Final list contains only creatives that match the search AND are NOT excluded.
  const creativesToDisplay = filteredCreatives.filter(
    (creative) =>
      // We keep the creative if its ID is NOT in the excludedCreativeIds array
      !excludedCreativeIds.includes(creative.id)
  );

  // Exclusions to display
  const exclusionsToDisplay = filteredCreatives.filter((creative) =>
    excludedCreativeIds.includes(creative.id)
  );

  ///////////////////////// STATES FOR THE DYNAMIC SEARCH/TAGGING BAR
  const [searchQuery, setSearchQuery] = useState(""); // Text input by user
  const [selectedTags, setSelectedTags] = useState<Creative[]>([]); // Items selected as tags
  const [showMenu, setShowMenu] = useState(false); // Visibility of the filter dropdown

  // 1. Adds a selected item to the tags list
  const handleSelectTag = (creative: Creative) => {
    if (!selectedTags.some((tag) => tag.id === creative.id)) {
      setSelectedTags((prev) => [...prev, creative]);
    }
    setSearchQuery(""); // Clear the search input after selection
    // Note: In the JSX, we will manually focus the input element here.
  };

  // 2. Removes a tag from the selected list
  const handleRemoveTag = (id: string | number) => {
    setSelectedTags((prev) => prev.filter((tag) => tag.id !== id));
  };

  // 3. Handles direct text input change for the new bar
  const handleSearchQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
    setShowMenu(true); // Always show the menu when typing
  };

  // 4. Clears all tags and search input
  const handleClearAll = () => {
    setSelectedTags([]);
    setSearchQuery("");
  };

  // SEARCH FUNCTIONALITY CREATIVES WITH TAGS
  const filterableCreatives = availableCreatives.filter(
    (creative) =>
      // A. Ensure the creative hasn't already been selected as a tag
      !selectedTags.some((tag) => tag.id === creative.id) &&
      // B. Apply search logic using the new searchQuery state
      (creative.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creative.shop.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creative.id.toString().includes(searchQuery) ||
        creative.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // SPECIFIC AFFILAITE MATCH
  const affiliateCreatives = creativesToDisplay.filter(
    (creative) => creative.type === "Affiliate"
  );

  // HELPER FUNCTION: Check if video path is valid
  const isValidVideoPath = (videoPath: string): boolean => {
    if (!videoPath || typeof videoPath !== "string") {
      return false;
    }
    const trimmed = videoPath.trim();
    // Reject empty strings and placeholder paths
    if (trimmed === "" || trimmed === "/creatives/" || trimmed === "/") {
      return false;
    }
    // Accept any non-empty string that looks like a path or URL
    // This is more lenient to handle various video storage formats
    return trimmed.length > 0;
  };

  // HANDLER: Track video load errors
  const handleVideoError = (creativeId: string | number) => {
    setVideoErrors((prev) => new Set(prev).add(creativeId));
  };

  // FILTER: Get creatives with valid videos
  // Show all creatives - the component will handle video validation and show fallback if needed
  let creativesWithVideos = creativesToDisplay.filter((creative) => {
    // Only filter out if video is completely empty or is a placeholder
    const video = creative.video || "";
    return (
      video.trim() !== "" &&
      video.trim() !== "/creatives/" &&
      video.trim() !== "/"
    );
  });

  // Apply inclusion filter: if tags are selected, only show those creatives
  if (selectedTags.length > 0) {
    const selectedTagIds = selectedTags.map((tag) => tag.id);
    creativesWithVideos = creativesWithVideos.filter((creative) =>
      selectedTagIds.includes(creative.id)
    );
  }

  // Debug: Log all creatives to see what we have
  useEffect(() => {
    if (availableCreatives.length > 0) {
      console.log("=== CREATIVES DEBUG ===");
      console.log("Total available creatives:", availableCreatives.length);
      console.log("Available creatives:", availableCreatives);
      console.log("Filtered creatives (search):", filteredCreatives.length);
      console.log(
        "Creatives to display (after exclusions):",
        creativesToDisplay.length
      );
      console.log("Creatives with videos:", creativesWithVideos.length);
      console.log("Excluded IDs:", excludedCreativeIds);

      // Log each creative's video field
      availableCreatives.forEach((creative) => {
        console.log(`Creative ${creative.id} (${creative.name}):`, {
          video: creative.video,
          videoType: typeof creative.video,
          isValid: isValidVideoPath(creative.video),
          isExcluded: excludedCreativeIds.includes(creative.id),
        });
      });
    }
  }, [
    availableCreatives,
    filteredCreatives,
    creativesToDisplay,
    creativesWithVideos,
    excludedCreativeIds,
  ]);

  return (
    <Container className="py-5 mt-5">
      {/* HEADER */}
      <Row className="mb-1 ">
        <Col>
          <div className="d-flex gap-3 mb-3 align-items-center">
            <Link href="/campaigns/create" className="btn btn-secondary">
              ←
            </Link>
            <span className="title mb-0">Manage creatives</span>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Row className="mb-4">
            {autoMode ? (
              <>
                <Step1 onModeChange={handleModeChange} />

                <Step2
                  availableAccounts={availableAccounts}
                  accountsLoading={accountsLoading}
                  accountsError={accountsError}
                  filteredAccounts={filteredAccounts}
                  searchTerm={searchTerm}
                  handleSearchChange={handleSearchChange}
                  selectedAccountIds={selectedAccountIds}
                  handleAccountToggle={handleAccountToggle}
                  filteredCreatives={filteredCreatives}
                  searchCreativeTerm={searchCreativeTerm}
                  handleCreativeSearchChange={handleCreativeSearchChange}
                  excludedCreativeIds={excludedCreativeIds}
                  handleCreativeToggle={handleCreativeToggle}
                  exclusionsToDisplay={exclusionsToDisplay}
                  advancedOpen={advancedOpen}
                  setAdvancedOpen={setAdvancedOpen}
                />

                <Step3 />

                <Step4
                  TikTokPostsTab={TikTokPostsTab}
                  AffiliatesTab={AffiliatesTab}
                  onTikTokPostsClick={handleTikTokPostsClick}
                  onAffiliatesClick={handleAffiliatesClick}
                  creativesLoading={creativesLoading}
                  creativesError={creativesError}
                  creativesWithVideos={creativesWithVideos}
                  affiliateCreatives={affiliateCreatives}
                  videoErrors={videoErrors}
                  isValidVideoPath={isValidVideoPath}
                  handleVideoError={handleVideoError}
                  searchQuery={searchQuery}
                  selectedTags={selectedTags}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  filterableCreatives={filterableCreatives}
                  handleSearchQueryChange={handleSearchQueryChange}
                  handleSelectTag={handleSelectTag}
                  handleRemoveTag={handleRemoveTag}
                  handleClearAll={handleClearAll}
                />
              </>
            ) : (
              ////////////////////////////////////////////////////////////////////////////// LGM
              <>
                <Col sm={12} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title className="text-dark mb-3 d-flex">
                        <p style={{ fontSize: "16px" }} className="fw-bold">
                          Step 1:
                        </p>
                        <p
                          style={{ fontSize: "16px" }}
                          className="text-muted ms-2"
                        >
                          {" "}
                          Select your creative mode
                        </p>
                      </Card.Title>
                      <Card.Text className="m-0">
                        <span className="text-dark">Mode: </span>
                        <span className="text-muted"> Manual</span>
                      </Card.Text>
                      <Card.Text className="align-items-center d-flex">
                        Select up to 400 authorized, affiliate, customized
                        posts, or uploaded videos
                        <Button
                          className="ms-1 btn btn-link p-0 bg-transparent border-0 text-primary text-decoration-none"
                          onClick={() => handleModeChange(true)}
                        >
                          <small> Switch to autoselect</small>
                        </Button>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={12} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title className="text-dark mb-3 d-flex">
                        <p style={{ fontSize: "16px" }} className="fw-bold">
                          Step 2:
                        </p>
                        <p
                          style={{ fontSize: "16px" }}
                          className="text-muted ms-2"
                        >
                          {" "}
                          Select your creative mode
                        </p>
                      </Card.Title>
                      <Card.Text className="m-0">
                        <span className="text-dark">Mode: </span>
                        <span className="text-muted"> Manual</span>
                      </Card.Text>
                      <Card.Text className="align-items-center d-flex">
                        Select up to 400 authorized, affiliate, customized
                        posts, or uploaded videos
                        <Button
                          className="ms-1 btn btn-link p-0 bg-transparent border-0 text-primary text-decoration-none"
                          onClick={() => handleModeChange(true)}
                        >
                          <small> Switch to autoselect</small>
                        </Button>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
