"use client";

import React from "react";
import {
  Card,
  Row,
  Col,
  Alert,
  Dropdown,
  Badge,
  Collapse,
  Button,
} from "react-bootstrap";
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
import type { Account, Creative } from "@/contexts/FirebaseContext";

interface Step2Props {
  // Accounts
  availableAccounts: Account[];
  accountsLoading: boolean;
  accountsError: string | null;
  filteredAccounts: Account[];
  searchTerm: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedAccountIds: string[];
  handleAccountToggle: (accountId: string) => void;

  // Creatives for exclusion
  filteredCreatives: Creative[];
  searchCreativeTerm: string;
  handleCreativeSearchChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  excludedCreativeIds: (string | number)[];
  handleCreativeToggle: (creativeId: string | number) => void;
  exclusionsToDisplay: Creative[];

  // Advanced settings
  advancedOpen: boolean;
  setAdvancedOpen: (open: boolean) => void;
}

export default function Step2({
  availableAccounts,
  accountsLoading,
  accountsError,
  filteredAccounts,
  searchTerm,
  handleSearchChange,
  selectedAccountIds,
  handleAccountToggle,
  filteredCreatives,
  searchCreativeTerm,
  handleCreativeSearchChange,
  excludedCreativeIds,
  handleCreativeToggle,
  exclusionsToDisplay,
  advancedOpen,
  setAdvancedOpen,
}: Step2Props) {
  return (
    <Col sm={12} className="mb-4">
      <Card>
        <Card.Body>
          <Card.Title className="text-dark mb-2 d-flex">
            <p style={{ fontSize: "16px" }} className="fw-bold">
              Step 2:
            </p>
            <p style={{ fontSize: "16px" }} className="text-muted ms-2">
              {" "}
              Select your creative sources
            </p>
          </Card.Title>

          {/* SOURCES */}
          <div className="gap-5 d-flex align-items-center">
            <div className="d-flex align-items-center">
              <p style={{ fontSize: "14px" }} className="fw-bold pt-3">
                Source:
              </p>
              <Dropdown className="ms-3">
                <Dropdown.Toggle
                  variant="secondary"
                  id="dropdown-basic"
                  className="btn-sm border-0"
                >
                  <span className="me-3">Creative sources (All)</span>
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

            {/* ACCOUNTS */}
            <div className="d-flex align-items-center">
              <p style={{ fontSize: "14px" }} className="fw-bold pt-3">
                Selected accounts:
              </p>
              <Dropdown className="ms-3 h-100">
                <Dropdown.Toggle
                  variant="secondary"
                  id="dropdown-basic"
                  className="btn-sm border-0"
                >
                  <span className="me-3">
                    TikTok accounts ({selectedAccountIds.length})
                  </span>
                  <span className="mb-1">
                    <ChevronDown size={16} strokeWidth={2} />
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="border-1 border-secondary shadow-sm"
                  style={{
                    width: "750px",
                    maxHeight: "600px",
                    overflowY: "auto",
                  }}
                >
                  <Card style={{ width: "700px" }}>
                    <Card.Body style={{ width: "100%" }}>
                      <Card.Title className="mb-2">
                        TikTok accounts:{" "}
                      </Card.Title>
                      <Card.Text className="text-muted">
                        Include as many available TikTok accounts in your
                        campaign as possible to ensure sufficient creative
                        supply for your ads.
                      </Card.Text>
                      <Col className="mb-3">
                        <input
                          type="text"
                          placeholder="Type [/] to Search Post ID or Caption"
                          value={searchTerm}
                          onChange={handleSearchChange}
                          className="form-control mb-3"
                        />
                      </Col>

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
                                maxHeight: "350px",
                                overflowY: "auto",
                              }}
                            >
                              <Card.Text className="mb-0 text-dark">
                                Available
                              </Card.Text>
                              {accountsLoading ? (
                                <div className="my-3 text-muted">
                                  <small>Loading accounts...</small>
                                </div>
                              ) : accountsError ? (
                                <Alert variant="warning" className="my-3 py-2">
                                  <small>{accountsError}</small>
                                </Alert>
                              ) : (
                                (() => {
                                  // Filter by status "Authorized" and apply search filter
                                  const authorizedAccounts =
                                    filteredAccounts.filter(
                                      (account) =>
                                        account.status === "Authorized"
                                    );
                                  return authorizedAccounts.length > 0 ? (
                                    authorizedAccounts.map((account, index) => {
                                      const accountId =
                                        account.id || `temp-${index}`;
                                      const isChecked =
                                        account.status === "Authorized" ||
                                        selectedAccountIds.includes(accountId);

                                      return (
                                        <div className="my-3" key={accountId}>
                                          <input
                                            className="form-check-input me-2"
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() =>
                                              handleAccountToggle(accountId)
                                            }
                                            id={`account-${accountId}`}
                                          />
                                          <label
                                            className="form-check-label text-muted"
                                            htmlFor={`account-${accountId}`}
                                          >
                                            <small>{account.name}</small>
                                            <div className="badge bg-secondary text-muted ms-3">
                                              {account.type}
                                            </div>
                                          </label>
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <div className="my-3 text-muted">
                                      <small>
                                        No authorized accounts found.
                                      </small>
                                    </div>
                                  );
                                })()
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
                                maxHeight: "350px",
                                overflowY: "auto",
                              }}
                            >
                              <Card.Text className="mb-3 text-dark">
                                Unauthorized
                              </Card.Text>

                              {accountsLoading ? (
                                <div className="my-3 text-muted">
                                  <small>Loading accounts...</small>
                                </div>
                              ) : accountsError ? (
                                <Alert variant="warning" className="my-3 py-2">
                                  <small>{accountsError}</small>
                                </Alert>
                              ) : (
                                (() => {
                                  const unauthorizedAccounts =
                                    availableAccounts.filter(
                                      (account) =>
                                        account.status === "Unauthorized"
                                    );
                                  return unauthorizedAccounts.length > 0 ? (
                                    unauthorizedAccounts.map(
                                      (account, index) => (
                                        <div
                                          key={
                                            account.id ||
                                            `unauthorized-${index}`
                                          }
                                          className="row d-flex align-items-center mb-3"
                                        >
                                          <div className="col">
                                            <p className="text-muted p-0 m-0">
                                              {account.name}
                                            </p>
                                            <div className="badge bg-secondary text-muted">
                                              {account.type}
                                            </div>
                                          </div>
                                          <div className="col">
                                            <p className="text-primary float-end">
                                              <small>Get permission</small>
                                            </p>
                                          </div>
                                        </div>
                                      )
                                    )
                                  ) : (
                                    <div className="my-3 text-muted">
                                      <small>No unauthorized accounts.</small>
                                    </div>
                                  );
                                })()
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-end gap-2 pt-3">
                      <Button variant="secondary" size="sm">
                        Cancel
                      </Button>
                      <Button variant="primary" size="sm">
                        Apply
                      </Button>
                    </Card.Footer>
                  </Card>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {/* ADDITIONAL */}
            <div className="d-flex align-items-center">
              <p style={{ fontSize: "14px" }} className="fw-bold pt-3">
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

          {/* EXCLUSION */}
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
                    <p style={{ fontSize: "14px" }} className="fw-bold pt-3">
                      Excluded videos:{" "}
                    </p>
                    <Dropdown className="ms-3" style={{ width: "250px" }}>
                      <Dropdown.Toggle
                        variant="secondary"
                        id="dropdown-basic"
                        className="btn-sm border-0 d-flex align-items-center"
                      >
                        <span className="me-2 mb-1">
                          <Plus size={16} strokeWidth={2} />
                        </span>
                        <span className="me-4">
                          Exclusion filter ({excludedCreativeIds.length})
                        </span>
                        <span className=" mb-1">
                          <CircleQuestionMark strokeWidth={1.5} size={16} />
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
                                      type="text"
                                      placeholder="Type [/] to Search"
                                      value={searchCreativeTerm}
                                      onChange={handleCreativeSearchChange}
                                      className="form-control mb-3"
                                    />

                                    {filteredCreatives.map((creative) => (
                                      <div
                                        className="d-flex align-items-center mb-3 "
                                        key={creative.id}
                                      >
                                        <input
                                          className="form-check-input me-2"
                                          type="checkbox"
                                          id={`creative${creative.id}`}
                                          onChange={() =>
                                            handleCreativeToggle(creative.id)
                                          }
                                        />
                                        <label
                                          className="form-check-label d-flex"
                                          htmlFor={`creative${creative.id}`}
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
                                    ))}
                                  </Card.Body>
                                  <Card.Footer className="bg-transparent p-0 pt-3 d-flex justify-content-end">
                                    <caption className="text-muted me-auto pt-2">
                                      {excludedCreativeIds.length} selected
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
                            bg="secondary"
                            className="me-2 my-1 d-flex align-items-center text-muted"
                          >
                            {creative.type} ({creative.id})
                            <X
                              size={14}
                              className="ms-1 cursor-pointer"
                              onClick={() => handleCreativeToggle(creative.id)}
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
  );
}
