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
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "@/lib/firebaseAdmin";
import { getShops } from "@/lib/firebaseAdmin";
import { getUsers } from "@/lib/firebaseAdmin";
import type { Account } from "@/types/admin";
import type { Shop } from "@/types/admin";
import type { User } from "@/types/admin";

export default function AccountsManagement() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    parentAccount: "",
    shops: [] as string[],
    status: "Unauthorized" as "Unauthorized" | "Authorized",
    type: "Official Account" as "Official Account" | "Marketing Account",
    users: [] as string[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [accountsData, shopsData, usersData] = await Promise.all([
        getAccounts(),
        getShops(),
        getUsers(),
      ]);
      setAccounts(accountsData);
      setShops(shopsData);
      setUsers(usersData);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (account?: Account) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        name: account.name,
        parentAccount: account.parentAccount || "",
        shops: account.shops || [],
        status: account.status,
        type: account.type,
        users: account.users || [],
      });
    } else {
      setEditingAccount(null);
      setFormData({
        name: "",
        parentAccount: "",
        shops: [],
        status: "Unauthorized",
        type: "Official Account",
        users: [],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAccount(null);
    setFormData({
      name: "",
      parentAccount: "",
      shops: [],
      status: "Unauthorized",
      type: "Official Account",
      users: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingAccount?.id) {
        await updateAccount(editingAccount.id, formData);
      } else {
        await createAccount(formData);
      }
      handleCloseModal();
      loadData();
    } catch (err) {
      setError("Failed to save account");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this account?")) return;
    try {
      await deleteAccount(id);
      loadData();
    } catch (err) {
      setError("Failed to delete account");
      console.error(err);
    }
  };

  const toggleShop = (shopId: string) => {
    setFormData({
      ...formData,
      shops: formData.shops.includes(shopId)
        ? formData.shops.filter((id) => id !== shopId)
        : [...formData.shops, shopId],
    });
  };

  const toggleUser = (userId: string) => {
    setFormData({
      ...formData,
      users: formData.users.includes(userId)
        ? formData.users.filter((id) => id !== userId)
        : [...formData.users, userId],
    });
  };

  if (loading) {
    return <div>Loading accounts...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Accounts Management</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={16} className="me-2" />
          Create Account
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Shops</th>
            <th>Users</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td>{account.name}</td>
              <td>{account.type}</td>
              <td>
                <Badge
                  bg={
                    account.status === "Authorized" ? "success" : "warning"
                  }
                >
                  {account.status}
                </Badge>
              </td>
              <td>{account.shops?.length || 0}</td>
              <td>{account.users?.length || 0}</td>
              <td>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => handleOpenModal(account)}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => account.id && handleDelete(account.id)}
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
            {editingAccount ? "Edit Account" : "Create Account"}
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
              <Form.Label>Parent Account (Optional)</Form.Label>
              <Form.Select
                value={formData.parentAccount}
                onChange={(e) =>
                  setFormData({ ...formData, parentAccount: e.target.value })
                }
              >
                <option value="">None</option>
                {accounts
                  .filter((acc) => acc.id !== editingAccount?.id)
                  .map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
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
                    type: e.target.value as
                      | "Official Account"
                      | "Marketing Account",
                  })
                }
              >
                <option value="Official Account">Official Account</option>
                <option value="Marketing Account">Marketing Account</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "Unauthorized" | "Authorized",
                  })
                }
              >
                <option value="Unauthorized">Unauthorized</option>
                <option value="Authorized">Authorized</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Shops</Form.Label>
              <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                {shops.map((shop) => (
                  <Form.Check
                    key={shop.id}
                    type="checkbox"
                    label={shop.name}
                    checked={formData.shops.includes(shop.id || "")}
                    onChange={() => shop.id && toggleShop(shop.id)}
                  />
                ))}
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Users</Form.Label>
              <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                {users.map((user) => (
                  <Form.Check
                    key={user.id}
                    type="checkbox"
                    label={`${user.name} (${user.email})`}
                    checked={formData.users.includes(user.id || "")}
                    onChange={() => user.id && toggleUser(user.id)}
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
              {editingAccount ? "Update" : "Create"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

