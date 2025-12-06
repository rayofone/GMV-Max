'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './ContentSideNav.module.css';

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  {
    href: '/',
    icon: '📊',
    label: 'Campaigns',
  },
  {
    href: '#',
    icon: '⏸️',
    label: 'Creatives',
  },
  {
    href: '#',
    icon: '⚠️',
    label: 'Accounts',
  },
];

export default function ContentSideNav({ className }: { className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <nav
      className={`${styles.contentSideNav} ${className ?? ''} rounded`}
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
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
