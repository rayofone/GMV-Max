import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import SideNav from "./components/SideNav";
import Header from "./components/Header";
import FirebaseProviderWrapper from "./providers/FirebaseProvider";
import AuthProviderWrapper from "./providers/AuthProvider";
import ShopProviderWrapper from "./providers/ShopProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GMV Max Prototype",
  description: "GMV Max for testing purposes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProviderWrapper>
          <ShopProviderWrapper>
            <FirebaseProviderWrapper>
              <Header />
              <div style={{ display: "flex", flex: 1 }}>
                <SideNav />
                <div
                  style={{ marginLeft: "0", flex: 1, width: "100%" }}
                  className="content-wrapper"
                >
                  {children}
                </div>
              </div>
            </FirebaseProviderWrapper>
          </ShopProviderWrapper>
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
