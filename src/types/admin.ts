// Admin Management Type Definitions

export interface User {
  id?: string;
  email: string;
  name: string;
  role: "admin" | "user";
  shops?: string[]; // shop IDs
  isAdmin?: boolean;
  isMasterAdmin?: boolean;
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
  source?: string; // Source of the creative
  campaigns?: string[]; // Array of campaign IDs this creative is used in
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
  accounts?: string[]; // account IDs
  products?: string[]; // product IDs
  users?: string[]; // user IDs who can access
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Campaign {
  id?: string;
  name: string;
  type?: "products" | "LIVE"; // Campaign type: products or LIVE
  budget?: string;
  startDate?: string;
  endDate?: string;
  targetAudience?: string;
  description?: string;
  shop: string; // shop ID
  account: string; // account ID
  userId: string; // user ID who created it
  autoMode?: boolean; // Auto-select mode (true = auto, false = manual)
  selectedCreatives?: (string | number)[]; // selected creative IDs
  selectedAccounts?: string[]; // selected account IDs
  excludedCreatives?: (string | number)[]; // excluded creative IDs
  creatives?: (string | number)[]; // Array of creative IDs used in this campaign
  // New fields for dashboard table
  enabled?: boolean; // On/Off switch
  status?: "Active" | "Inactive"; // Status
  recommendations?: string; // Recommendations text
  currentOptimizations?: string; // Current optimizations text
  scheduleTime?: string; // Schedule time (date)
  currentBudget?: string; // Current budget (currency)
  creativeBoostBudget?: string; // Creative boost budget (currency)
  testingPhase?: boolean; // Testing phase (yes/no)
  targetROI?: string; // Target ROI text
  cost?: string; // Cost (currency)
  netCost?: string; // Net Cost (currency)
  ordersSKU?: string; // Orders (SKU) text
  costPerOrder?: string; // Cost per order text
  grossRevenue?: string; // Gross revenue (currency)
  roi?: string; // ROI text
  createdAt?: Date;
  updatedAt?: Date;
}
