"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
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
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [availableShops, setAvailableShops] = useState<Shop[]>([]);
  const [shopsLoading, setShopsLoading] = useState(true);

  useEffect(() => {
    const loadShops = async () => {
      try {
        setShopsLoading(true);
        const allShops = await getShops();
        setAvailableShops(allShops);

        // Auto-select first shop if none selected
        if (!selectedShopId && allShops.length > 0 && allShops[0].id) {
          setSelectedShopId(allShops[0].id);
        }
      } catch (error) {
        console.error("Error loading shops:", error);
        setAvailableShops([]);
      } finally {
        setShopsLoading(false);
      }
    };

    loadShops();
  }, []); // Load once on mount

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
