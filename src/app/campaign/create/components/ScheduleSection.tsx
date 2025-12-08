"use client";

import React from "react";
import { Card, Col, Form } from "react-bootstrap";

export default function ScheduleSection() {
  return (
    <Col sm={12} className="mb-4">
      <Card>
        <Card.Body>
          <Card.Title className="text-dark mb-3">Schedule</Card.Title>
          <Form.Group className="mb-3">
            <Form.Control type="date" className="form-control" />
          </Form.Group>
          <select className="form-select mb-2">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <small className="text-muted">
            Run campaign continuously after the scheduled start time
          </small>
        </Card.Body>
      </Card>
    </Col>
  );
}

