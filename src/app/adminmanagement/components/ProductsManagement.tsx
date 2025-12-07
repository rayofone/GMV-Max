"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAccounts,
  getShops,
  getCreatives,
} from "@/lib/firebaseAdmin";
import { useAuth } from "@/contexts/AuthContext";
import type { Product } from "@/types/admin";
import type { Account } from "@/types/admin";
import type { Shop } from "@/types/admin";
import type { Creative } from "@/types/admin";

export default function ProductsManagement() {
  const { userData, isMasterAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    account: "",
    creativeImages: [] as string[],
    creativeVideos: [] as string[],
    description: "",
    caption: "",
    price: "",
    name: "",
    shop: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [productsData, accountsData, shopsData, creativesData] =
        await Promise.all([
          getProducts(),
          getAccounts(),
          getShops(),
          getCreatives(),
        ]);
        setProducts(productsData);
      
      // Master admin or regular admin sees all data
      if (isMasterAdmin || userData?.role === "admin") {
        setAccounts(accountsData);
        setShops(shopsData);
        setCreatives(creativesData);
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
        
        // Filter creatives that belong to user's shops
        const filteredCreatives = creativesData.filter((creative) =>
          userData.shops?.includes(creative.shop)
        );
        setCreatives(filteredCreatives);
        
        // Auto-select first shop if only one
        if (filteredShops.length === 1 && !formData.shop) {
          setFormData((prev) => ({ ...prev, shop: filteredShops[0].id || "" }));
        }
      } else {
        setAccounts([]);
        setShops([]);
        setCreatives([]);
      }
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        account: product.account,
        creativeImages: product.creativeImages || [],
        creativeVideos: product.creativeVideos || [],
        description: product.description || "",
        caption: product.caption || "",
        price: product.price.toString(),
        name: product.name,
        shop: product.shop,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        account: "",
        creativeImages: [],
        creativeVideos: [],
        description: "",
        caption: "",
        price: "",
        name: "",
        shop: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      account: "",
      creativeImages: [],
      creativeVideos: [],
      description: "",
      caption: "",
      price: "",
      name: "",
      shop: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const submitData = {
        ...formData,
        price: isNaN(Number(formData.price))
          ? formData.price
          : Number(formData.price),
      };
      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, submitData);
      } else {
        await createProduct(submitData);
      }
      handleCloseModal();
      loadData();
    } catch (err) {
      setError("Failed to save product");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      loadData();
    } catch (err) {
      setError("Failed to delete product");
      console.error(err);
    }
  };

  const toggleCreativeImage = (creativeId: string) => {
    setFormData({
      ...formData,
      creativeImages: formData.creativeImages.includes(creativeId)
        ? formData.creativeImages.filter((id) => id !== creativeId)
        : [...formData.creativeImages, creativeId],
    });
  };

  const toggleCreativeVideo = (creativeId: string) => {
    setFormData({
      ...formData,
      creativeVideos: formData.creativeVideos.includes(creativeId)
        ? formData.creativeVideos.filter((id) => id !== creativeId)
        : [...formData.creativeVideos, creativeId],
    });
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  const imageCreatives = creatives.filter((c) => c.type === "Image");
  const videoCreatives = creatives.filter((c) => c.type === "Video");

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Products Management</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={16} className="me-2" />
          Create Product
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Account</th>
            <th>Shop</th>
            <th>Price</th>
            <th>Images</th>
            <th>Videos</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>
                {
                  accounts.find((acc) => acc.id === product.account)?.name ||
                  product.account
                }
              </td>
              <td>
                {shops.find((s) => s.id === product.shop)?.name ||
                  product.shop}
              </td>
              <td>{product.price}</td>
              <td>{product.creativeImages?.length || 0}</td>
              <td>{product.creativeVideos?.length || 0}</td>
              <td>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => handleOpenModal(product)}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => product.id && handleDelete(product.id)}
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
            {editingProduct ? "Edit Product" : "Create Product"}
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
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
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
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Caption</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.caption}
                onChange={(e) =>
                  setFormData({ ...formData, caption: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Creative Images</Form.Label>
              <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                {imageCreatives.map((creative) => (
                  <Form.Check
                    key={creative.id}
                    type="checkbox"
                    label={creative.name}
                    checked={formData.creativeImages.includes(creative.id || "")}
                    onChange={() =>
                      creative.id && toggleCreativeImage(creative.id)
                    }
                  />
                ))}
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Creative Videos</Form.Label>
              <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                {videoCreatives.map((creative) => (
                  <Form.Check
                    key={creative.id}
                    type="checkbox"
                    label={creative.name}
                    checked={formData.creativeVideos.includes(creative.id || "")}
                    onChange={() =>
                      creative.id && toggleCreativeVideo(creative.id)
                    }
                  />
                ))}
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingProduct ? "Update" : "Create"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

