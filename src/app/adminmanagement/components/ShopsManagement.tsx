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
  getShops,
  createShop,
  updateShop,
  deleteShop,
  getUsers,
  getAccounts,
} from "@/lib/firebaseAdmin";
import type { Shop } from "@/types/admin";
import type { User } from "@/types/admin";
import type { Account } from "@/types/admin";

export default function ShopsManagement() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    accounts: [] as string[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [shopsData, usersData, accountsData] = await Promise.all([
        getShops(),
        getUsers(),
        getAccounts(),
      ]);
      setShops(shopsData);
      setUsers(usersData);
      setAccounts(accountsData);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (shop?: Shop) => {
    if (shop) {
      setEditingShop(shop);
      setFormData({
        name: shop.name,
        owner: shop.owner,
        accounts: shop.accounts || [],
      });
    } else {
      setEditingShop(null);
      setFormData({
        name: "",
        owner: "",
        accounts: [],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingShop(null);
    setFormData({
      name: "",
      owner: "",
      accounts: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingShop?.id) {
        await updateShop(editingShop.id, formData);
      } else {
        await createShop(formData);
      }
      handleCloseModal();
      loadData();
    } catch (err) {
      setError("Failed to save shop");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shop?")) return;
    try {
      await deleteShop(id);
      loadData();
    } catch (err) {
      setError("Failed to delete shop");
      console.error(err);
    }
  };

  const toggleAccount = (accountId: string) => {
    setFormData({
      ...formData,
      accounts: formData.accounts.includes(accountId)
        ? formData.accounts.filter((id) => id !== accountId)
        : [...formData.accounts, accountId],
    });
  };

  if (loading) {
    return <div>Loading shops...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Shops Management</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={16} className="me-2" />
          Create Shop
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Owner</th>
            <th>Accounts</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shops.map((shop) => (
            <tr key={shop.id}>
              <td>{shop.name}</td>
              <td>
                {users.find((u) => u.id === shop.owner)?.name || shop.owner}
              </td>
              <td>{shop.accounts?.length || 0}</td>
              <td>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => handleOpenModal(shop)}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => shop.id && handleDelete(shop.id)}
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
            {editingShop ? "Edit Shop" : "Create Shop"}
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
              <Form.Label>Owner</Form.Label>
              <Form.Select
                value={formData.owner}
                onChange={(e) =>
                  setFormData({ ...formData, owner: e.target.value })
                }
                required
              >
                <option value="">Select Owner</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Connected Accounts</Form.Label>
              <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                {accounts.map((account) => (
                  <Form.Check
                    key={account.id}
                    type="checkbox"
                    label={account.name}
                    checked={formData.accounts.includes(account.id || "")}
                    onChange={() => account.id && toggleAccount(account.id)}
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
              {editingShop ? "Update" : "Create"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

