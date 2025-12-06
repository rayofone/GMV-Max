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
import {
  CircleUser,
  CircleQuestionMark,
  X,
} from "lucide-react";
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
  const inputRef = useRef<HTMLInputElement>(null);

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
                      "border border-bottom border-top-0 border-start-0 border-end-0" +
                      (TikTokPostsTab
                        ? " border-primary text-dark"
                        : "border-secondary text-dark")
                    }
                    onClick={onTikTokPostsClick}
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
              onClick={() => inputRef.current?.focus()}
            >
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTag(tag.id);
                      }}
                    />
                  </Badge>
                ))}

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
                  onFocus={() => setShowMenu(true)}
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
                  className="border-0 flex-grow-1 w-100 px-2"
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
                  onClick={handleClearAll}
                >
                  Clear
                </Button>
              ) : (
                <></>
              )}
            </div>

            <Dropdown.Menu
              show={showMenu}
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
                    onClick={() => handleSelectTag(creative)}
                  >
                    <div className="d-flex align-items-center">
                      <CircleUser
                        strokeWidth={1.5}
                        size={30}
                        className="me-2"
                      />
                      <div>
                        <div className="fw-bold">{creative.name}</div>
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
                              onError={() => handleVideoError(creative.id)}
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
                        No videos available to display. Please add videos to
                        your creatives.
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
  );
}

