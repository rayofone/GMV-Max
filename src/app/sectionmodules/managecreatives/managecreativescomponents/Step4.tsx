"use client";

import React, { useRef } from "react";
import {
  Card,
  Row,
  Col,
  Alert,
  Dropdown,
  Badge,
  Nav,
  Form,
  Button,
} from "react-bootstrap";
import { CircleUser, CircleQuestionMark, X, ChevronRight } from "lucide-react";
import type { Creative } from "@/contexts/FirebaseContext";

interface Step4Props {
  TikTokPostsTab: boolean;
  AffiliatesTab: boolean;
  onTikTokPostsClick: () => void;
  onAffiliatesClick: () => void;
  creativesLoading: boolean;
  creativesError: string | null;
  creativesWithVideos: Creative[];
  affiliateCreatives: Creative[];
  videoErrors: Set<string | number>;
  isValidVideoPath: (videoPath: string) => boolean;
  handleVideoError: (creativeId: string | number) => void;
  // Search and filter props
  searchQuery: string;
  selectedTags: Creative[];
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
  filterableCreatives: Creative[];
  handleSearchQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectTag: (creative: Creative) => void;
  handleRemoveTag: (id: string | number) => void;
  handleClearAll: () => void;
}

export default function Step4({
  TikTokPostsTab,
  AffiliatesTab,
  onTikTokPostsClick,
  onAffiliatesClick,
  creativesLoading,
  creativesError,
  creativesWithVideos,
  affiliateCreatives,
  videoErrors,
  isValidVideoPath,
  handleVideoError,
  searchQuery,
  selectedTags,
  showMenu,
  setShowMenu,
  filterableCreatives,
  handleSearchQueryChange,
  handleSelectTag,
  handleRemoveTag,
  handleClearAll,
}: Step4Props) {
  const affiliateInputRef = useRef<HTMLInputElement>(null);
  const allCreativesInputRef = useRef<HTMLInputElement>(null);

  return (
    <Col sm={12} className="mb-4">
      <Card>
        <Card.Body>
          <Card.Title className="text-dark mb-0 d-flex">
            <p style={{ fontSize: "16px" }} className="fw-bold">
              Step 4:
            </p>
            <p style={{ fontSize: "16px" }} className="text-muted ms-2">
              {" "}
              Review your creatives
            </p>
          </Card.Title>
          <Card.Text className="m-0">
            Your creative may appear as video, carousel, or product card.
            Displayed videos may not include all used in your campaign.
          </Card.Text>
          <Row className="mt-3 mb-4">
            <Col size={12}>
              <Nav variant="tabs" defaultActiveKey="/home">
                <Nav.Item>
                  <Nav.Link
                    className={
                      "border-0 border-bottom rounded-0" +
                      (TikTokPostsTab
                        ? " border-primary border-bottom text-dark"
                        : " border-secondary border-bottom text-dark")
                    }
                    style={{
                      borderTop: "none",
                      borderLeft: "none",
                      borderRight: "none",
                    }}
                    onClick={onTikTokPostsClick}
                  >
                    TikTok posts
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    className={
                      "border-0 border-bottom rounded-0" +
                      (AffiliatesTab
                        ? " border-primary border-bottom text-dark"
                        : " border-secondary border-bottom text-dark")
                    }
                    style={{
                      borderTop: "none",
                      borderLeft: "none",
                      borderRight: "none",
                    }}
                    onClick={onAffiliatesClick}
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
          >
            <div
              className="form-control d-flex align-items-center p-0"
              style={{
                height: "auto",
                minHeight: "38px",
                borderColor: showMenu ? "#007bff" : "#ced4da",
                cursor: "text",
              }}
              onClick={() => {
                setShowMenu(true);
                affiliateInputRef.current?.focus();
              }}
            >
              <div className="d-flex flex-nowrap align-items-center p-1">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    bg="secondary"
                    className="me-2 d-flex align-items-center text-muted flex-shrink-0"
                  >
                    {tag.name}
                    <X
                      size={14}
                      className="ms-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTag(tag.id);
                      }}
                    />
                  </Badge>
                ))}

                <input
                  ref={affiliateInputRef}
                  type="text"
                  placeholder={
                    selectedTags.length > 0 ? "" : "Type [/] Search and filter"
                  }
                  value={searchQuery}
                  onChange={handleSearchQueryChange}
                  onFocus={() => setShowMenu(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      e.preventDefault();
                      const matchingCreative = filterableCreatives.find(
                        (c) =>
                          c.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          c.shop
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                      );
                      if (matchingCreative) {
                        handleSelectTag(matchingCreative);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    setTimeout(() => {
                      const relatedTarget = e.relatedTarget as Node | null;
                      if (
                        !relatedTarget ||
                        !e.currentTarget.contains(relatedTarget)
                      ) {
                        setShowMenu(false);
                      }
                    }, 150);
                  }}
                  className="border-0 flex-grow-1 px-2"
                  style={{
                    outline: "none",
                    boxShadow: "none",
                    minWidth: "150px",
                    fontSize: "14px",
                  }}
                />
              </div>

              {searchQuery || selectedTags.length > 0 ? (
                <Button
                  variant="link"
                  className="text-muted text-decoration-none p-2 ms-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearAll();
                  }}
                >
                  Clear
                </Button>
              ) : (
                <></>
              )}
            </div>
            <Dropdown.Menu
              className="border-0 shadow-sm px-3"
              style={{ width: "250px" }}
            >
              <div className="rounded my-2">
                <Dropdown>
                  <Dropdown.Toggle
                    id="affiliates-filter"
                    className="btn-sm border-0 bg-transparent text-dark d-flex align-items-center p-0 w-100"
                  >
                    <span className="me-auto" style={{ fontSize: "16px" }}>
                      Affiliates (
                      {
                        filterableCreatives.filter(
                          (c) => c.type === "Affiliate"
                        ).length
                      }{" "}
                      available)
                    </span>
                    <span className="mb-1">
                      <ChevronRight size={18} strokeWidth={2} />
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
                          <input
                            ref={affiliateInputRef}
                            type="text"
                            placeholder="Type [/] to Search or press Enter"
                            value={searchQuery}
                            onChange={handleSearchQueryChange}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && searchQuery.trim()) {
                                e.preventDefault();
                                // Try to find matching creative in affiliates
                                const affiliateCreatives =
                                  filterableCreatives.filter(
                                    (c) => c.type === "Affiliate"
                                  );
                                const matchingCreative =
                                  affiliateCreatives.find(
                                    (c) =>
                                      c.name
                                        .toLowerCase()
                                        .includes(searchQuery.toLowerCase()) ||
                                      c.shop
                                        .toLowerCase()
                                        .includes(searchQuery.toLowerCase())
                                  );
                                if (matchingCreative) {
                                  handleSelectTag(matchingCreative);
                                }
                              }
                            }}
                            className="form-control mb-3"
                          />

                          {filterableCreatives
                            .filter((c) => c.type === "Affiliate")
                            .map((creative) => (
                              <div
                                className="d-flex align-items-center mb-3"
                                key={creative.id}
                              >
                                <input
                                  className="form-check-input me-2"
                                  type="checkbox"
                                  id={`filter-creative-${creative.id}`}
                                  checked={selectedTags.some(
                                    (tag) => tag.id === creative.id
                                  )}
                                  onChange={() => handleSelectTag(creative)}
                                />
                                <label
                                  className="form-check-label d-flex"
                                  htmlFor={`filter-creative-${creative.id}`}
                                  style={{ fontSize: "14px" }}
                                >
                                  <span className="col me-2">
                                    <CircleUser strokeWidth={1.5} size={42} />
                                  </span>
                                  <span className="w-100">
                                    {creative.name}
                                    <br />
                                    {creative.shop}
                                  </span>
                                </label>
                              </div>
                            ))}
                        </Card.Body>
                        <Card.Footer className="bg-transparent p-0 pt-3 d-flex justify-content-end">
                          <caption className="text-muted me-auto pt-2">
                            {selectedTags.length} selected
                          </caption>
                          <Button
                            variant="secondary"
                            className="btn-sm me-3"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowMenu(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            className="btn-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowMenu(false);
                            }}
                          >
                            Apply
                          </Button>
                        </Card.Footer>
                      </Card>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              {/* Add more filter categories here if needed */}
              <div className="rounded my-2">
                <Dropdown>
                  <Dropdown.Toggle
                    id="all-creatives-filter"
                    className="btn-sm border-0 bg-transparent text-dark d-flex align-items-center p-0 w-100"
                  >
                    <span className="me-auto" style={{ fontSize: "16px" }}>
                      All Creatives ({filterableCreatives.length} available)
                    </span>
                    <span className="mb-1">
                      <ChevronRight size={18} strokeWidth={2} />
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
                          <strong>All Creatives</strong>
                        </Card.Header>
                        <Card.Body className="p-0 mb-3">
                          <input
                            ref={allCreativesInputRef}
                            type="text"
                            placeholder="Type [/] to Search or press Enter"
                            value={searchQuery}
                            onChange={handleSearchQueryChange}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && searchQuery.trim()) {
                                e.preventDefault();
                                const matchingCreative =
                                  filterableCreatives.find(
                                    (c) =>
                                      c.name
                                        .toLowerCase()
                                        .includes(searchQuery.toLowerCase()) ||
                                      c.shop
                                        .toLowerCase()
                                        .includes(searchQuery.toLowerCase())
                                  );
                                if (matchingCreative) {
                                  handleSelectTag(matchingCreative);
                                }
                              }
                            }}
                            className="form-control mb-3"
                          />

                          {filterableCreatives.map((creative) => (
                            <div
                              className="d-flex align-items-center mb-3"
                              key={creative.id}
                            >
                              <input
                                className="form-check-input me-2"
                                type="checkbox"
                                id={`filter-all-creative-${creative.id}`}
                                checked={selectedTags.some(
                                  (tag) => tag.id === creative.id
                                )}
                                onChange={() => handleSelectTag(creative)}
                              />
                              <label
                                className="form-check-label d-flex"
                                htmlFor={`filter-all-creative-${creative.id}`}
                                style={{ fontSize: "14px" }}
                              >
                                <span className="col me-2">
                                  <CircleUser strokeWidth={1.5} size={42} />
                                </span>
                                <span className="w-100">
                                  {creative.name}
                                  <br />
                                  {creative.shop}
                                </span>
                              </label>
                            </div>
                          ))}
                        </Card.Body>
                        <Card.Footer className="bg-transparent p-0 pt-3 d-flex justify-content-end">
                          <caption className="text-muted me-auto pt-2">
                            {selectedTags.length} selected
                          </caption>
                          <Button
                            variant="secondary"
                            className="btn-sm me-3"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowMenu(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            className="btn-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowMenu(false);
                            }}
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

          <Row className="gap-3 mt-4">
            {TikTokPostsTab ? (
              <>
                {creativesLoading ? (
                  <Col size={12}>
                    <Alert variant="info" className="text-center">
                      <CircleQuestionMark
                        strokeWidth={1.5}
                        size={24}
                        className="mb-2"
                      />
                      <p className="mb-0">Loading creatives...</p>
                    </Alert>
                  </Col>
                ) : creativesError ? (
                  <Col size={12}>
                    <Alert variant="warning" className="text-center">
                      <CircleQuestionMark
                        strokeWidth={1.5}
                        size={24}
                        className="mb-2"
                      />
                      <p className="mb-0">{creativesError}</p>
                    </Alert>
                  </Col>
                ) : creativesWithVideos.length > 0 ? (
                  <Col size={12} className="d-flex flex-wrap gap-3">
                    {creativesWithVideos.map((creative) => {
                      const hasError = videoErrors.has(creative.id);
                      const isValid = isValidVideoPath(creative.video);

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
                          {isValid && !hasError && creative.video ? (
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
                              onError={() => {
                                console.error(
                                  "Video load error for creative:",
                                  creative.id,
                                  creative.video
                                );
                                handleVideoError(creative.id);
                              }}
                            >
                              Your browser does not support the video tag.
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
                          <p className="mt-2 mb-0" style={{ fontSize: "14px" }}>
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
                        No videos available to display. Please add videos to
                        your creatives.
                      </p>
                    </Alert>
                  </Col>
                )}
              </>
            ) : (
              <>
                {creativesLoading ? (
                  <Col size={12}>
                    <Alert variant="info" className="text-center">
                      <CircleQuestionMark
                        strokeWidth={1.5}
                        size={24}
                        className="mb-2"
                      />
                      <p className="mb-0">Loading creatives...</p>
                    </Alert>
                  </Col>
                ) : creativesError ? (
                  <Col size={12}>
                    <Alert variant="warning" className="text-center">
                      <CircleQuestionMark
                        strokeWidth={1.5}
                        size={24}
                        className="mb-2"
                      />
                      <p className="mb-0">{creativesError}</p>
                    </Alert>
                  </Col>
                ) : affiliateCreatives.length > 0 ? (
                  <Col size={12} className="d-flex flex-wrap gap-3">
                    {affiliateCreatives.map((creative) => {
                      const hasError = videoErrors.has(creative.id);
                      const isValid = isValidVideoPath(creative.video);

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
                          {isValid && !hasError && creative.video ? (
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
                              onError={() => {
                                console.error(
                                  "Video load error for creative:",
                                  creative.id,
                                  creative.video
                                );
                                handleVideoError(creative.id);
                              }}
                            >
                              Your browser does not support the video tag.
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
                                className="mb-0 text-center px-2"
                                style={{ fontSize: "14px" }}
                              >
                                No video available
                              </p>
                            </div>
                          )}
                          <p className="mt-2 mb-0" style={{ fontSize: "14px" }}>
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
                      <p className="mb-0">No affiliate creatives available.</p>
                    </Alert>
                  </Col>
                )}
              </>
            )}
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
}
