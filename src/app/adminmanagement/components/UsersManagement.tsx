"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert, Badge } from "react-bootstrap";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getShops,
} from "@/lib/firebaseAdmin";
import type { User } from "@/types/admin";
import type { Shop } from "@/types/admin";

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "user" as "admin" | "user",
    shops: [] as string[],
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersData, shopsData] = await Promise.all([
        getUsers(),
        getShops(),
      ]);
      setUsers(usersData);
      setShops(shopsData);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        name: user.name,
        role: user.role,
        shops: user.shops || [],
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: "",
        name: "",
        role: "user",
        shops: [],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      email: "",
      name: "",
      role: "user",
      shops: [],
    });
  };

  const toggleShop = (shopId: string) => {
    setFormData({
      ...formData,
      shops: formData.shops.includes(shopId)
        ? formData.shops.filter((id) => id !== shopId)
        : [...formData.shops, shopId],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingUser?.id) {
        await updateUser(editingUser.id, formData);
      } else {
        await createUser(formData);
      }
      handleCloseModal();
      loadUsers();
    } catch (err) {
      setError("Failed to save user");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch (err) {
      setError("Failed to delete user");
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Users Management</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={16} className="me-2" />
          Create User
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Shops</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Badge bg={user.role === "admin" ? "danger" : "secondary"}>
                  {user.role}
                </Badge>
              </td>
              <td>
                {user.shops && user.shops.length > 0 ? (
                  <Badge bg="info">
                    {user.shops.length} shop{user.shops.length !== 1 ? "s" : ""}
                  </Badge>
                ) : (
                  <span className="text-muted">No shops</span>
                )}
              </td>
              <td>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => handleOpenModal(user)}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => user.id && handleDelete(user.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? "Edit User" : "Create User"}</Modal.Title>
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
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as "admin" | "user",
                  })
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Shops</Form.Label>
              <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                {shops.length > 0 ? (
                  shops.map((shop) => (
                    <Form.Check
                      key={shop.id}
                      type="checkbox"
                      label={shop.name}
                      checked={formData.shops.includes(shop.id || "")}
                      onChange={() => shop.id && toggleShop(shop.id)}
                    />
                  ))
                ) : (
                  <p className="text-muted">No shops available</p>
                )}
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingUser ? "Update" : "Create"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
