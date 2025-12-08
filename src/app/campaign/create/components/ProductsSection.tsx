"use client";

import React from "react";
import { Card, Col, Button } from "react-bootstrap";

export default function ProductsSection() {
  return (
    <Col sm={12} className="mb-4">
      <Card>
        <Card.Body>
          <Card.Title className="text-dark mb-3">Products</Card.Title>
          {/* <Card.Text>Maximize your product sales during real-time livestreams.</Card.Text> */}
          <Col className="my-4">
            <input
              className="form-check-input me-1"
              type="radio"
              value=""
              id="firstCheckbox"
            />
            <label className="form-check-label" htmlFor="firstCheckbox">
              All products
            </label>
          </Col>
          <Col className="my-2 mb-4">
            <input
              className="form-check-input me-1"
              type="radio"
              value=""
              id="secondCheckbox"
            />
            <label className="form-check-label mb-2" htmlFor="secondCheckbox">
              Selected products
            </label>
            <br />
            <Button variant="secondary" className="btn-sm">
              Select products
            </Button>
          </Col>
          <Col className="my-2">
            <input
              className="form-check-input me-1"
              type="radio"
              value=""
              id="thirdCheckbox"
            />
            <label className="form-check-label" htmlFor="thirdCheckbox">
              New products
            </label>
          </Col>
        </Card.Body>
      </Card>
    </Col>
  );
}

