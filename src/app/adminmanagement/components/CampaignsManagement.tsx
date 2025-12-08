"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
} from "react-bootstrap";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getShops,
  getAccounts,
  getUsers,
} from "@/lib/firebaseAdmin";
import type { Campaign } from "@/types/admin";
import type { Shop } from "@/types/admin";
import type { Account } from "@/types/admin";
import type { User } from "@/types/admin";

export default function CampaignsManagement() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "products" as "products" | "LIVE",
    budget: "",
    startDate: "",
    endDate: "",
    targetAudience: "",
    description: "",
    shop: "",
    account: "",
    userId: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [campaignsData, shopsData, accountsData, usersData] =
        await Promise.all([
          getCampaigns(),
          getShops(),
          getAccounts(),
          getUsers(),
        ]);
      setCampaigns(campaignsData);
      setShops(shopsData);
      setAccounts(accountsData);
      setUsers(usersData);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (campaign?: Campaign) => {
    if (campaign) {
      setEditingCampaign(campaign);
      setFormData({
        name: campaign.name,
        type: campaign.type || "products",
        budget: campaign.budget || "",
        startDate: campaign.startDate || "",
        endDate: campaign.endDate || "",
        targetAudience: campaign.targetAudience || "",
        description: campaign.description || "",
        shop: campaign.shop,
        account: campaign.account,
        userId: campaign.userId,
      });
    } else {
      setEditingCampaign(null);
      setFormData({
        name: "",
        type: "products",
        budget: "",
        startDate: "",
        endDate: "",
        targetAudience: "",
        description: "",
        shop: "",
        account: "",
        userId: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCampaign(null);
    setFormData({
      name: "",
      type: "products",
      budget: "",
      startDate: "",
      endDate: "",
      targetAudience: "",
      description: "",
      shop: "",
      account: "",
      userId: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingCampaign?.id) {
        await updateCampaign(editingCampaign.id, formData);
      } else {
        if (!formData.userId) {
          setError("Please select a user");
          return;
        }
        await createCampaign({
          ...formData,
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
      }
      handleCloseModal();
      loadData();
    } catch (err) {
      setError("Failed to save campaign");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await deleteCampaign(id);
      loadData();
    } catch (err) {
      setError("Failed to delete campaign");
      console.error(err);
    }
  };

  const getShopName = (shopId: string) => {
    const shop = shops.find((s) => s.id === shopId);
    return shop?.name || shopId;
  };

  const getAccountName = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId);
    return account?.name || accountId;
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.name} (${user.email})` : userId;
  };

  if (loading) {
    return <div>Loading campaigns...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Campaigns Management</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={16} className="me-2" />
          Create Campaign
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Shop</th>
            <th>Account</th>
            <th>User</th>
            <th>Budget</th>
            <th>Dates</th>
            <th>Creatives</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.id}>
              <td>{campaign.name}</td>
              <td>
                <Badge bg={campaign.type === "products" ? "primary" : "info"}>
                  {campaign.type || "products"}
                </Badge>
              </td>
              <td>{getShopName(campaign.shop)}</td>
              <td>{getAccountName(campaign.account)}</td>
              <td>{getUserName(campaign.userId)}</td>
              <td>{campaign.budget || "N/A"}</td>
              <td>
                {campaign.startDate && campaign.endDate
                  ? `${campaign.startDate} - ${campaign.endDate}`
                  : "N/A"}
              </td>
              <td>{campaign.creatives?.length || 0}</td>
              <td>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => handleOpenModal(campaign)}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => campaign.id && handleDelete(campaign.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCampaign ? "Edit Campaign" : "Create Campaign"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as "products" | "LIVE",
                  })
                }
              >
                <option value="products">Products</option>
                <option value="LIVE">LIVE</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Shop</Form.Label>
              <Form.Select
                value={formData.shop}
                onChange={(e) =>
                  setFormData({ ...formData, shop: e.target.value })
                }
                required
              >
                <option value="">Select a shop</option>
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Account</Form.Label>
              <Form.Select
                value={formData.account}
                onChange={(e) =>
                  setFormData({ ...formData, account: e.target.value })
                }
                required
              >
                <option value="">Select an account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>User</Form.Label>
              <Form.Select
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                required
                disabled={!!editingCampaign}
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </Form.Select>
              {editingCampaign && (
                <Form.Text className="text-muted">
                  User cannot be changed after creation
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Budget</Form.Label>
              <Form.Control
                type="text"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                placeholder="e.g., $1000"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Target Audience</Form.Label>
              <Form.Control
                type="text"
                value={formData.targetAudience}
                onChange={(e) =>
                  setFormData({ ...formData, targetAudience: e.target.value })
                }
                placeholder="e.g., Age 18-35, Interests: Fashion"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Campaign description"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingCampaign ? "Update" : "Create"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

