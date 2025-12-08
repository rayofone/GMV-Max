"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Alert,
  Accordion,
} from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useFirebase } from "@/contexts/FirebaseContext";
import { useShop } from "@/contexts/ShopContext";
import {
  createCampaign,
  deleteCampaign,
  getCampaign,
  updateCampaign,
  getCreatives,
} from "@/lib/firebaseAdmin";
import type { Shop } from "@/types/admin";
import type { Creative } from "@/contexts/FirebaseContext";
import { CircleUser } from "lucide-react";
import CampaignNameSection from "./components/CampaignNameSection";
import ProductsSection from "./components/ProductsSection";
import OptimizationBudgetSection from "./components/OptimizationBudgetSection";
import ScheduleSection from "./components/ScheduleSection";

export default function CreateCampaign() {
  // Default shop and account IDs
  const DEFAULT_SHOP_ID = "zg2kDQvIKFt7SUi5XXvV";
  const DEFAULT_ACCOUNT_ID = "qMSH488FCkgpsrBOWEdL";

  const router = useRouter();
  const { currentUser, userData } = useAuth();
  const { accounts } = useFirebase();
  const { selectedShopId, availableShops, setSelectedShopId } = useShop();
  const [shops, setShops] = useState<Shop[]>([]);
  const [campaignId, setCampaignId] = useState<string | null>(null); // Track created campaign ID
  const [formData, setFormData] = useState({
    campaignName: "",
    budget: "",
    startDate: "",
    endDate: "",
    targetAudience: "",
    description: "",
    shop: "",
    account: "",
    liveSource: "tiktok",
  });

  const [submitted, setSubmitted] = useState(false);
  const [pgm, setPgm] = useState(true); // true = products, false = LIVE
  const [error, setError] = useState<string | null>(null);
  const [shouldCreateOnLoad, setShouldCreateOnLoad] = useState(false);

  // Creative display state
  const [campaignAutoMode, setCampaignAutoMode] = useState<boolean>(true);
  const [campaignSelectedCreatives, setCampaignSelectedCreatives] = useState<
    (string | number)[]
  >([]);
  const [allCreatives, setAllCreatives] = useState<Creative[]>([]);
  const [creativesLoading, setCreativesLoading] = useState(false);
  const [videoErrors, setVideoErrors] = useState<Set<string | number>>(
    new Set()
  );

  // Load campaign data and pre-fill form
  const loadCampaignData = async (id: string) => {
    try {
      const campaign = await getCampaign(id);
      if (campaign) {
        setFormData({
          campaignName: campaign.name || "",
          budget: campaign.budget || "",
          startDate: campaign.startDate || "",
          endDate: campaign.endDate || "",
          targetAudience: campaign.targetAudience || "",
          description: campaign.description || "",
          shop: campaign.shop || DEFAULT_SHOP_ID,
          account: campaign.account || DEFAULT_ACCOUNT_ID,
          liveSource: "tiktok",
        });
        if (campaign.type) {
          setPgm(campaign.type === "products");
        }
        // Set shop in header if not already set
        if (campaign.shop && campaign.shop !== selectedShopId) {
          setSelectedShopId(campaign.shop);
        }
        // Load creative selection data
        setCampaignAutoMode(campaign.autoMode !== false);
        setCampaignSelectedCreatives(
          campaign.selectedCreatives || campaign.creatives || []
        );
      }
    } catch (error) {
      console.error("Error loading campaign:", error);
    }
  };

  // Fetch all creatives from Firebase
  useEffect(() => {
    const fetchCreatives = async () => {
      if (!campaignId) {
        setAllCreatives([]);
        return;
      }

      try {
        setCreativesLoading(true);
        const creatives = await getCreatives();
        setAllCreatives(creatives as Creative[]);

        // Also refresh campaign data to get latest selectedCreatives and autoMode
        const campaign = await getCampaign(campaignId);
        if (campaign) {
          setCampaignAutoMode(campaign.autoMode !== false);
          setCampaignSelectedCreatives(
            campaign.selectedCreatives || campaign.creatives || []
          );
        }
      } catch (error) {
        console.error("Error fetching creatives:", error);
      } finally {
        setCreativesLoading(false);
      }
    };

    fetchCreatives();
  }, [campaignId]);

  // Helper function to validate video path
  const isValidVideoPath = (videoPath: string): boolean => {
    if (!videoPath || typeof videoPath !== "string") return false;
    const trimmed = videoPath.trim();
    if (trimmed === "" || trimmed === "string") return false;
    return trimmed.startsWith("http://") || trimmed.startsWith("https://");
  };

  // Handle video error
  const handleVideoError = (creativeId: string | number) => {
    setVideoErrors((prev) => new Set(prev).add(creativeId));
  };

  // Get creatives to display
  const getDisplayCreatives = (): Creative[] => {
    if (creativesLoading || allCreatives.length === 0) return [];

    if (campaignAutoMode) {
      // Show all creatives in auto mode
      return allCreatives;
    } else {
      // Show only selected creatives in manual mode
      const selectedIdsAsStrings = campaignSelectedCreatives.map((id) =>
        String(id)
      );
      return allCreatives.filter((creative) =>
        selectedIdsAsStrings.includes(String(creative.id))
      );
    }
  };

  useEffect(() => {
    // Check URL params for campaignId or createNew
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlCampaignId = params.get("campaignId");
      const createNew = params.get("createNew");

      if (urlCampaignId && urlCampaignId !== campaignId) {
        // Load existing campaign and pre-fill form
        setCampaignId(urlCampaignId);
        loadCampaignData(urlCampaignId);
      } else if (createNew === "true") {
        setShouldCreateOnLoad(true);
      }
    }
  }, []); // Only run once on mount

  useEffect(() => {
    // Use shops from ShopContext
    setShops(availableShops);
  }, [availableShops]);

  // Sync form shop with header selection when header selection changes
  useEffect(() => {
    if (selectedShopId && selectedShopId !== formData.shop) {
      setFormData((prev) => ({ ...prev, shop: selectedShopId }));
    }
  }, [selectedShopId, formData.shop]);

  // Create campaign immediately when coming from "Create GMV Max ads"
  useEffect(() => {
    const createCampaignOnLoad = async () => {
      if (
        shouldCreateOnLoad &&
        currentUser &&
        userData &&
        selectedShopId &&
        availableShops.length > 0 &&
        accounts.length > 0 &&
        !campaignId
      ) {
        try {
          const selectedShop = availableShops.find(
            (s) => s.id === selectedShopId
          );
          if (!selectedShop) {
            setError("Please select a shop first");
            return;
          }

          // Use default shop and account
          const defaultShopId = "zg2kDQvIKFt7SUi5XXvV";
          const defaultAccountId = "qMSH488FCkgpsrBOWEdL";

          // Create campaign immediately
          const newCampaignId = await createCampaign({
            name: `GMV Max Campaign - ${new Date().toLocaleDateString()}`,
            type: pgm ? "products" : "LIVE",
            shop: defaultShopId,
            account: defaultAccountId,
            userId: currentUser.uid,
            autoMode: true, // Default to auto mode
            enabled: false,
            status: "Inactive",
            recommendations: "",
            currentOptimizations: "",
            scheduleTime: "",
            currentBudget: "",
            creativeBoostBudget: "",
            testingPhase: false,
            targetROI: "",
            cost: "",
            netCost: "",
            ordersSKU: "",
            costPerOrder: "",
            grossRevenue: "",
            roi: "",
          });

          setCampaignId(newCampaignId);
          setFormData((prev) => ({
            ...prev,
            shop: defaultShopId,
            account: defaultAccountId,
          }));
        } catch (err) {
          console.error("Error creating campaign on load:", err);
          setError("Failed to create campaign. Please try again.");
        }
      }
    };

    createCampaignOnLoad();
  }, [
    shouldCreateOnLoad,
    currentUser,
    userData,
    selectedShopId,
    availableShops,
    accounts,
    campaignId,
    pgm,
  ]);

  const handlePgmChange = async (value: boolean) => {
    setPgm(value);
    // Create or update campaign type when user selects Promote products or Promote LIVE
    if (
      currentUser &&
      userData &&
      selectedShopId &&
      shops.length > 0 &&
      accounts.length > 0
    ) {
      try {
        if (!campaignId) {
          // Create new campaign if it doesn't exist
          const selectedShop =
            shops.find((s) => s.id === selectedShopId) || shops[0];
          const shopAccounts = accounts.filter((acc) =>
            acc.shops?.includes(selectedShop.id || "")
          );
          const firstAccount = shopAccounts[0];

          if (selectedShop && firstAccount) {
            const newCampaignId = await createCampaign({
              name:
                formData.campaignName ||
                `GMV Max Campaign - ${new Date().toLocaleDateString()}`,
              type: value ? "products" : "LIVE",
              shop: selectedShop.id || "",
              account: firstAccount.id || "",
              userId: currentUser.uid,
              autoMode: true, // Default to auto mode
            });
            setCampaignId(newCampaignId);
            if (!formData.shop) {
              setFormData((prev) => ({
                ...prev,
                shop: selectedShop.id || "",
                account: firstAccount.id || "",
              }));
            }
          }
        } else {
          // Update existing campaign type
          const { updateCampaign } = await import("@/lib/firebaseAdmin");
          await updateCampaign(campaignId, {
            type: value ? "products" : "LIVE",
          });
        }
      } catch (err) {
        console.error("Error creating/updating campaign type:", err);
        setError("Failed to update campaign type. Please try again.");
      }
    }
  };

  const handleCancel = async () => {
    // Delete campaign if it was created
    if (campaignId) {
      try {
        await deleteCampaign(campaignId);
      } catch (err) {
        console.error("Error deleting campaign:", err);
      }
    }
    router.push("/");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser || !userData) {
      setError("You must be logged in to create a campaign");
      return;
    }

    if (!formData.shop || !formData.account) {
      setError("Please select a shop and account");
      return;
    }

    try {
      setSubmitted(true);

      if (campaignId) {
        // Update existing campaign with all fields
        // Use default shop and account if not set
        const defaultShopId = "zg2kDQvIKFt7SUi5XXvV";
        const defaultAccountId = "qMSH488FCkgpsrBOWEdL";

        // Get the campaign to check if it's in autoselect mode
        const campaign = await getCampaign(campaignId);
        const updateData: any = {
          name: formData.campaignName,
          budget: formData.budget,
          startDate: formData.startDate,
          endDate: formData.endDate,
          targetAudience: formData.targetAudience,
          description: formData.description,
          shop: formData.shop || defaultShopId,
          account: formData.account || defaultAccountId,
          type: pgm ? "products" : "LIVE",
          scheduleTime: formData.startDate || "",
          currentBudget: formData.budget || "",
        };

        // If in autoselect mode (or autoMode not explicitly set to false), add all creatives from Firebase
        // Default to autoMode = true if not set
        const isAutoMode = campaign?.autoMode !== false;
        if (isAutoMode) {
          const allCreatives = await getCreatives();
          const allCreativeIds = allCreatives.map((c) => c.id);
          updateData.creatives = allCreativeIds;
          updateData.selectedCreatives = allCreativeIds;
          // Ensure autoMode is set to true
          updateData.autoMode = true;
        }

        await updateCampaign(campaignId, updateData);
      } else {
        // Use default shop and account if not set
        const defaultShopId = "zg2kDQvIKFt7SUi5XXvV";
        const defaultAccountId = "qMSH488FCkgpsrBOWEdL";

        // Create new campaign
        const newCampaignId = await createCampaign({
          name: formData.campaignName,
          budget: formData.budget,
          startDate: formData.startDate,
          endDate: formData.endDate,
          targetAudience: formData.targetAudience,
          description: formData.description,
          shop: formData.shop || defaultShopId,
          account: formData.account || defaultAccountId,
          userId: currentUser.uid,
          type: pgm ? "products" : "LIVE",
          autoMode: true, // Default to auto mode
          enabled: false,
          status: "Inactive",
          recommendations: "",
          currentOptimizations: "",
          scheduleTime: formData.startDate || "",
          currentBudget: formData.budget || "",
          creativeBoostBudget: "",
          testingPhase: false,
          targetROI: "",
          cost: "",
          netCost: "",
          ordersSKU: "",
          costPerOrder: "",
          grossRevenue: "",
          roi: "",
        });
        setCampaignId(newCampaignId);
      }

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          campaignName: "",
          budget: "",
          startDate: "",
          endDate: "",
          targetAudience: "",
          description: "",
          shop: formData.shop, // Keep shop selected
          account: "", // Reset account
          liveSource: "tiktok",
        });
        setCampaignId(null);
        setSubmitted(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save campaign");
      setSubmitted(false);
    }
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
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
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
          {/* Shop and Account Selection */}
          {/* {shops.length > 0 && (
            <Card className="mb-4">
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Shop *</Form.Label>
                  <Form.Select
                    value={formData.shop || selectedShopId || ""}
                    onChange={(e) => {
                      const newShopId = e.target.value;
                      setFormData({ ...formData, shop: newShopId });
                      // Update header selection when user changes shop in form
                      if (newShopId) {
                        setSelectedShopId(newShopId);
                      }
                    }}
                    required
                  >
                    <option value="">Select a shop</option>
                    {shops.map((shop) => (
                      <option key={shop.id} value={shop.id}>
                        {shop.name}
                      </option>
                    ))}
                  </Form.Select>
                  {selectedShopId && (
                    <Form.Text className="text-muted">
                      Shop selected from header:{" "}
                      {shops.find((s) => s.id === selectedShopId)?.name}
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Account *</Form.Label>
                  <Form.Select
                    value={formData.account}
                    onChange={(e) =>
                      setFormData({ ...formData, account: e.target.value })
                    }
                    required
                    disabled={!formData.shop}
                  >
                    <option value="">Select an account</option>
                    {accounts
                      .filter((acc) => acc.shops?.includes(formData.shop))
                      .map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>
          )} */}
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
              <ProductsSection />
              <OptimizationBudgetSection />
              {/* <AdvancedOptimizationsSection /> */}

              {/* Ad creative */}
              <Col sm={12} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-dark mb-3">
                      Ad creative
                      {campaignId ? (
                        <Link
                          className="btn btn-secondary btn-sm float-end"
                          href={`/sectionmodules/managecreatives?campaignId=${campaignId}&pgm=${pgm}`}
                        >
                          Edit
                        </Link>
                      ) : (
                        <span
                          className="text-muted float-end"
                          style={{ fontSize: "14px" }}
                        >
                          Save campaign first to edit creatives
                        </span>
                      )}
                    </Card.Title>
                    <Card.Text>
                      Autoselecting ad creatives optimizes your campaign
                      performance by using the best available posts and images
                      featuring your products. Your creative will appear in the
                      format of video, carousel and product card. Manage
                      creatives to view, add or manually select posts to promote
                      your products.
                    </Card.Text>
                    <p className="fw-bold">Selected creatives:</p>
                    {campaignId && (
                      <div className="mt-3">
                        {creativesLoading ? (
                          <p className="text-muted">Loading creatives...</p>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              overflowX: "auto",
                              overflowY: "hidden",
                              gap: "12px",
                              paddingBottom: "8px",
                            }}
                          >
                            {getDisplayCreatives().length > 0 ? (
                              getDisplayCreatives().map((creative) => {
                                const hasError = videoErrors.has(creative.id);
                                const isValid = isValidVideoPath(
                                  creative.video
                                );

                                return (
                                  <div
                                    key={creative.id}
                                    className="flex-shrink-0 d-flex flex-column"
                                    style={{
                                      width: "80px",
                                    }}
                                  >
                                    {/* Video container with fixed height */}
                                    <div
                                      className="position-relative"
                                      style={{
                                        height: "120px",
                                        width: "100%",
                                        flexShrink: 0,
                                      }}
                                    >
                                      {isValid &&
                                      !hasError &&
                                      creative.video ? (
                                        <video
                                          src={creative.video}
                                          loop
                                          muted
                                          autoPlay={false}
                                          controls={false}
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            backgroundColor: "#f5f5f5",
                                            borderRadius: "4px",
                                          }}
                                          onError={() =>
                                            handleVideoError(creative.id)
                                          }
                                        />
                                      ) : (
                                        <div
                                          className="d-flex flex-column align-items-center justify-content-center bg-secondary text-white rounded"
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                          }}
                                        >
                                          <CircleUser
                                            strokeWidth={1.5}
                                            size={24}
                                            className="mb-1 opacity-50"
                                          />
                                          <p
                                            className="text-center mb-0 px-1"
                                            style={{ fontSize: "8px" }}
                                          >
                                            No video
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                    {/* Name below video */}
                                    <p
                                      className="mt-1 mb-0 text-truncate"
                                      style={{
                                        fontSize: "10px",
                                        lineHeight: "1.2",
                                        minHeight: "24px",
                                        display: "block",
                                        width: "100%",
                                      }}
                                      title={
                                        creative.name || "Unnamed creative"
                                      }
                                    >
                                      {creative.name || "Unnamed creative"}
                                    </p>
                                  </div>
                                );
                              })
                            ) : (
                              <p
                                className="text-muted"
                                style={{ fontSize: "14px" }}
                              >
                                {campaignAutoMode
                                  ? "No creatives available"
                                  : "No creatives selected"}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    <Accordion defaultActiveKey="" className="">
                      <Accordion.Item
                        eventKey="0"
                        className=""
                        style={{ backgroundColor: "#f8f9fa" }}
                      >
                        <Accordion.Header
                          className="text-dark"
                          style={{
                            backgroundColor: "#f8f9fa",
                            border: "none",
                            fontSize: "14px",
                          }}
                        >
                          <span className="text-primary me-2">0/4 </span>
                          Creative best practices completed
                        </Accordion.Header>
                        <Accordion.Body>
                          <p style={{ fontSize: "14px" }}>
                            <strong>Your creative best practices</strong>
                          </p>
                          <p>Place best practices here</p>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </Card.Body>
                </Card>
              </Col>

              <ScheduleSection />

              {/* Brand safety and suitability */}
              {/* <Col sm={12} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-dark mb-3">
                      Brand safety and suitability
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col> */}

              <CampaignNameSection
                campaignName={formData.campaignName}
                onChange={handleChange}
              />

              {/* Disclaimer block */}
              {/* <Col sm={12} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Text className="text-dark mb-3">
                      Some stuff will go here
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col> */}

              {/* Buttons */}
              {/* <Col sm={12} className="mb-4">
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
              </Col> */}
            </Row>
          ) : (
            <Row className="mb-4">
              <Col sm={12}>
                <Row className="mb-4">
                  <Col sm={12}>
                    <Card>
                      <Card.Body>
                        <Card.Title className="text-dark mt-2">
                          LIVE source
                        </Card.Title>
                        <Card.Text>
                          Choose where to get the LIVE you want to promote.
                        </Card.Text>
                        <Form.Group className="mb-3">
                          <Form.Select
                            name="liveSource"
                            value={formData.liveSource}
                            onChange={handleChange}
                          >
                            <option value="tiktok">TikTok</option>
                            <option value="youtube">YouTube</option>
                          </Form.Select>
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <OptimizationBudgetSection />
                <Col sm={12} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title className="text-dark mb-3">
                        Ad creative
                        {campaignId ? (
                          <Link
                            className="btn btn-secondary btn-sm float-end"
                            href={`/sectionmodules/managecreatives?campaignId=${campaignId}&pgm=${pgm}`}
                          >
                            Edit
                          </Link>
                        ) : (
                          <span
                            className="text-muted float-end"
                            style={{ fontSize: "14px" }}
                          >
                            Save campaign first to edit creatives
                          </span>
                        )}
                      </Card.Title>
                      <Card.Text>
                        Autoselecting ad creatives optimizes your campaign
                        performance by using the best available posts and images
                        featuring your products. Your creative will appear in
                        the format of video, carousel and product card. Manage
                        creatives to view, add or manually select posts to
                        promote your products.
                        {campaignId && (
                          <div className="mt-3">
                            {creativesLoading ? (
                              <p className="text-muted">Loading creatives...</p>
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  overflowX: "auto",
                                  overflowY: "hidden",
                                  gap: "12px",
                                  paddingBottom: "8px",
                                }}
                              >
                                {getDisplayCreatives().length > 0 ? (
                                  getDisplayCreatives().map((creative) => {
                                    const hasError = videoErrors.has(
                                      creative.id
                                    );
                                    const isValid = isValidVideoPath(
                                      creative.video
                                    );

                                    return (
                                      <div
                                        key={creative.id}
                                        className="flex-shrink-0 d-flex flex-column"
                                        style={{
                                          width: "80px",
                                        }}
                                      >
                                        {/* Video container with fixed height */}
                                        <div
                                          className="position-relative"
                                          style={{
                                            height: "120px",
                                            width: "100%",
                                            flexShrink: 0,
                                          }}
                                        >
                                          {isValid &&
                                          !hasError &&
                                          creative.video ? (
                                            <video
                                              src={creative.video}
                                              loop
                                              muted
                                              autoPlay={false}
                                              controls={false}
                                              style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                backgroundColor: "#f5f5f5",
                                                borderRadius: "4px",
                                              }}
                                              onError={() =>
                                                handleVideoError(creative.id)
                                              }
                                            />
                                          ) : (
                                            <div
                                              className="d-flex flex-column align-items-center justify-content-center bg-secondary text-white rounded"
                                              style={{
                                                width: "100%",
                                                height: "100%",
                                              }}
                                            >
                                              <CircleUser
                                                strokeWidth={1.5}
                                                size={24}
                                                className="mb-1 opacity-50"
                                              />
                                              <p
                                                className="text-center mb-0 px-1"
                                                style={{ fontSize: "8px" }}
                                              >
                                                No video
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                        {/* Name below video */}
                                        <p
                                          className="mt-1 mb-0 text-truncate"
                                          style={{
                                            fontSize: "10px",
                                            lineHeight: "1.2",
                                            minHeight: "24px",
                                            display: "block",
                                            width: "100%",
                                          }}
                                          title={
                                            creative.name || "Unnamed creative"
                                          }
                                        >
                                          {creative.name || "Unnamed creative"}
                                        </p>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <p
                                    className="text-muted"
                                    style={{ fontSize: "14px" }}
                                  >
                                    {campaignAutoMode
                                      ? "No creatives available"
                                      : "No creatives selected"}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>

                <ScheduleSection />
                <CampaignNameSection
                  campaignName={formData.campaignName}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          )}

          {/*************************************************************** HIDDEN FORM FOR CONTROL DO NOT DELETE THIS FORM ***************************************************************/}
          <Card className="d-none">
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

      {/* Footer with Cancel and Save buttons */}
      <div
        className="position-fixed bottom-0 start-0 end-0 bg-white border-top shadow-sm"
        style={{ padding: "1rem", zIndex: 1000 }}
      >
        <Container>
          <div className="d-flex justify-content-end gap-3">
            <Button
              variant="outline-secondary"
              size="lg"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={async (e) => {
                e.preventDefault();
                setError(null);

                if (!currentUser || !userData) {
                  setError("You must be logged in to create a campaign");
                  return;
                }

                if (!formData.shop || !formData.account) {
                  setError("Please select a shop and account");
                  return;
                }

                if (!formData.campaignName.trim()) {
                  setError("Please enter a campaign name");
                  return;
                }

                try {
                  setSubmitted(true);

                  // Check URL for campaignId in case state is not set
                  const params = new URLSearchParams(window.location.search);
                  const urlCampaignId = params.get("campaignId");
                  let finalCampaignId = campaignId || urlCampaignId;

                  // Use default shop and account
                  const defaultShopId = "zg2kDQvIKFt7SUi5XXvV";
                  const defaultAccountId = "qMSH488FCkgpsrBOWEdL";

                  // If campaign doesn't exist, create it; otherwise update it
                  if (!finalCampaignId) {
                    finalCampaignId = await createCampaign({
                      name: formData.campaignName,
                      type: pgm ? "products" : "LIVE",
                      budget: formData.budget,
                      startDate: formData.startDate,
                      endDate: formData.endDate,
                      targetAudience: formData.targetAudience,
                      description: formData.description,
                      shop: formData.shop || defaultShopId,
                      account: formData.account || defaultAccountId,
                      userId: currentUser.uid,
                      autoMode: true, // Default to auto mode
                      enabled: false,
                      status: "Inactive",
                      recommendations: "",
                      currentOptimizations: "",
                      scheduleTime: formData.startDate || "",
                      currentBudget: formData.budget || "",
                      creativeBoostBudget: "",
                      testingPhase: false,
                      targetROI: "",
                      cost: "",
                      netCost: "",
                      ordersSKU: "",
                      costPerOrder: "",
                      grossRevenue: "",
                      roi: "",
                    });
                    setCampaignId(finalCampaignId);
                  } else {
                    // Update existing campaign
                    const { updateCampaign } = await import(
                      "@/lib/firebaseAdmin"
                    );

                    // Get the campaign to check if it's in autoselect mode
                    const campaign = await getCampaign(finalCampaignId);
                    if (!campaign) {
                      setError("Campaign not found. Please try again.");
                      setSubmitted(false);
                      return;
                    }

                    const updateData: any = {
                      name: formData.campaignName,
                      type: pgm ? "products" : "LIVE",
                      budget: formData.budget,
                      startDate: formData.startDate,
                      endDate: formData.endDate,
                      targetAudience: formData.targetAudience,
                      description: formData.description,
                      shop: formData.shop || defaultShopId,
                      account: formData.account || defaultAccountId,
                      scheduleTime: formData.startDate || "",
                      currentBudget: formData.budget || "",
                    };

                    // If in autoselect mode (or autoMode not explicitly set to false), add all creatives from Firebase
                    // Default to autoMode = true if not set
                    const isAutoMode = campaign.autoMode !== false;
                    if (isAutoMode) {
                      const allCreatives = await getCreatives();
                      const allCreativeIds = allCreatives.map((c) => c.id);
                      updateData.creatives = allCreativeIds;
                      updateData.selectedCreatives = allCreativeIds;
                      // Ensure autoMode is set to true
                      updateData.autoMode = true;
                    }

                    await updateCampaign(finalCampaignId, updateData);

                    // Ensure campaignId state is set
                    if (!campaignId) {
                      setCampaignId(finalCampaignId);
                    }
                  }

                  // Redirect to demo page (home)
                  router.push("/");
                } catch (err) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : "Failed to create campaign"
                  );
                  setSubmitted(false);
                }
              }}
              disabled={submitted}
            >
              {submitted ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </Container>
      </div>
    </Container>
  );
}
