"use client";

import React from "react";
import { Container, Nav, Navbar, Button, NavDropdown } from "react-bootstrap";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useShop } from "@/contexts/ShopContext";
import { useRouter } from "next/navigation";
import { LogOut, User, Store } from "lucide-react";

export default function Header() {
  const { currentUser, userData, logout } = useAuth();
  const { selectedShopId, availableShops, shopsLoading, setSelectedShopId } =
    useShop();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const selectedShop = availableShops.find(
    (shop) => shop.id === selectedShopId
  );

  // Debug logging
  React.useEffect(() => {
    console.log("Header Debug:", {
      currentUser: !!currentUser,
      currentUserEmail: currentUser?.email,
      availableShops: availableShops.length,
      availableShopsData: availableShops,
      shopsLoading,
      selectedShopId,
      selectedShop,
    });
  }, [currentUser, availableShops, shopsLoading, selectedShopId, selectedShop]);

  return (
    <Navbar bg="dark" data-bs-theme="dark" fixed="top">
      <Container fluid>
        <Navbar.Brand href="/">Prototype App</Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link as={Link} href="/">
            Dashboard
          </Nav.Link>
          {currentUser && (
            <NavDropdown
              title={
                <span className="d-flex align-items-center">
                  <Store size={16} className="me-2" />
                  {shopsLoading
                    ? "Loading..."
                    : availableShops.length === 0
                    ? "No Shops"
                    : selectedShop
                    ? selectedShop.name
                    : "Select Shop"}
                </span>
              }
              id="shop-dropdown"
              disabled={shopsLoading}
            >
              {availableShops.map((shop) => (
                <NavDropdown.Item
                  key={shop.id}
                  active={shop.id === selectedShopId}
                  onClick={() => shop.id && setSelectedShopId(shop.id)}
                >
                  {shop.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          )}
          {currentUser ? (
            <>
              <Nav.Link as={Link} href="/adminmanagement">
                Admin
              </Nav.Link>
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
  );
}
