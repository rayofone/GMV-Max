"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { collection, getDocs, query, where, or } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";

// Type definitions
export interface Creative {
  id: string | number;
  type: "Video" | "Image";
  preview: string;
  video: string;
  name: string;
  shop: string;
  videoType?: string; // e.g., "Affiliate post", "TikTok post"
  campaigns?: string[]; // Array of campaign IDs this creative is used in
}

export interface Account {
  id?: string;
  parentAccount?: string;
  name: string;
  type: "Official Account" | "Marketing Account";
  status?: string; // e.g., "selected", "available", "unauthorized"
  shops?: string[]; // shop IDs
  users?: string[]; // user IDs
  createdAt?: Date;
  updatedAt?: Date;
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
const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
);

// Provider component
export function FirebaseProvider({ children }: { children: ReactNode }) {
  const { userData, currentUser, isMasterAdmin } = useAuth();
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

      // Master admin or regular admin sees all accounts
      if (currentUser && (isMasterAdmin || userData?.role === "admin")) {
        const accountsSnapshot = await getDocs(accountsCollection);
        const accountsData: Account[] = accountsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Account[];
        setAccounts(accountsData);
      } else if (currentUser && userData?.shops && userData.shops.length > 0) {
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

      // Master admin or regular admin sees all creatives
      if (currentUser && (isMasterAdmin || userData?.role === "admin")) {
        const creativesSnapshot = await getDocs(creativesCollection);
        const creativesData: Creative[] = creativesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            type: (data.type || "Video") as "Video" | "Image",
            preview: data.preview || "",
            video: data.video || "",
            name: data.name || "",
            shop: data.shop || "",
            videoType: data.videoType || "TikTok post",
            campaigns: data.campaigns || [],
          };
        });
        setCreatives(creativesData);
      } else if (currentUser && userData?.shops && userData.shops.length > 0) {
        const creativesSnapshot = await getDocs(creativesCollection);
        const allCreatives: Creative[] = creativesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            type: (data.type || "Video") as "Video" | "Image",
            preview: data.preview || "",
            video: data.video || "",
            name: data.name || "",
            shop: data.shop || "",
            videoType: data.videoType || "TikTok post",
            campaigns: data.campaigns || [],
          };
        });

        // Filter creatives that belong to user's shops
        const filteredCreatives = allCreatives.filter((creative) =>
          userData.shops?.includes(creative.shop)
        );
        setCreatives(filteredCreatives);
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
