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
  getCreatives,
  createCreative,
  updateCreative,
  deleteCreative,
  getAccounts,
  getShops,
} from "@/lib/firebaseAdmin";
import { useAuth } from "@/contexts/AuthContext";
import type { Creative } from "@/types/admin";
import type { Account } from "@/types/admin";
import type { Shop } from "@/types/admin";

export default function CreativesManagement() {
  const { userData } = useAuth();
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCreative, setEditingCreative] = useState<Creative | null>(null);
  const [formData, setFormData] = useState({
    account: "",
    authorized: false,
    name: "",
    shop: "",
    type: "Video" as "Video" | "Image",
    video: "",
    videoType: "TikTok post" as
      | "TikTok post"
      | "Authorized post"
      | "Affiliate post"
      | "Custom post"
      | "AIGC images",
    caption: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [creativesData, accountsData, shopsData] = await Promise.all([
        getCreatives(),
        getAccounts(),
        getShops(),
      ]);
      setCreatives(creativesData);
      
      // Filter accounts and shops by user's shops (unless admin)
      if (userData?.role === "admin") {
        setAccounts(accountsData);
        setShops(shopsData);
      } else if (userData?.shops && userData.shops.length > 0) {
        // Filter accounts that have user's shops
        const filteredAccounts = accountsData.filter((account) =>
          account.shops?.some((shopId) => userData.shops?.includes(shopId))
        );
        setAccounts(filteredAccounts);
        
        // Filter shops to only user's shops
        const filteredShops = shopsData.filter((shop) =>
          userData.shops?.includes(shop.id || "")
        );
        setShops(filteredShops);
        
        // Auto-select first shop if only one
        if (filteredShops.length === 1 && !formData.shop) {
          setFormData((prev) => ({ ...prev, shop: filteredShops[0].id || "" }));
        }
      } else {
        setAccounts([]);
        setShops([]);
      }
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (creative?: Creative) => {
    if (creative) {
      setEditingCreative(creative);
      setFormData({
        account: creative.account,
        authorized: creative.authorized,
        name: creative.name,
        shop: creative.shop,
        type: creative.type,
        video: creative.video || "",
        videoType: creative.videoType,
        caption: creative.caption || "",
      });
    } else {
      setEditingCreative(null);
      setFormData({
        account: "",
        authorized: false,
        name: "",
        shop: "",
        type: "Video",
        video: "",
        videoType: "TikTok post",
        caption: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCreative(null);
    setFormData({
      account: "",
      authorized: false,
      name: "",
      shop: "",
      type: "Video",
      video: "",
      videoType: "TikTok post",
      caption: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingCreative?.id) {
        await updateCreative(editingCreative.id, formData);
      } else {
        await createCreative(formData);
      }
      handleCloseModal();
      loadData();
    } catch (err) {
      setError("Failed to save creative");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this creative?")) return;
    try {
      await deleteCreative(id);
      loadData();
    } catch (err) {
      setError("Failed to delete creative");
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading creatives...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Creatives Management</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={16} className="me-2" />
          Create Creative
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Account</th>
            <th>Shop</th>
            <th>Type</th>
            <th>Video Type</th>
            <th>Authorized</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {creatives.map((creative) => (
            <tr key={creative.id}>
              <td>{creative.name}</td>
              <td>
                {
                  accounts.find((acc) => acc.id === creative.account)?.name ||
                  creative.account
                }
              </td>
              <td>
                {shops.find((s) => s.id === creative.shop)?.name ||
                  creative.shop}
              </td>
              <td>{creative.type}</td>
              <td>{creative.videoType}</td>
              <td>
                <Badge bg={creative.authorized ? "success" : "secondary"}>
                  {creative.authorized ? "Yes" : "No"}
                </Badge>
              </td>
              <td>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => handleOpenModal(creative)}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => creative.id && handleDelete(creative.id)}
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
            {editingCreative ? "Edit Creative" : "Create Creative"}
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
              <Form.Label>Account</Form.Label>
              <Form.Select
                value={formData.account}
                onChange={(e) =>
                  setFormData({ ...formData, account: e.target.value })
                }
                required
              >
                <option value="">Select Account</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
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
                <option value="">Select Shop</option>
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as "Video" | "Image",
                  })
                }
              >
                <option value="Video">Video</option>
                <option value="Image">Image</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Video Type</Form.Label>
              <Form.Select
                value={formData.videoType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    videoType: e.target.value as
                      | "TikTok post"
                      | "Authorized post"
                      | "Affiliate post"
                      | "Custom post"
                      | "AIGC images",
                  })
                }
              >
                <option value="TikTok post">TikTok post</option>
                <option value="Authorized post">Authorized post</option>
                <option value="Affiliate post">Affiliate post</option>
                <option value="Custom post">Custom post</option>
                <option value="AIGC images">AIGC images</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Video URL</Form.Label>
              <Form.Control
                type="url"
                value={formData.video}
                onChange={(e) =>
                  setFormData({ ...formData, video: e.target.value })
                }
                placeholder="https://..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Caption</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.caption}
                onChange={(e) =>
                  setFormData({ ...formData, caption: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Authorized"
                checked={formData.authorized}
                onChange={(e) =>
                  setFormData({ ...formData, authorized: e.target.checked })
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingCreative ? "Update" : "Create"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

