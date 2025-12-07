// Firebase Admin CRUD Operations

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  User,
  Account,
  Creative,
  Product,
  Shop,
  Campaign,
} from "@/types/admin";

// Helper to convert Firestore timestamps
const convertTimestamps = (data: any) => {
  const converted = { ...data };
  if (converted.createdAt?.toDate) {
    converted.createdAt = converted.createdAt.toDate();
  }
  if (converted.updatedAt?.toDate) {
    converted.updatedAt = converted.updatedAt.toDate();
  }
  return converted;
};

// ==================== USERS ====================

export const getUser = async (id: string): Promise<User | null> => {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...convertTimestamps(docSnap.data()) } as User;
  }
  return null;
};

export const getUsers = async (): Promise<User[]> => {
  const querySnapshot = await getDocs(collection(db, "users"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as User[];
};

export const createUser = async (userData: Omit<User, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, "users"), {
    ...userData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateUser = async (
  id: string,
  userData: Partial<Omit<User, "id">>
): Promise<void> => {
  const docRef = doc(db, "users", id);
  await updateDoc(docRef, {
    ...userData,
    updatedAt: Timestamp.now(),
  });
};

export const deleteUser = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "users", id));
};

// ==================== ACCOUNTS ====================

export const getAccount = async (id: string): Promise<Account | null> => {
  const docRef = doc(db, "accounts", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...convertTimestamps(docSnap.data()) } as Account;
  }
  return null;
};

export const getAccounts = async (): Promise<Account[]> => {
  const querySnapshot = await getDocs(collection(db, "accounts"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as Account[];
};

export const createAccount = async (
  accountData: Omit<Account, "id">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "accounts"), {
    ...accountData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateAccount = async (
  id: string,
  accountData: Partial<Omit<Account, "id">>
): Promise<void> => {
  const docRef = doc(db, "accounts", id);
  await updateDoc(docRef, {
    ...accountData,
    updatedAt: Timestamp.now(),
  });
};

export const deleteAccount = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "accounts", id));
};

// ==================== CREATIVES ====================

export const getCreative = async (id: string): Promise<Creative | null> => {
  const docRef = doc(db, "creatives", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...convertTimestamps(docSnap.data()) } as Creative;
  }
  return null;
};

export const getCreatives = async (): Promise<Creative[]> => {
  const querySnapshot = await getDocs(collection(db, "creatives"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as Creative[];
};

export const getCreativesByAccount = async (
  accountId: string
): Promise<Creative[]> => {
  const q = query(
    collection(db, "creatives"),
    where("account", "==", accountId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as Creative[];
};

export const createCreative = async (
  creativeData: Omit<Creative, "id">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "creatives"), {
    ...creativeData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateCreative = async (
  id: string,
  creativeData: Partial<Omit<Creative, "id">>
): Promise<void> => {
  const docRef = doc(db, "creatives", id);
  await updateDoc(docRef, {
    ...creativeData,
    updatedAt: Timestamp.now(),
  });
};

export const deleteCreative = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "creatives", id));
};

// ==================== PRODUCTS ====================

export const getProduct = async (id: string): Promise<Product | null> => {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...convertTimestamps(docSnap.data()) } as Product;
  }
  return null;
};

export const getProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as Product[];
};

export const getProductsByAccount = async (
  accountId: string
): Promise<Product[]> => {
  const q = query(
    collection(db, "products"),
    where("account", "==", accountId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as Product[];
};

export const getProductsByShop = async (
  shopId: string
): Promise<Product[]> => {
  const q = query(
    collection(db, "products"),
    where("shop", "==", shopId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as Product[];
};

export const createProduct = async (
  productData: Omit<Product, "id">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "products"), {
    ...productData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateProduct = async (
  id: string,
  productData: Partial<Omit<Product, "id">>
): Promise<void> => {
  const docRef = doc(db, "products", id);
  await updateDoc(docRef, {
    ...productData,
    updatedAt: Timestamp.now(),
  });
};

export const deleteProduct = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "products", id));
};

// ==================== SHOPS ====================

export const getShop = async (id: string): Promise<Shop | null> => {
  const docRef = doc(db, "shops", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...convertTimestamps(docSnap.data()) } as Shop;
  }
  return null;
};

export const getShops = async (): Promise<Shop[]> => {
  const querySnapshot = await getDocs(collection(db, "shops"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as Shop[];
};

export const getShopsByOwner = async (ownerId: string): Promise<Shop[]> => {
  const q = query(
    collection(db, "shops"),
    where("owner", "==", ownerId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as Shop[];
};

export const createShop = async (
  shopData: Omit<Shop, "id">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "shops"), {
    ...shopData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateShop = async (
  id: string,
  shopData: Partial<Omit<Shop, "id">>
): Promise<void> => {
  const docRef = doc(db, "shops", id);
  await updateDoc(docRef, {
    ...shopData,
    updatedAt: Timestamp.now(),
  });
};

export const deleteShop = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "shops", id));
};

// ==================== CAMPAIGNS ====================

export const getCampaign = async (id: string): Promise<Campaign | null> => {
  const docRef = doc(db, "campaigns", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...convertTimestamps(docSnap.data()) } as Campaign;
  }
  return null;
};

export const getCampaigns = async (): Promise<Campaign[]> => {
  const querySnapshot = await getDocs(collection(db, "campaigns"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as Campaign[];
};

export const getCampaignsByUser = async (userId: string): Promise<Campaign[]> => {
  const q = query(
    collection(db, "campaigns"),
    where("userId", "==", userId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as Campaign[];
};

export const createCampaign = async (
  campaignData: Omit<Campaign, "id">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "campaigns"), {
    ...campaignData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateCampaign = async (
  id: string,
  campaignData: Partial<Omit<Campaign, "id">>
): Promise<void> => {
  const docRef = doc(db, "campaigns", id);
  await updateDoc(docRef, {
    ...campaignData,
    updatedAt: Timestamp.now(),
  });
};

export const deleteCampaign = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "campaigns", id));
};

