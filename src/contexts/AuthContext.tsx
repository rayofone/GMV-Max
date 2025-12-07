"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import type { User } from "@/types/admin";

// Master admin email
const MASTER_ADMIN_EMAIL = "rayofone@gmail.com";

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  isMasterAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string, email?: string) => {
    try {
      // Always try to fetch user document from Firebase first
      const userDoc = await getDoc(doc(db, "users", uid));

      if (userDoc.exists()) {
        // User document exists - use it (includes shops array)
        const userDataFromFirebase = {
          id: userDoc.id,
          ...userDoc.data(),
        } as User;
        console.log("Fetched user data from Firebase:", {
          id: userDataFromFirebase.id,
          email: userDataFromFirebase.email,
          shops: userDataFromFirebase.shops,
          shopsLength: userDataFromFirebase.shops?.length || 0,
        });
        setUserData(userDataFromFirebase);
      } else if (email === MASTER_ADMIN_EMAIL) {
        // Master admin but no document - create default
        console.log("Master admin with no Firebase document - using default");
        setUserData({
          id: uid,
          email: email,
          name: "Master Admin",
          role: "admin",
          shops: [],
        } as User);
      } else {
        // No user document and not master admin
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserData(user.uid, user.email || undefined);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    await fetchUserData(
      userCredential.user.uid,
      userCredential.user.email || undefined
    );
  };

  const signup = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Create user document in Firestore (unless master admin)
    if (email !== MASTER_ADMIN_EMAIL) {
      const { createUser } = await import("@/lib/firebaseAdmin");
      await createUser({
        email,
        name,
        role: "user",
        shops: [],
      });
    }
    await fetchUserData(
      userCredential.user.uid,
      userCredential.user.email || undefined
    );
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user document exists, if not create one (unless master admin)
    if (user.email !== MASTER_ADMIN_EMAIL) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        // Create user document with Google account info
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          name: user.displayName || user.email?.split("@")[0] || "User",
          role: "user",
          shops: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    await fetchUserData(user.uid, user.email || undefined);
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  const refreshUserData = async () => {
    if (currentUser) {
      await fetchUserData(currentUser.uid, currentUser.email || undefined);
    }
  };

  const isMasterAdmin = currentUser?.email === MASTER_ADMIN_EMAIL;

  const value = {
    currentUser,
    userData,
    loading,
    isMasterAdmin,
    login,
    signup,
    loginWithGoogle,
    logout,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
