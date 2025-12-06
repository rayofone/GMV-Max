"use client";

import React from "react";
import { Card, Form, Col } from "react-bootstrap";
import { CircleQuestionMark } from "lucide-react";

export default function Step3() {
  return (
    <Col sm={12} className="mb-4">
      <Card>
        <Card.Body>
          <Card.Title className="text-dark mb-2 d-flex">
            <p style={{ fontSize: "16px" }} className="fw-bold">
              Step 3:
            </p>
            <p style={{ fontSize: "16px" }} className="text-muted ms-2">
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
                    Prioritize performance testing for your new, recently
                    authorized, and updated videos as part of your campaign
                  </small>
                </div>
              }
            />
          </Form>
        </Card.Body>
      </Card>
    </Col>
  );
}

