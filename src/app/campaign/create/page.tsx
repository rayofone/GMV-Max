"use client";

import React, { useState } from "react";
import {
  Container,
  Form,
  InputGroup,
  Button,
  Card,
  Row,
  Col,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Accordion,
} from "react-bootstrap";
import Link from "next/link";

export default function CreateCampaign() {
  const [formData, setFormData] = useState({
    campaignName: "",
    budget: "",
    startDate: "",
    endDate: "",
    targetAudience: "",
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [pgm, setPgm] = useState(true);

  const handlePgmChange = (value: boolean) => {
    setPgm(value);
  };

  console.log("pgm selected:", pgm);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would typically send the data to your backend
    console.log("Campaign Data:", formData);

    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({
        campaignName: "",
        budget: "",
        startDate: "",
        endDate: "",
        targetAudience: "",
        description: "",
      });
      setSubmitted(false);
    }, 2000);
  };

  return (
    <Container className="py-5 mt-5">
      {/* HEADER */}
      <Row className="mb-1 ">
        <Col>
          <div className="d-flex gap-3 mb-3 align-items-center">
            <Link href="/" className="btn btn-secondary">
              ←
            </Link>
            <span className="title mb-0">Create campaign</span>
          </div>
        </Col>
      </Row>

      {/* NOTIFICATION */}
      {submitted && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setSubmitted(false)}
        >
          Campaign created successfully! Redirecting...
        </Alert>
      )}

      <Row>
        <Col lg={9}>
          {/* <Row className="mb-4">
                <div
                    type="radio" 
                    name="options" 
                    className="d-flex gap-3" 
                    value={pgm} // Control the component state with your 'pgm' state
                    onChange={handlePgmChange} // Use onChange prop
                >
                    <Col sm={6}> 
                        <Card className="h-100">
                            <div id="tbg-radio-1" value={true} className="h-100 text-start bg-white border-0">
                                <Card.Body>
                                    <Card.Title className='text-dark'>Promote products</Card.Title>
                                    <Card.Text>Maximize your product sales with images and videos.</Card.Text>
                                </Card.Body>
                            </div>
                        </Card>
                    </Col>
                    <Col sm={6}>
                    <Card className="h-100">
                            <div id="tbg-radio-2" className="text-start bg-white border-0" value={false}>
                                <Card.Body>
                                    <Card.Title className='text-dark'>Promote LIVE</Card.Title>
                                    <Card.Text>Maximize your product sales during real-time livestreams.</Card.Text>
                                </Card.Body>
                            </div>
                        </Card> 
                        
                    </Col>
                </div>
            </Row> */}

          <Row className="mb-4">
            <Col sm={6}>
              <Card
                className={`h-100 ${
                  pgm === true ? "border border-primary shadow-sm" : ""
                }`}
              >
                {/* Use a regular Button for the click target */}
                <Button
                  variant="link" // Use link variant to remove button default styling
                  onClick={() => handlePgmChange(true)}
                  className="h-100 text-start w-100 text-decoration-none"
                >
                  <Card.Body>
                    <Card.Title className="text-dark">
                      Promote products
                    </Card.Title>
                    <Card.Text>
                      Maximize your product sales with images and videos.
                    </Card.Text>
                  </Card.Body>
                </Button>
              </Card>
            </Col>

            <Col sm={6}>
              <Card
                className={`h-100 ${
                  pgm === false ? "border border-primary shadow-sm" : ""
                }`}
              >
                {/* Use a regular Button for the click target */}
                <Button
                  variant="link" // Use link variant to remove button default styling
                  onClick={() => handlePgmChange(false)}
                  className="h-100 text-start w-100 text-decoration-none"
                >
                  <Card.Body>
                    <Card.Title className="text-dark">Promote LIVE</Card.Title>
                    <Card.Text>
                      Maximize your product sales during real-time livestreams.
                    </Card.Text>
                  </Card.Body>
                </Button>
              </Card>
            </Col>
          </Row>

          {pgm ? (
            <Row className="mb-4">
              {/* Products */}
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
                      <label
                        className="form-check-label"
                        htmlFor="firstCheckbox"
                      >
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
                      <label
                        className="form-check-label mb-2"
                        htmlFor="secondCheckbox"
                      >
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
                      <label
                        className="form-check-label"
                        htmlFor="thirdCheckbox"
                      >
                        New products
                      </label>
                    </Col>
                  </Card.Body>
                </Card>
              </Col>
              {/* Optimization and budget */}
              <Col sm={12} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-dark mb-3">
                      Optimization and budget
                    </Card.Title>
                    <Card.Text>
                      <h6 className="text-dark">Optimization goal</h6>
                    </Card.Text>
                    <Alert
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
                    </Alert>
                    <Card.Text className="mb-0">
                      <h6 className="text-dark font-normal mb-0">
                        Gross Revenue
                      </h6>
                    </Card.Text>
                    <Card.Text className="mb-3">
                      Maximize your gross revenue while achieving your target
                      return on investment (ROI).
                    </Card.Text>
                    <hr className="dropdown-divider my-4 border border-secondary" />
                    <Col className="my-2 mb-3">
                      <label
                        htmlFor="floatingInputValue"
                        className="form-label"
                      >
                        Product ROI target
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="floatingInputValue"
                        placeholder="2.0"
                      />
                    </Col>
                    <Accordion defaultActiveKey="0" className="">
                      <Accordion.Item
                        eventKey="0"
                        className=""
                        style={{ backgroundColor: "#f8f9fa" }}
                      >
                        <Accordion.Header
                          className=""
                          style={{ backgroundColor: "#f8f9fa", border: "none" }}
                        >
                          A target of 2 is recommended to increase your gross
                          revenue
                        </Accordion.Header>
                        <Accordion.Body>
                          <p>
                            <strong>
                              How are ROI recommendations calculated?
                            </strong>
                          </p>
                          <p>
                            ROI target recommendations are based on real-time
                            market data and your historical ROI settings. They
                            are designed to help you increase your gross
                            revenue. -Product ROI is the product`&apos;`s total
                            gross revenue (not including LIVE) divided by the ad
                            cost -You can choose whether or not to adopt these
                            recommendations based on your specific business
                            situation and profit margins
                          </p>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                    <hr className="dropdown-divider my-4 border border-secondary" />
                    <Col className="my-2 mb-3">
                      <label
                        htmlFor="floatingInputValue"
                        className="form-label"
                      >
                        Daily budget
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="floatingInputValue"
                        placeholder="200.00 USD"
                      />
                    </Col>
                    <Accordion defaultActiveKey="0" className="">
                      <Accordion.Item
                        eventKey="0"
                        className=""
                        style={{ backgroundColor: "#f8f9fa" }}
                      >
                        <Accordion.Header
                          className=""
                          style={{ backgroundColor: "#f8f9fa", border: "none" }}
                        >
                          A target of 2 is recommended to increase your gross
                          revenue
                        </Accordion.Header>
                        <Accordion.Body>
                          <p>
                            <strong>
                              How are ROI recommendations calculated?
                            </strong>
                          </p>
                          <p>
                            A daily budget of 200.00 USD is recommended based on
                            your previous ads spending. Budget will only be
                            spent when your ROI target is met.
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
                              Allow your daily budget to be automatically
                              increased to optimize your campaign for higher
                              gross revenue when your ROI target is met and your
                              budget is about to run out.
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

              {/* Advanced optimizations */}
              <Col sm={12} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-dark mb-3">
                      Advanced optimizations
                    </Card.Title>
                    <Card.Text>
                      Plan ahead to improve your ad delivery during promotion
                      days and pre-promotion days.
                    </Card.Text>

                    <Card.Text className="mb-0">
                      <h6 className="text-dark font-normal mb-0">
                        Special events
                      </h6>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              {/* Ad creative */}
              <Col sm={12} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-dark mb-3">
                      Ad creative
                      <Link
                        className="btn btn-secondary btn-sm float-end"
                        href="/sectionmodules/managecreatives"
                      >
                        Edit
                      </Link>
                    </Card.Title>
                    <Card.Text>
                      Autoselecting ad creatives optimizes your campaign
                      performance by using the best available posts and images
                      featuring your products. Your creative will appear in the
                      format of video, carousel and product card. Manage
                      creatives to view, add or manually select posts to promote
                      your products.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              {/* Schedule */}
              <Col sm={12} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-dark mb-3">Schedule</Card.Title>
                  </Card.Body>
                </Card>
              </Col>

              {/* Brand safety and suitability */}
              <Col sm={12} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-dark mb-3">
                      Brand safety and suitability
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>

              {/* Campaign name */}
              <Col sm={12} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-dark mb-3">
                      Campaign name
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>

              {/* Disclaimer block */}
              <Col sm={12} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Text className="text-dark mb-3">
                      Some stuff will go here
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              {/* Buttons */}
              <Col sm={12} className="mb-4">
                <Card>
                  <Card.Body>
                    <Button variant="primary" size="sm" className="me-3">
                      Publish
                    </Button>
                    <Button variant="secondary" size="sm" className="me-3">
                      Cancel
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            <Row className="mb-4">
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title className="text-dark">Promote LIVE</Card.Title>
                    <Card.Text>
                      Maximize your product sales during real-time livestreams.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          <Card>
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Campaign Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="campaignName"
                    placeholder="Enter campaign name"
                    value={formData.campaignName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Budget (USD)</Form.Label>
                  <Form.Control
                    type="number"
                    name="budget"
                    placeholder="Enter budget amount"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Target Audience</Form.Label>
                  <Form.Select
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select target audience</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="retail">Retail</option>
                    <option value="fashion">Fashion</option>
                    <option value="electronics">Electronics</option>
                    <option value="home">Home & Garden</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Campaign Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    placeholder="Enter campaign description and goals"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button variant="primary" size="lg" type="submit">
                    Create Campaign
                  </Button>
                  <Link href="/" className="btn btn-outline-secondary btn-lg">
                    Cancel
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3}>
          <Card className="bg-light">
            <Card.Body>
              <h5>Campaign Tips</h5>
              <ul className="mb-0">
                <li>Set realistic budget limits</li>
                <li>Define clear start and end dates</li>
                <li>Target the right audience</li>
                <li>Monitor performance regularly</li>
                <li>Adjust strategy based on metrics</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
