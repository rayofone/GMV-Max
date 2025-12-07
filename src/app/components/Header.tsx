'use client';

import React from 'react';
import { Container, Nav, Navbar, Button, Dropdown } from 'react-bootstrap';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';

export default function Header() {
  const { currentUser, userData, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark" fixed="top">
      <Container fluid>
        <Navbar.Brand href="/">Prototype App</Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link as={Link} href="/">
            Dashboard
          </Nav.Link>
          {currentUser ? (
            <>
              <Nav.Link as={Link} href="/adminmanagement">
                Admin
              </Nav.Link>
              <Dropdown>
                <Dropdown.Toggle
                  variant="dark"
                  id="user-dropdown"
                  className="d-flex align-items-center"
                >
                  <User size={16} className="me-2" />
                  {userData?.name || currentUser.email}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.ItemText>
                    <small>{userData?.email || currentUser.email}</small>
                  </Dropdown.ItemText>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <LogOut size={16} className="me-2" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
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
