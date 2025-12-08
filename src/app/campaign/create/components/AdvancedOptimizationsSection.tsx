"use client";

import React from "react";
import { Card, Col } from "react-bootstrap";

export default function AdvancedOptimizationsSection() {
  return (
    <Col sm={12} className="mb-4">
      <Card>
        <Card.Body>
          <Card.Title className="text-dark mb-3">
            Advanced optimizations
          </Card.Title>
          <Card.Text>
            Plan ahead to improve your ad delivery during promotion days and
            pre-promotion days.
          </Card.Text>

          <Card.Text className="mb-0">
            <h6 className="text-dark font-normal mb-0">Special events</h6>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}

