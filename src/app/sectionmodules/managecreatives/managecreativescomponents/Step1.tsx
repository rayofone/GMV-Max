"use client";

import React from "react";
import { Card, Button, Col } from "react-bootstrap";

interface Step1Props {
  onModeChange: (value: boolean) => void;
}

export default function Step1({ onModeChange, isManualMode }: Step1Props) {
  return (
    <Col sm={12} className="mb-4">
      <Card>
        <Card.Body>
          <Card.Title className="text-dark mb-2 d-flex">
            <p style={{ fontSize: "16px" }} className="fw-bold">
              Step 1:
            </p>
            <p style={{ fontSize: "16px" }} className="text-muted ms-2">
              {" "}
              Select your creative mode
            </p>
          </Card.Title>
          {isManualMode ? (
            <>
              <Card.Text className="m-0">
                <span className="text-dark">Mode: </span>
                <span className="text-muted"> Autoselect</span>
              </Card.Text>
              <Card.Text className="align-items-center d-flex">
                Autoselect ad creative optimizes your campaign performance with
                available posts.
                <Button
                  className="ms-1 btn btn-link p-0 bg-transparent border-0 text-primary text-decoration-none"
                  onClick={() => onModeChange(false)}
                >
                  <small> Switch to manual</small>
                </Button>
              </Card.Text>
            </>
          ) : (
            <>
              <Card.Text className="m-0">
                <span className="text-dark">Mode: </span>
                <span className="text-muted"> Manual</span>
              </Card.Text>
              <Card.Text className="align-items-center d-flex">
                Select up to 400 authorized, affiliate, customized posts, or
                upload videos.
                <Button
                  className="ms-1 btn btn-link p-0 bg-transparent border-0 text-primary text-decoration-none"
                  onClick={() => onModeChange(true)}
                >
                  <small> Switch to autoselect</small>
                </Button>
              </Card.Text>
            </>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
}
