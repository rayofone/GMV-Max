"use client";

import React from "react";
import { Card, Col, Accordion, Form } from "react-bootstrap";

export default function OptimizationBudgetSection() {
  return (
    <Col sm={12} className="mb-4">
      <Card>
        <Card.Body>
          <Card.Title className="text-dark mb-3">
            Optimization and budget
          </Card.Title>
          <Card.Text>
            <h6 className="text-dark">Optimization goal</h6>
          </Card.Text>
          {/* <Alert
            variant="info"
            className="mb-4 bg-info-light text-dark border-0"
          >
            Your campaign is eligible for ROI protection. You will
            receive an ad credit if 90% of your target ROI is not met
            and your campaign meets other eligibility criteria.
            <a href="#" className="text-primary">
              {" "}
              View details
            </a>
          </Alert> */}
          <Card.Text className="mb-0">
            <p className="text-dark font-normal mb-0">Gross Revenue</p>
          </Card.Text>
          <Card.Text className="mb-3">
            Maximize your gross revenue while achieving your target return on
            investment (ROI).
          </Card.Text>
          <hr className="dropdown-divider my-4 border border-secondary" />
          <Col className="my-2 mb-3">
            <label htmlFor="roiTarget" className="form-label">
              Product ROI target
            </label>
            <input
              type="text"
              className="form-control"
              id="roiTarget"
              placeholder="2.0"
            />
          </Col>
          <Accordion defaultActiveKey="" className="">
            <Accordion.Item
              eventKey="0"
              className=""
              style={{ backgroundColor: "#f8f9fa" }}
            >
              <Accordion.Header
                className=""
                style={{ backgroundColor: "#f8f9fa", border: "none" }}
              >
                A target of 2 is recommended to increase your gross revenue
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  <strong>How are ROI recommendations calculated?</strong>
                </p>
                <p>
                  ROI target recommendations are based on real-time market data
                  and your historical ROI settings. They are designed to help
                  you increase your gross revenue. -Product ROI is the
                  product&apos;s total gross revenue (not including LIVE)
                  divided by the ad cost -You can choose whether or not to adopt
                  these recommendations based on your specific business situation
                  and profit margins
                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <hr className="dropdown-divider my-4 border border-secondary" />
          <Col className="my-2 mb-3">
            <label htmlFor="dailyBudget" className="form-label">
              Daily budget
            </label>
            <input
              type="text"
              className="form-control"
              id="dailyBudget"
              placeholder="200.00 USD"
            />
          </Col>
          <Accordion defaultActiveKey="" className="">
            <Accordion.Item
              eventKey="0"
              className=""
              style={{ backgroundColor: "#f8f9fa" }}
            >
              <Accordion.Header
                className=""
                style={{ backgroundColor: "#f8f9fa", border: "none" }}
              >
                A target of 2 is recommended to increase your gross revenue
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  <strong>How are ROI recommendations calculated?</strong>
                </p>
                <p>
                  A daily budget of 200.00 USD is recommended based on your
                  previous ads spending. Budget will only be spent when your ROI
                  target is met.
                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <hr className="dropdown-divider my-4 border border-secondary" />
          <Form className="mb-3">
            <Form.Check // prettier-ignore
              type="switch"
              id="custom-switch"
              label={
                <div>
                  Auto budget increase{" "}
                  <span className="text-primary"> View details</span>
                  <br />
                  <small className="text-muted">
                    Allow your daily budget to be automatically increased to
                    optimize your campaign for higher gross revenue when your
                    ROI target is met and your budget is about to run out.
                  </small>
                </div>
              }
            />
          </Form>
          <Card>
            <Card.Body className="p-3 bg-secondary rounded">
              <div className="d-flex align-items-center">
                <small className="text-muted me-3">
                  <span className="me-2">Increase amount:</span>
                  <span className="text-dark">$100.00 USD</span>
                </small>
                <small className="text-muted me-3">
                  <span className="me-2">Increase limit:</span>
                  <span className="text-dark">10 times</span>
                </small>
                <small className="text-muted">
                  <span className="me-2">Budget amount:</span>
                  <span className="text-dark">$1,000.00 USD</span>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </Col>
  );
}

