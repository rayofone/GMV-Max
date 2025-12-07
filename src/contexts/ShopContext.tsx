"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { getShops } from "@/lib/firebaseAdmin";
import type { Shop } from "@/types/admin";

interface ShopContextType {
  selectedShopId: string | null;
  availableShops: Shop[];
  shopsLoading: boolean;
  setSelectedShopId: (shopId: string | null) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const { userData, isMasterAdmin, currentUser } = useAuth();
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [availableShops, setAvailableShops] = useState<Shop[]>([]);
  const [shopsLoading, setShopsLoading] = useState(true);

  // Debug: Log userData and shops array
  React.useEffect(() => {
    console.log("=== ShopProvider - User Data Check ===", {
      isMasterAdmin,
      currentUserEmail: currentUser?.email,
      userDataEmail: userData?.email,
      userDataShops: userData?.shops,
      userDataShopsLength: userData?.shops?.length || 0,
      userDataRole: userData?.role,
      userDataExists: !!userData,
      fullUserData: userData,
    });
  }, [isMasterAdmin, currentUser, userData]);

  useEffect(() => {
    const loadShops = async () => {
      try {
        setShopsLoading(true);
        const allShops = await getShops();

        console.log("=== ShopContext - Loading ALL Shops ===", {
          allShopsCount: allShops.length,
          allShops: allShops.map((s) => ({ id: s.id, name: s.name })),
        });

        // Show ALL shops from Firebase - no filtering
        setAvailableShops(allShops);

        // Auto-select first shop if none selected
        if (!selectedShopId && allShops.length > 0) {
          console.log(
            "Auto-selecting first shop:",
            allShops[0].id,
            allShops[0].name
          );
          setSelectedShopId(allShops[0].id || null);
        }
      } catch (error) {
        console.error("Error loading shops:", error);
        setAvailableShops([]);
      } finally {
        setShopsLoading(false);
      }
    };

    // Load shops when user is logged in
    if (currentUser) {
      loadShops();
    }
  }, [currentUser, selectedShopId]);

  // Update selected shop if it's no longer available
  useEffect(() => {
    if (
      selectedShopId &&
      !availableShops.some((shop) => shop.id === selectedShopId)
    ) {
      // Selected shop is no longer available, select first available
      if (availableShops.length > 0) {
        setSelectedShopId(availableShops[0].id || null);
      } else {
        setSelectedShopId(null);
      }
    }
  }, [availableShops, selectedShopId]);

  return (
    <ShopContext.Provider
      value={{
        selectedShopId,
        availableShops,
        shopsLoading,
        setSelectedShopId,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
