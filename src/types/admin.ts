// Admin Management Type Definitions

export interface User {
  id?: string;
  email: string;
  name: string;
  role: "admin" | "user";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Account {
  id?: string;
  name: string;
  parentAccount?: string;
  shops: string[]; // shop IDs
  status: "Unauthorized" | "Authorized";
  type: "Official Account" | "Marketing Account";
  users: string[]; // user IDs
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Creative {
  id?: string;
  account: string; // account ID
  authorized: boolean;
  name: string;
  shop: string; // shop ID
  type: "Video" | "Image";
  video?: string; // URL
  videoType: "TikTok post" | "Authorized post" | "Affiliate post" | "Custom post" | "AIGC images";
  caption?: string;
  preview?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Product {
  id?: string;
  account: string; // account ID
  creativeImages: string[]; // creative IDs
  creativeVideos: string[]; // creative IDs
  description?: string;
  caption?: string;
  price: string | number;
  name: string;
  shop: string; // shop ID
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Shop {
  id?: string;
  name: string;
  owner: string; // user ID
  accounts: string[]; // account IDs
  createdAt?: Date;
  updatedAt?: Date;
}

