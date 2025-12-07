"use client";

import { ShopProvider } from "@/contexts/ShopContext";
import React from "react";

export default function ShopProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ShopProvider>{children}</ShopProvider>;
}

