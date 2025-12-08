"use client";

import React from "react";
import { Card, Form, Col } from "react-bootstrap";

interface CampaignNameSectionProps {
  campaignName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CampaignNameSection({
  campaignName,
  onChange,
}: CampaignNameSectionProps) {
  return (
    <Col sm={12} className="mb-4">
      <Card>
        <Card.Body>
          <Card.Title className="text-dark mb-3">Campaign name</Card.Title>
          <Form.Control
            type="text"
            name="campaignName"
            placeholder="Enter campaign name"
            value={campaignName}
            onChange={onChange}
            required
          />
        </Card.Body>
      </Card>
    </Col>
  );
}

