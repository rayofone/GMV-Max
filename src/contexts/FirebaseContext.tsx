"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  // Accounts state
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  // Creatives state
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [creativesLoading, setCreativesLoading] = useState(true);
  const [creativesError, setCreativesError] = useState<string | null>(null);

  // Fetch accounts function
  const fetchAccounts = async () => {
    try {
      setAccountsLoading(true);
      setAccountsError(null);
      const accountsCollection = collection(db, "accounts");
      const accountsSnapshot = await getDocs(accountsCollection);
      const accountsData: Account[] = accountsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Account[];
      setAccounts(accountsData);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setAccountsError("Failed to load accounts. Please try again later.");
      setAccounts([]);
    } finally {
      setAccountsLoading(false);
    }
  };

  // Fetch creatives function
  const fetchCreatives = async () => {
    try {
      setCreativesLoading(true);
      setCreativesError(null);
      const creativesCollection = collection(db, "creatives");
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
    } catch (error) {
      console.error("Error fetching creatives:", error);
      setCreativesError("Failed to load creatives. Please try again later.");
      setCreatives([]);
    } finally {
      setCreativesLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchAccounts();
    fetchCreatives();
  }, []);

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

