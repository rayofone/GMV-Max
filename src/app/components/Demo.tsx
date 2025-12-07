"use client";

import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge,
  Alert,
} from "react-bootstrap";
import Link from "next/link";
import ContentSideNav from "./ContentSideNav";

export default function Demo() {
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

      <div
        style={{ display: "flex", flex: 1, minHeight: "calc(100vh - 56px)" }}
      >
        <Container className="py-3" style={{ flex: 1, overflowY: "auto" }}>
          <Row>
            {/* Left column: content-side nav (auto width) */}
            <Col xs="auto" className="pe-0">
              <div
                style={{
                  position: "sticky",
                  top: 56,
                  height: "calc(100vh - 56px)",
                  alignSelf: "flex-start",
                  marginRight: "20px",
                }}
              >
                <ContentSideNav />
              </div>
            </Col>

            {/* Right column: main content canvas */}
            <Col>
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
                          based on TikTok's top-selling product categories,
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

              <Row className="g-4">
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
                      <p className="h4 mb-0 text-primary">0</p>
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
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
