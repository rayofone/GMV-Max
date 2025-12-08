"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./SideNav.module.css";

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  {
    href: "/",
    label: "GMV MAV Home",
  },
  {
    href: "/campaigns/create",
    label: "Testing Link",
  },
  {
    href: "!#",
    label: "Testing Link 2",
  },
];

export default function SideNav() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <nav
      className={styles.sideNav}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={styles.navContent}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={styles.navItem}
            title={item.label}
          >
            <span className={styles.label}>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
