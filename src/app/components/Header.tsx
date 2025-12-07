"use client";

import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, NavDropdown, Alert } from "react-bootstrap";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useShop } from "@/contexts/ShopContext";
import { useRouter } from "next/navigation";
import { LogOut, User, Store } from "lucide-react";
import { getShops } from "@/lib/firebaseAdmin";
import type { Shop } from "@/types/admin";

export default function Header() {
  const { currentUser, userData, logout } = useAuth();
  const { selectedShopId, setSelectedShopId } = useShop();
  const router = useRouter();
  const [accessError, setAccessError] = useState<string | null>(null);
  const [allShops, setAllShops] = useState<Shop[]>([]);
  const [shopsLoading, setShopsLoading] = useState(true);

  // Load all shops from Firebase - no filtering
  useEffect(() => {
    const loadShops = async () => {
      try {
        setShopsLoading(true);
        const shops = await getShops();
        if (shops && Array.isArray(shops)) {
          setAllShops(shops);
        } else {
          setAllShops([]);
        }
      } catch (error) {
        console.error("Error loading shops:", error);
        setAllShops([]);
      } finally {
        setShopsLoading(false);
      }
    };

    loadShops();
  }, []); // Load once on mount

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleShopSelect = (shopId: string) => {
    if (!shopId) return;
    setSelectedShopId(shopId);
    setAccessError(null);
  };

  const selectedShop = allShops.find((shop) => shop.id === selectedShopId);

  return (
    <>
      {/* Access Error Alert - Fixed at top below navbar */}
      {accessError && (
        <div
          style={{
            position: "fixed",
            top: "56px", // Navbar height
            left: 0,
            right: 0,
            zIndex: 1050,
            padding: "0.5rem 1rem",
          }}
        >
          <Alert
            variant="warning"
            dismissible
            onClose={() => setAccessError(null)}
            className="mb-0"
          >
            {accessError}
          </Alert>
        </div>
      )}

      <Navbar bg="dark" data-bs-theme="dark" fixed="top">
        <Container fluid>
          <Navbar.Brand href="/">Prototype App</Navbar.Brand>
          <Nav className="ms-auto">
            {currentUser && (
              <NavDropdown
                title={
                  <span className="d-flex align-items-center">
                    <Store size={16} className="me-2" />
                    {shopsLoading
                      ? "Loading..."
                      : allShops.length === 0
                      ? "No Shops"
                      : selectedShop
                      ? selectedShop.name
                      : "Ray's Card shop"}
                  </span>
                }
                id="shop-dropdown"
                disabled={shopsLoading}
              >
                {allShops.length > 0 ? (
                  allShops.map((shop) => (
                    <NavDropdown.Item
                      key={shop.id}
                      active={shop.id === selectedShopId}
                      onClick={() => shop.id && handleShopSelect(shop.id)}
                    >
                      {shop.name}
                    </NavDropdown.Item>
                  ))
                ) : (
                  <NavDropdown.ItemText>
                    {shopsLoading ? "Loading shops..." : "No shops available"}
                  </NavDropdown.ItemText>
                )}
              </NavDropdown>
            )}
            {currentUser ? (
              <>
                {/* <Nav.Link as={Link} href="/adminmanagement">
                  Admin
                </Nav.Link> */}
                <NavDropdown
                  title={
                    <span className="d-flex align-items-center">
                      <User size={16} className="me-2" />
                      {userData?.name || currentUser.email}
                    </span>
                  }
                  id="user-dropdown"
                >
                  <NavDropdown.ItemText>
                    <small>{userData?.email || currentUser.email}</small>
                  </NavDropdown.ItemText>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <LogOut size={16} className="me-2" />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Nav.Link as={Link} href="/login">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}
