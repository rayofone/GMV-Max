"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge,
  Alert,
  Table,
  Form,
  Dropdown,
} from "react-bootstrap";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { getCampaigns, updateCampaign } from "@/lib/firebaseAdmin";
import { useAuth } from "@/contexts/AuthContext";
import type { Campaign } from "@/types/admin";
import ContentSideNav from "./ContentSideNav";

export default function Demo() {
  const { currentUser } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Always try to load campaigns, even if user is not logged in
    // The function will handle errors gracefully
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const campaignsData = await getCampaigns();
      setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
    } catch (err) {
      console.error("Error loading campaigns:", err);
      setError("Failed to load campaigns. Please refresh the page.");
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnabled = async (campaign: Campaign) => {
    if (!campaign.id) return;
    try {
      await updateCampaign(campaign.id, {
        enabled: !campaign.enabled,
      });
      loadCampaigns();
    } catch (err) {
      console.error("Error updating campaign:", err);
    }
  };

  const formatCurrency = (value?: string) => {
    try {
      if (!value || typeof value !== "string" || value.trim() === "") return "";
      // If already formatted, return as is
      if (value.startsWith("$")) return value;
      // Try to parse as number and format
      const num = parseFloat(value);
      if (isNaN(num)) return "";
      return `$${num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    } catch {
      return "";
    }
  };

  const formatDate = (date?: string) => {
    try {
      if (!date || typeof date !== "string" || date.trim() === "") return "";
      return new Date(date).toLocaleDateString();
    } catch {
      return "";
    }
  };

  return (
    <>
      {/* HEADER */}
      <Container className="mt-5 pt-5 pt-3">
        <Row className="mb-1">
          <Col>
            <div className="d-flex gap-3 mb-3 align-items-center">
              <span className="title mb-0">Ads dashboard</span>
              <span className="text-primary">Tutorial & Help</span>
              <div className="float-end ms-auto d-flex gap-2">
                <Link
                  href="/campaign/create?createNew=true"
                  className="btn btn-primary btn-sm"
                >
                  Create GMV Max ads
                </Link>
                <Link
                  href="/campaign/create"
                  className="btn btn-secondary btn-sm"
                >
                  Create Custom Shop ads
                </Link>
              </div>
            </div>
            {/* <p className="lead">Manage your campaigns and track performance metrics.</p> */}
          </Col>
        </Row>
      </Container>

      {/* MAIN CONTENT */}
      <div
        style={{
          display: "flex",
          flex: 1,
          minHeight: "calc(100vh - 56px)",
          flexWrap: "nowrap",
          overflowX: "auto",
        }}
      >
        <Container
          className="py-3"
          style={{ flex: 1, overflowY: "auto", minWidth: 0 }}
        >
          <Row className="g-0" style={{ flexWrap: "nowrap" }}>
            {/* LEFT COLUMN: SIDENAV */}
            <Col
              xs="auto"
              className="pe-0"
              style={{ flexShrink: 0, minWidth: "auto" }}
            >
              <div
                style={{
                  position: "sticky",
                  top: 0,
                  height: "100vh",
                  alignSelf: "flex-start",
                  marginRight: "20px",
                }}
              >
                <ContentSideNav />
              </div>
            </Col>

            {/* RIGHT COLUMN: MAIN CONTENT CANVAS */}
            <Col style={{ minWidth: 0, flex: 1 }}>
              {/* GROWTH CENTER */}
              <Row className="mb-4">
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title className="align-items-center">
                        <div className="row">
                          <div className="col d-flex align-items-center m-0">
                            <span className="m-0 p-0">
                              Quick actions and recommendations to drive more
                              sales
                            </span>
                            <Badge
                              style={{ fontSize: "0.5rem" }}
                              className="rounded-circle mx-2 bg-info "
                            >
                              1
                            </Badge>
                          </div>
                        </div>
                      </Card.Title>

                      <Alert
                        variant="secondary border-0"
                        style={{ backgroundColor: "#F8F8F8" }}
                      >
                        <p>
                          <strong>
                            Increase sales on 6 recommended products with GMV
                            Max ads
                          </strong>
                          <span className="btn-close float-end" />
                        </p>
                        <p>
                          Recommended products are items from your catalog that
                          shoppers on TikTok may be interested in purchasing,
                          based on TikTok&apos;s top-selling product categories,
                          trending products and most searched keywords.
                        </p>
                        <div className="row">
                          <div className="col d-flex justify-content-end ">
                            <div className="btn btn-secondary btn-sm">
                              Create ads
                            </div>
                          </div>
                        </div>
                      </Alert>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* SHOPPING ADS DEMO ACCOUNT */}
              <Row className="mb-4">
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title className="my-3">
                        <div className="row">
                          <div className="col d-flex align-items-center m-0">
                            <span className="m-0 p-0">
                              Shopping Ads Demo Account
                            </span>
                            <Badge
                              pill
                              className="mx-2 bg-info-light text-info badge-sm"
                              style={{ fontSize: "0.75rem" }}
                            >
                              Primary
                            </Badge>
                            <div className="ms-auto">
                              <div className="btn btn-text text-primary btn-sm">
                                Manage account
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card.Title>
                      <div
                        className="border border-secondary"
                        style={{ height: "1px" }}
                      />
                      <Link
                        href="/campaigns/create"
                        className="btn btn-info btn-sm text-white my-3 float-end"
                      >
                        Coupon progress
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* GMV MAX ADS DEMO ACCOUNT */}
              <Row className="g-4 mb-4">
                <Col md={4}>
                  <Card>
                    <Card.Body>
                      <Card.Title>Total GMV</Card.Title>
                      <p className="h4 mb-0 text-success">$0.00</p>
                      <small className="text-muted">Current period</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card>
                    <Card.Body>
                      <Card.Title>Active Campaigns</Card.Title>
                      <p className="h4 mb-0 text-primary">
                        {
                          campaigns.filter(
                            (c) =>
                              c && c.enabled === true && c.status === "Active"
                          ).length
                        }
                      </p>
                      <small className="text-muted">Campaigns running</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card>
                    <Card.Body>
                      <Card.Title>Total Budget</Card.Title>
                      <p className="h4 mb-0 text-info">$0.00</p>
                      <small className="text-muted">Allocated budget</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* CAMPAIGNS TABLE */}
              <Row>
                <Col>
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h2>Campaigns</h2>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Table hover>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Type</th>
                          <th>Shop</th>
                          <th>Account</th>
                          <th>User</th>
                          <th>Budget</th>
                          <th>Dates</th>
                          <th>Creatives</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Campaign Placeholder 1</td>
                          <td>
                            <Badge bg="primary">products</Badge>
                          </td>
                          <td>Shop Placeholder</td>
                          <td>Account Placeholder</td>
                          <td>User Placeholder</td>
                          <td>$1000</td>
                          <td>2024-01-01 - 2024-12-31</td>
                          <td>5</td>
                          <td>
                            <Button variant="link" size="sm">
                              Edit
                            </Button>
                            <Button variant="link" size="sm">
                              Delete
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td>Campaign Placeholder 2</td>
                          <td>
                            <Badge bg="info">LIVE</Badge>
                          </td>
                          <td>Shop Placeholder</td>
                          <td>Account Placeholder</td>
                          <td>User Placeholder</td>
                          <td>$2000</td>
                          <td>2024-02-01 - 2024-12-31</td>
                          <td>10</td>
                          <td>
                            <Button variant="link" size="sm">
                              Edit
                            </Button>
                            <Button variant="link" size="sm">
                              Delete
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
