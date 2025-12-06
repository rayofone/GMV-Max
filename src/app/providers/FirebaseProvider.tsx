"use client";

import { FirebaseProvider } from "@/contexts/FirebaseContext";

export default function FirebaseProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FirebaseProvider>{children}</FirebaseProvider>;
}

