"use client";

import React, { useState, useRef } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Alert,
  Dropdown,
  Badge,
  Collapse,
  Nav,
} from "react-bootstrap";
import Link from "next/link";
import {
  ChevronRight,
  ChevronsDown,
  ChevronsUp,
  ChevronDown,
  Plus,
  CircleUser,
  CircleQuestionMark,
  X,
} from "lucide-react";

// Type definitions
interface Creative {
  id: number;
  type: string;
  preview: string;
  video: string;
  name: string;
  shop: string;
}

export default function ManageCreatives() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autoMode, setAutoMode] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  // TABS
  const [TikTokPostsTab, setTikTokPostsTab] = useState(true);
  const [AffiliatesTab, setAffiliatesTab] = useState(false);
  // VIDEO ERROR STATES
  const [videoErrors, setVideoErrors] = useState<Set<number>>(new Set());

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

  // EXCLUDE STATES
  const [excludedCreativeIds, setExcludedCreativeIds] = useState<number[]>([]);

  // SEARCH FUNCTIONALITY
  // 1. Defined data structure
  const availableAccounts = [
    { name: "TikTok account", type: "Offical" },
    { name: "TikTok account 2", type: "Marketing account" },
    { name: "TikTok account 3", type: "Marketing account" },
    { name: "TikTok account 4", type: "Marketing account" },
    { name: "TikTok account 5", type: "Marketing account" },
  ];

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

  // CREATIVES DATA
  // 1. Defined data structure
  const availableCreatives = [
    {
      id: 32165498778,
      type: "Authorized",
      preview: "Creative Preview 1",
      video: "/creatives/test.mp4",
      name: "Summer Sale Ad",
      shop: "Shop A",
    },
    {
      id: 98789654456,
      type: "Affiliate",
      preview: "Creative Preview 2",
      video: "/creatives/sesame.mp4",
      name: "Winter Collection Ad",
      shop: "Shop B",
    },
    {
      id: 35638794562,
      type: "Customized",
      preview: "Creative Preview 3",
      video: "/creatives/test-stream-upload.mp4",
      name: "Spring Launch Ad",
      shop: "Shop C",
    },
    {
      id: 41236549877,
      type: "Uploaded",
      preview: "Creative Preview 4",
      video: "/creatives/Spoon_03.mov",
      name: "Fall Promotion Ad",
      shop: "Shop D",
    },
    {
      id: 52165498779,
      type: "Authorized",
      preview: "Creative Preview 5",
      video: "/creatives/",
      name: "Holiday Specials Ad",
      shop: "Shop E",
    },
    {
      id: 28654123899,
      type: "Affiliate",
      preview: "Creative Preview 6",
      video: "/creatives/",
      name: "Black Friday Ad",
      shop: "Shop F",
    },
    {
      id: 87945213453,
      type: "Customized",
      preview: "Creative Preview 7",
      video: "/creatives/",
      name: "Cyber Monday Ad",
      shop: "Shop G",
    },
    {
      id: 44445687888,
      type: "Uploaded",
      preview: "Creative Preview 8",
      video: "/creatives/",
      name: "New Year Sale Ad",
      shop: "Shop H",
    },
    {
      id: 11233211233,
      type: "Authorized",
      preview: "Creative Preview 9",
      video: "/creatives/",
      name: "Valentine's Day Ad",
      shop: "Shop I",
    },
    {
      id: 26664558545,
      type: "Affiliate",
      preview: "Creative Preview 10",
      video: "/creatives/",
      name: "Easter Promotion Ad",
      shop: "Shop J",
    },
  ];

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
  const handleCreativeToggle = (creativeId: number) => {
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
  const handleRemoveTag = (id: number) => {
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
    if (!videoPath || videoPath.trim() === "" || videoPath === "/creatives/") {
      return false;
    }
    // Check if it's a valid file path (ends with video extension or is a valid URL)
    const videoExtensions = [".mp4", ".mov", ".webm", ".ogg", ".avi", ".mkv"];
    const hasExtension = videoExtensions.some((ext) =>
      videoPath.toLowerCase().endsWith(ext)
    );
    return (
      hasExtension ||
      videoPath.startsWith("http://") ||
      videoPath.startsWith("https://")
    );
  };

  // HANDLER: Track video load errors
  const handleVideoError = (creativeId: number) => {
    setVideoErrors((prev) => new Set(prev).add(creativeId));
  };

  // FILTER: Get creatives with valid videos
  const creativesWithVideos = creativesToDisplay.filter((creative) =>
    isValidVideoPath(creative.video)
  );

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
            {/************************************************************************************************************** Step 1 */}
            {autoMode ? (
              <>
                <Col sm={12} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title className="text-dark mb-2 d-flex">
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
                        <span className="text-muted"> Autoselect</span>
                      </Card.Text>
                      <Card.Text className="align-items-center d-flex">
                        Autoselect ad creative optimizes your campaign
                        performance with available posts.
                        <Button
                          className="ms-1 btn btn-link p-0 bg-transparent border-0 text-primary text-decoration-none"
                          onClick={() => handleModeChange(false)}
                        >
                          <small> Switch to manual</small>
                        </Button>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>

                {/************************************************************************************************************** Step 2 */}
                <Col sm={12} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title className="text-dark mb-2 d-flex">
                        <p style={{ fontSize: "16px" }} className="fw-bold">
                          Step 2:
                        </p>
                        <p
                          style={{ fontSize: "16px" }}
                          className="text-muted ms-2"
                        >
                          {" "}
                          Select your creative sources
                        </p>
                      </Card.Title>

                      {/************************************************************************************************************** SOURCES */}
                      <div className="gap-5 d-flex align-items-center">
                        <div className="d-flex align-items-center">
                          <p
                            style={{ fontSize: "14px" }}
                            className="fw-bold pt-3"
                          >
                            Source:
                          </p>
                          <Dropdown className="ms-3">
                            <Dropdown.Toggle
                              variant="secondary"
                              id="dropdown-basic"
                              className="btn-sm border-0"
                            >
                              <span className="me-3">
                                Creative sources (All)
                              </span>
                              <span className="mb-1">
                                <ChevronDown size={16} strokeWidth={2} />
                              </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu
                              className="border-0 shadow-sm"
                              style={{ width: "250px" }}
                            >
                              <div className="px-3 py-2">
                                <input
                                  className="form-check-input me-2"
                                  type="checkbox"
                                  value=""
                                  id="firstCheckbox"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="firstCheckbox"
                                  style={{ fontSize: "14px" }}
                                >
                                  TikTok posts
                                </label>
                              </div>
                              <div className="px-3 py-2">
                                <input
                                  className="form-check-input me-2"
                                  type="checkbox"
                                  value=""
                                  id="secondCheckbox"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="secondCheckbox"
                                  style={{ fontSize: "14px" }}
                                >
                                  Authorized posts
                                </label>
                              </div>
                              <div className="px-3 py-2">
                                <input
                                  className="form-check-input me-2"
                                  type="checkbox"
                                  value=""
                                  id="thirdCheckbox"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="thirdCheckbox"
                                  style={{ fontSize: "14px" }}
                                >
                                  Custom posts
                                </label>
                              </div>
                              <div className="px-3 py-2">
                                <input
                                  className="form-check-input me-2"
                                  type="checkbox"
                                  value=""
                                  id="fourthCheckbox"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="fourthCheckbox"
                                  style={{ fontSize: "14px" }}
                                >
                                  Affiliate posts
                                </label>
                              </div>
                              <div className="px-3 py-2">
                                <input
                                  className="form-check-input me-2"
                                  type="checkbox"
                                  value=""
                                  id="fifthCheckbox"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="fifthCheckbox"
                                  style={{ fontSize: "14px" }}
                                >
                                  AIGC images
                                </label>
                              </div>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>

                        {/************************************************************************************************************** ACCOUNTS */}
                        <div className="d-flex align-items-center">
                          <p
                            style={{ fontSize: "14px" }}
                            className="fw-bold pt-3"
                          >
                            Selected accounts:
                          </p>
                          <Dropdown className="ms-3 h-100">
                            <Dropdown.Toggle
                              variant="secondary"
                              id="dropdown-basic"
                              className="btn-sm border-0"
                            >
                              <span className="me-3">TikTok accounts (0)</span>
                              <span className="mb-1">
                                <ChevronDown size={16} strokeWidth={2} />
                              </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu
                              className="border-1 border-secondary shadow-sm pb-5 h-100"
                              style={{ width: "750px" }}
                            >
                              <Card style={{ width: "700px", height: "500px" }}>
                                <Card.Body style={{ width: "100%" }}>
                                  <Card.Title className="mb-2">
                                    TikTok accounts:{" "}
                                  </Card.Title>
                                  <Card.Text className="text-muted">
                                    Include as many available TikTok accounts in
                                    your campaign as possible to ensure
                                    sufficient creative supply for your ads.
                                  </Card.Text>
                                  <Col className="mb-3">
                                    <input
                                      type="text"
                                      placeholder="Type [/] to Search Post ID or Caption"
                                      value={searchTerm} // 👈 MUST set the value to the state
                                      onChange={handleSearchChange} // 👈 MUST call the handler on change
                                      className="form-control mb-3"
                                    />
                                  </Col>

                                  {/************************************ OPTIONS */}
                                  <Row>
                                    <Col sm={6} className="mb-3">
                                      <Card
                                        className="shadow-none border-0"
                                        style={{ backgroundColor: "#F5F5F5" }}
                                      >
                                        <Card.Body
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                          }}
                                        >
                                          <Card.Text className="mb-0 text-dark">
                                            Available
                                          </Card.Text>
                                          {/* SEARCH FUNCTIONALITY */}
                                          {/* 5. Map over the filtered list */}
                                          {filteredAccounts.map(
                                            (account, index) => (
                                              <div className="my-3" key={index}>
                                                <input
                                                  className="form-check-input me-2"
                                                  type="checkbox"
                                                  value=""
                                                  id={`account-${index}`}
                                                />
                                                <label
                                                  className="form-check-label text-muted"
                                                  htmlFor={`account-${index}`}
                                                >
                                                  <small>{account.name}</small>
                                                  <div className="badge bg-secondary text-muted ms-3">
                                                    {account.type}
                                                  </div>
                                                </label>
                                              </div>
                                            )
                                          )}
                                        </Card.Body>
                                      </Card>
                                    </Col>

                                    <Col sm={6} className="mb-3">
                                      <Card
                                        className="shadow-none border-0"
                                        style={{ backgroundColor: "#F5F5F5" }}
                                      >
                                        <Card.Body
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                          }}
                                        >
                                          <Card.Text className="mb-3 text-dark">
                                            Unauthorized
                                          </Card.Text>

                                          <div className="row d-flex align-items-center mb-3">
                                            <div className="col">
                                              <p className="text-muted p-0 m-0">
                                                TikTok account
                                              </p>
                                              <div className="badge bg-secondary text-muted">
                                                Offical
                                              </div>
                                            </div>
                                            <div className="col">
                                              <p className="text-primary float-end">
                                                <small>Get permission</small>
                                              </p>
                                            </div>
                                          </div>

                                          <div className="row d-flex align-items-center mb-3">
                                            <div className="col">
                                              <p className="text-muted p-0 m-0">
                                                TikTok account
                                              </p>
                                              <div className="badge bg-secondary text-muted">
                                                Offical
                                              </div>
                                            </div>
                                            <div className="col">
                                              <p className="text-primary float-end">
                                                <small>Edit access</small>
                                              </p>
                                            </div>
                                          </div>

                                          <div className="row d-flex align-items-center mb-3">
                                            <div className="col">
                                              <p className="text-muted p-0 m-0">
                                                TikTok account
                                              </p>
                                              <div className="badge bg-secondary text-muted">
                                                Offical
                                              </div>
                                            </div>
                                            <div className="col">
                                              <p className="text-primary float-end">
                                                <small>Edit access</small>
                                              </p>
                                            </div>
                                          </div>
                                        </Card.Body>
                                      </Card>
                                    </Col>
                                  </Row>
                                </Card.Body>
                              </Card>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>

                        {/************************************************************************************************************** ADDITIONAL */}
                        <div className="d-flex align-items-center">
                          <p
                            style={{ fontSize: "14px" }}
                            className="fw-bold pt-3"
                          >
                            Additional videos:
                          </p>
                          <Dropdown className="ms-3">
                            <Dropdown.Toggle
                              variant="secondary"
                              id="dropdown-basic"
                              className="btn-sm border-0"
                            >
                              <span className="me-3">
                                <Plus size={16} strokeWidth={2} /> Add
                              </span>
                              <span className="mb-1">
                                <ChevronDown size={16} strokeWidth={2} />
                              </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu
                              className="border-0 shadow-sm"
                              style={{ width: "250px" }}
                            >
                              <Dropdown.Item
                                href="#/action-1"
                                className="fw-normal py-1"
                                style={{ fontSize: "14px" }}
                              >
                                Custom posts
                              </Dropdown.Item>
                              <Dropdown.Item
                                href="#/action-1"
                                className="fw-normal py-1"
                                style={{ fontSize: "14px" }}
                              >
                                Video codes
                              </Dropdown.Item>
                              <Dropdown.Item
                                href="#/action-1"
                                className="fw-normal py-1"
                                style={{ fontSize: "14px" }}
                              >
                                Upload
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>

                      {/************************************************************************************************************** EXCLUSION */}
                      <Row>
                        <Col>
                          <Button
                            onClick={() => setAdvancedOpen(!advancedOpen)}
                            aria-controls="example-collapse-text"
                            aria-expanded={advancedOpen}
                            variant="text"
                            className="text-muted btn-sm ms-0 ps-0"
                          >
                            {!advancedOpen ? (
                              <ChevronsDown size={12} className="me-2" />
                            ) : (
                              <ChevronsUp size={12} className="me-2" />
                            )}
                            <span>Advanced settings</span>
                          </Button>
                          <Collapse in={advancedOpen} className="mt-2">
                            <div id="example-collapse-text">
                              <div className="d-flex align-items-center">
                                <p
                                  style={{ fontSize: "14px" }}
                                  className="fw-bold pt-3"
                                >
                                  Excluded videos:{" "}
                                </p>
                                <Dropdown
                                  className="ms-3"
                                  style={{ width: "250px" }}
                                >
                                  <Dropdown.Toggle
                                    variant="secondary"
                                    id="dropdown-basic"
                                    className="btn-sm border-0 d-flex align-items-center"
                                  >
                                    <span className="me-2 mb-1">
                                      <Plus size={16} strokeWidth={2} />
                                    </span>
                                    <span className="me-4">
                                      Exclusion filter (
                                      {excludedCreativeIds.length})
                                    </span>
                                    <span className=" mb-1">
                                      <CircleQuestionMark
                                        strokeWidth={1.5}
                                        size={16}
                                      />
                                    </span>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu
                                    className="border-0 shadow-sm px-3"
                                    style={{ width: "250px" }}
                                  >
                                    <div className="rounded my-2">
                                      <Dropdown className="ms-3">
                                        <Dropdown.Toggle
                                          id="dropdown-basic"
                                          className="btn-sm border-0 bg-transparent text-dark d-flex align-items-center p-0 w-100"
                                        >
                                          <span
                                            className="me-auto"
                                            style={{ fontSize: "16px" }}
                                          >
                                            Affiliates (1 available)
                                          </span>
                                          <span className="mb-1">
                                            <ChevronRight
                                              size={18}
                                              strokeWidth={2}
                                            />
                                          </span>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu
                                          className="border-0 shadow-sm px-3"
                                          style={{
                                            width: "400px",
                                            marginLeft: "220px",
                                            marginTop: "-40px",
                                          }}
                                        >
                                          <div className="rounded my-2">
                                            <Card>
                                              <Card.Header className="d-flex align-items-center bg-transparent m-0 p-0 mb-3">
                                                <strong>Affiliates</strong>
                                              </Card.Header>
                                              <Card.Body className="p-0 mb-3">
                                                {/************************************************************************************************** SEARCH CREATIVES  */}
                                                <input
                                                  type="text"
                                                  placeholder="Type [/] to Search"
                                                  value={searchCreativeTerm} // 👈 MUST set the value to the state
                                                  onChange={
                                                    handleCreativeSearchChange
                                                  } // 👈 MUST call the handler on change
                                                  className="form-control mb-3"
                                                />

                                                {/************************************************************************************************** SEARCH CREATIVE ITEM  */}
                                                {filteredCreatives.map(
                                                  (creative, index) => (
                                                    <div
                                                      className="d-flex align-items-center mb-3 "
                                                      key={creative.id}
                                                    >
                                                      <input
                                                        className="form-check-input me-2"
                                                        type="checkbox"
                                                        id={`creative${creative.id}`}
                                                        onChange={() =>
                                                          handleCreativeToggle(
                                                            creative.id
                                                          )
                                                        }
                                                      />
                                                      <label
                                                        className="form-check-label d-flex"
                                                        htmlFor={`creative${index}`}
                                                        style={{
                                                          fontSize: "14px",
                                                        }}
                                                      >
                                                        <span className="col me-2">
                                                          <CircleUser
                                                            strokeWidth={1.5}
                                                            size={42}
                                                          />
                                                        </span>
                                                        <span className="w-100">
                                                          {creative.name}
                                                          <br />
                                                          {creative.shop}
                                                        </span>
                                                      </label>
                                                    </div>
                                                  )
                                                )}
                                              </Card.Body>
                                              <Card.Footer className="bg-transparent p-0 pt-3 d-flex justify-content-end">
                                                <caption className="text-muted me-auto pt-2">
                                                  {excludedCreativeIds.length}{" "}
                                                  selected
                                                </caption>
                                                <Button
                                                  variant="secondary"
                                                  className="btn-sm me-3"
                                                >
                                                  Cancel
                                                </Button>
                                                <Button
                                                  variant="primary"
                                                  className="btn-sm"
                                                >
                                                  Apply
                                                </Button>
                                              </Card.Footer>
                                            </Card>
                                          </div>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </div>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                              {/* TAG DISPLAY */}
                              <Row className="ms-3">
                                <Col className="offset-md-1 d-flex flex-wrap">
                                  {exclusionsToDisplay.length === 0 ? (
                                    <span className="text-muted">
                                      No creatives are currently excluded.
                                    </span>
                                  ) : (
                                    exclusionsToDisplay.map((creative) => (
                                      <Badge
                                        key={creative.id}
                                        pill
                                        bg="secondary" // Use 'danger' to visually signal exclusion
                                        className="me-2 my-1 d-flex align-items-center text-muted"
                                      >
                                        {/* Display the name and shop or ID */}
                                        {creative.type} ({creative.id})
                                        {/* X icon to remove the exclusion */}
                                        <X
                                          size={14}
                                          className="ms-1 cursor-pointer"
                                          // Clicking the X removes the ID from the exclusion list,
                                          // causing it to disappear here and reappear in the main list.
                                          onClick={() =>
                                            handleCreativeToggle(creative.id)
                                          }
                                        />
                                      </Badge>
                                    ))
                                  )}
                                </Col>
                              </Row>
                            </div>
                          </Collapse>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>

                {/************************************************************************************************************** Step 3 */}
                <Col sm={12} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title className="text-dark mb-2 d-flex">
                        <p style={{ fontSize: "16px" }} className="fw-bold">
                          Step 3:
                        </p>
                        <p
                          style={{ fontSize: "16px" }}
                          className="text-muted ms-2"
                        >
                          {" "}
                          Add creative optimizations and enhancements
                        </p>
                      </Card.Title>
                      <Form className="mb-3">
                        <Form.Check // prettier-ignore
                          type="switch"
                          id="custom-switch"
                          label={
                            <div>
                              Accelerate testing for new videos{" "}
                              <CircleQuestionMark
                                strokeWidth={1.5}
                                size={16}
                                className="mb-1 ms-2"
                              />
                              <br />
                              <small className="text-muted">
                                Prioritize performance testing for your new,
                                recently authorized, and updated videos as part
                                of your campaign
                              </small>
                            </div>
                          }
                        />
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>

                {/************************************************************************************************************** Step 4 */}
                <Col sm={12} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title className="text-dark mb-0 d-flex">
                        <p style={{ fontSize: "16px" }} className="fw-bold">
                          Step 4:
                        </p>
                        <p
                          style={{ fontSize: "16px" }}
                          className="text-muted ms-2"
                        >
                          {" "}
                          Review your creatives
                        </p>
                      </Card.Title>
                      <Card.Text className="m-0">
                        Your creative may appear as video, carousel, or product
                        card. Displayed videos may not include all used in your
                        campaign.
                      </Card.Text>
                      <Row className="mt-3 mb-4">
                        <Col size={12}>
                          <Nav variant="tabs" defaultActiveKey="/home">
                            <Nav.Item>
                              <Nav.Link
                                className={
                                  "border border-bottom border-top-0 border-start-0 border-end-0" +
                                  (TikTokPostsTab
                                    ? " border-primary text-dark"
                                    : "border-secondary text-dark")
                                }
                                onClick={handleTikTokPostsClick}
                              >
                                TikTok posts
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link
                                className={
                                  "border border-bottom border-top-0 border-start-0 border-end-0" +
                                  (AffiliatesTab
                                    ? " border-primary text-dark"
                                    : "border-secondary text-dark")
                                }
                                onClick={handleAffiliatesClick}
                              >
                                Affiliates
                              </Nav.Link>
                            </Nav.Item>
                            <div className="ms-auto">
                              <Form className="">
                                <Form.Check // prettier-ignore
                                  type="switch"
                                  id="custom-switch"
                                  label={
                                    <div>
                                      Promotional videos{" "}
                                      <CircleQuestionMark
                                        strokeWidth={1.5}
                                        size={16}
                                        className="mb-1 ms-2"
                                      />
                                    </div>
                                  }
                                />
                              </Form>
                            </div>
                          </Nav>
                        </Col>
                      </Row>
                      <Dropdown
                        show={showMenu}
                        onToggle={(nextShow) => setShowMenu(nextShow)}
                        // The 'drop' prop determines the direction, 'down' is standard.
                      >
                        {/* This is the visual container that acts as the input field */}
                        <div
                          className="form-control d-flex align-items-center p-0"
                          // Highlight the border when the menu is shown
                          style={{
                            height: "auto",
                            minHeight: "38px",
                            borderColor: showMenu ? "#007bff" : "#ced4da",
                            cursor: "text",
                          }}
                          onClick={() => inputRef.current?.focus()} // Focus input when clicking anywhere
                        >
                          {/* Render Selected Tags */}
                          <div className="d-flex flex-wrap p-1">
                            {selectedTags.map((tag) => (
                              <Badge
                                key={tag.id}
                                pill
                                bg="secondary"
                                className="me-2 my-1 d-flex align-items-center text-muted"
                              >
                                {tag.name}
                                <X
                                  size={14}
                                  className="ms-1 cursor-pointer"
                                  // StopPropagation prevents the click from activating the container click event
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveTag(tag.id);
                                  }}
                                />
                              </Badge>
                            ))}

                            {/* Main Search Input */}
                            <input
                              ref={inputRef}
                              type="text"
                              placeholder={
                                selectedTags.length > 0
                                  ? ""
                                  : "Type [/] Search and filter"
                              }
                              value={searchQuery}
                              onChange={handleSearchQueryChange}
                              onFocus={() => setShowMenu(true)} // Show menu when input is focused
                              onBlur={(e) => {
                                // Hide menu after a short delay to allow clicks on menu items to register
                                setTimeout(() => {
                                  const relatedTarget =
                                    e.relatedTarget as Node | null;
                                  if (
                                    !relatedTarget ||
                                    !e.currentTarget.contains(relatedTarget)
                                  ) {
                                    setShowMenu(false);
                                  }
                                }, 150);
                              }}
                              className="border-0 flex-grow-1 w-100 px-2"
                              style={{
                                outline: "none",
                                boxShadow: "none",
                                minWidth: "150px",
                                fontSize: "14px",
                              }}
                            />
                          </div>

                          {/* Clear Button (Right-aligned, as seen in the image) */}
                          {searchQuery || selectedTags.length > 0 ? (
                            <Button
                              variant="link"
                              className="text-muted text-decoration-none p-2 ms-auto"
                              onClick={handleClearAll}
                            >
                              Clear
                            </Button>
                          ) : (
                            <></>
                          )}
                        </div>

                        {/* Filter Dropdown Menu */}
                        <Dropdown.Menu
                          show={showMenu}
                          // Set the width to match the input and allow scrolling for long lists
                          style={{
                            width: "100%",
                            maxHeight: "300px",
                            overflowY: "auto",
                          }}
                        >
                          {filterableCreatives.length > 0 ? (
                            filterableCreatives.map((creative) => (
                              <Dropdown.Item
                                key={creative.id}
                                // 👈 On click, select the item and make it a tag
                                onClick={() => handleSelectTag(creative)}
                              >
                                <div className="d-flex align-items-center">
                                  <CircleUser
                                    strokeWidth={1.5}
                                    size={30}
                                    className="me-2"
                                  />
                                  <div>
                                    <div className="fw-bold">
                                      {creative.name}
                                    </div>
                                    <small className="text-muted">
                                      {creative.shop} (ID: {creative.id})
                                    </small>
                                  </div>
                                </div>
                              </Dropdown.Item>
                            ))
                          ) : (
                            <Dropdown.Item disabled>
                              No results found for &quot;{searchQuery}&quot;
                            </Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>

                      {/* <Row className="mt-3">
                                    <Col size={12}>
                                          <input
                                            type="text"
                                            placeholder="Type [/] to Search"
                                            value={searchCreativeTerm} // 👈 MUST set the value to the state
                                            onChange={handleCreativeSearchChange} // 👈 MUST call the handler on change
                                            className="form-control mb-3"
                                          />
                                    </Col>
                                  </Row> */}
                      <Row className="gap-3 mt-4">
                        {TikTokPostsTab ? (
                          <>
                            {creativesWithVideos.length > 0 ? (
                              <Col size={12} className="d-flex flex-wrap gap-3">
                                {creativesWithVideos.map((creative) => {
                                  const hasError = videoErrors.has(creative.id);
                                  const isValid = isValidVideoPath(
                                    creative.video
                                  );

                                  return (
                                    <Col
                                      sm={2}
                                      className="mb-5"
                                      style={{
                                        height: "350px",
                                        width: "200px",
                                      }}
                                      key={creative.id}
                                    >
                                      {isValid && !hasError ? (
                                        <video
                                          src={creative.video}
                                          loop
                                          muted
                                          autoPlay={false}
                                          controls={true}
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            backgroundColor: "#f5f5f5",
                                          }}
                                          onError={() =>
                                            handleVideoError(creative.id)
                                          }
                                        >
                                          Your browser does not support the
                                          video tag.
                                        </video>
                                      ) : (
                                        <div
                                          className="d-flex flex-column align-items-center justify-content-center bg-secondary text-white rounded"
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            minHeight: "300px",
                                          }}
                                        >
                                          <CircleUser
                                            strokeWidth={1.5}
                                            size={48}
                                            className="mb-2 opacity-50"
                                          />
                                          <p
                                            className="text-center mb-0 px-2"
                                            style={{ fontSize: "12px" }}
                                          >
                                            No video available
                                          </p>
                                          <p
                                            className="text-center mt-1 px-2 text-muted"
                                            style={{ fontSize: "10px" }}
                                          >
                                            {creative.name}
                                          </p>
                                        </div>
                                      )}
                                      <p
                                        className="mt-2 mb-0"
                                        style={{ fontSize: "14px" }}
                                      >
                                        {creative.name}
                                      </p>
                                    </Col>
                                  );
                                })}
                              </Col>
                            ) : (
                              <Col size={12}>
                                <Alert variant="info" className="text-center">
                                  <CircleQuestionMark
                                    strokeWidth={1.5}
                                    size={24}
                                    className="mb-2"
                                  />
                                  <p className="mb-0">
                                    No videos available to display. Please add
                                    videos to your creatives.
                                  </p>
                                </Alert>
                              </Col>
                            )}
                          </>
                        ) : (
                          <Col size={12} className="d-flex flex-wrap gap-3">
                            {affiliateCreatives.length > 0 ? (
                              affiliateCreatives.map((creative) => (
                                <Col
                                  sm={2}
                                  className="mb-4 bg-secondary"
                                  style={{ height: "300px" }}
                                  key={creative.id}
                                >
                                  {creative.name}
                                </Col>
                              ))
                            ) : (
                              <Col size={12}>
                                <Alert variant="info" className="text-center">
                                  <CircleQuestionMark
                                    strokeWidth={1.5}
                                    size={24}
                                    className="mb-2"
                                  />
                                  <p className="mb-0">
                                    No affiliate creatives available.
                                  </p>
                                </Alert>
                              </Col>
                            )}
                          </Col>
                        )}
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
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
