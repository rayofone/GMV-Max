"use client";

import React, { useState } from "react";
import { Container, Nav, Tab } from "react-bootstrap";
import UsersManagement from "./components/UsersManagement";
import AccountsManagement from "./components/AccountsManagement";
import CreativesManagement from "./components/CreativesManagement";
import ProductsManagement from "./components/ProductsManagement";
import ShopsManagement from "./components/ShopsManagement";

export default function AdminManagement() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <Container className="py-5 mt-5">
      <h1 className="mb-4">Admin Management</h1>
      
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || "users")}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="users">Users</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="accounts">Accounts</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="creatives">Creatives</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="products">Products</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="shops">Shops</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="users">
            <UsersManagement />
          </Tab.Pane>
          <Tab.Pane eventKey="accounts">
            <AccountsManagement />
          </Tab.Pane>
          <Tab.Pane eventKey="creatives">
            <CreativesManagement />
          </Tab.Pane>
          <Tab.Pane eventKey="products">
            <ProductsManagement />
          </Tab.Pane>
          <Tab.Pane eventKey="shops">
            <ShopsManagement />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}

