"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { collection, getDocs, query, where, or } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";

// Type definitions
export interface Creative {
  id: string | number;
  type: string;
  preview: string;
  video: string;
  name: string;
  shop: string;
  videoType?: string; // e.g., "Affiliate"
}

export interface Account {
  id?: string;
  name: string;
  type: string;
  status?: string; // e.g., "selected", "available", "unauthorized"
  shops?: string[]; // shop IDs
}

// Context interface
interface FirebaseContextType {
  // Accounts
  accounts: Account[];
  accountsLoading: boolean;
  accountsError: string | null;
  refetchAccounts: () => Promise<void>;
  
  // Creatives
  creatives: Creative[];
  creativesLoading: boolean;
  creativesError: string | null;
  refetchCreatives: () => Promise<void>;
}

// Create context
const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// Provider component
export function FirebaseProvider({ children }: { children: ReactNode }) {
  const { userData, currentUser } = useAuth();
  // Accounts state
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  // Creatives state
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [creativesLoading, setCreativesLoading] = useState(true);
  const [creativesError, setCreativesError] = useState<string | null>(null);

  // Fetch accounts function - filtered by user's shops
  const fetchAccounts = async () => {
    try {
      setAccountsLoading(true);
      setAccountsError(null);
      const accountsCollection = collection(db, "accounts");
      
      // If user is logged in and has shops, filter accounts by those shops
      if (currentUser && userData?.shops && userData.shops.length > 0) {
        // Get accounts that have any of the user's shops
        const accountsSnapshot = await getDocs(accountsCollection);
        const allAccounts: Account[] = accountsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Account[];
        
        // Filter accounts that have shops matching user's shops
        const filteredAccounts = allAccounts.filter((account) =>
          account.shops?.some((shopId) => userData.shops?.includes(shopId))
        );
        setAccounts(filteredAccounts);
      } else if (currentUser && userData?.role === "admin") {
        // Admins see all accounts
        const accountsSnapshot = await getDocs(accountsCollection);
        const accountsData: Account[] = accountsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Account[];
        setAccounts(accountsData);
      } else {
        // Not logged in or no shops - show empty
        setAccounts([]);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setAccountsError("Failed to load accounts. Please try again later.");
      setAccounts([]);
    } finally {
      setAccountsLoading(false);
    }
  };

  // Fetch creatives function - filtered by user's shops
  const fetchCreatives = async () => {
    try {
      setCreativesLoading(true);
      setCreativesError(null);
      const creativesCollection = collection(db, "creatives");
      
      // If user is logged in and has shops, filter creatives by those shops
      if (currentUser && userData?.shops && userData.shops.length > 0) {
        const creativesSnapshot = await getDocs(creativesCollection);
        const allCreatives: Creative[] = creativesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            type: data.type || "",
            preview: data.preview || "",
            video: data.video || "",
            name: data.name || "",
            shop: data.shop || "",
            videoType: data.videoType || "",
          };
        });
        
        // Filter creatives that belong to user's shops
        const filteredCreatives = allCreatives.filter((creative) =>
          userData.shops?.includes(creative.shop)
        );
        setCreatives(filteredCreatives);
      } else if (currentUser && userData?.role === "admin") {
        // Admins see all creatives
        const creativesSnapshot = await getDocs(creativesCollection);
        const creativesData: Creative[] = creativesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            type: data.type || "",
            preview: data.preview || "",
            video: data.video || "",
            name: data.name || "",
            shop: data.shop || "",
            videoType: data.videoType || "",
          };
        });
        setCreatives(creativesData);
      } else {
        // Not logged in or no shops - show empty
        setCreatives([]);
      }
    } catch (error) {
      console.error("Error fetching creatives:", error);
      setCreativesError("Failed to load creatives. Please try again later.");
      setCreatives([]);
    } finally {
      setCreativesLoading(false);
    }
  };

  // Initial fetch on mount and when user changes
  useEffect(() => {
    if (currentUser !== undefined) {
      fetchAccounts();
      fetchCreatives();
    }
  }, [currentUser, userData]);

  const value: FirebaseContextType = {
    accounts,
    accountsLoading,
    accountsError,
    refetchAccounts: fetchAccounts,
    creatives,
    creativesLoading,
    creativesError,
    refetchCreatives: fetchCreatives,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

// Custom hook to use Firebase context
export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}

