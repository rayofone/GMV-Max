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
import { Timestamp } from "firebase/firestore";
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
          isMasterAdmin: userDataFromFirebase.isMasterAdmin,
          isAdmin: userDataFromFirebase.isAdmin,
          role: userDataFromFirebase.role,
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
        isAdmin: false, // Explicitly set to false for new users
        isMasterAdmin: false, // Explicitly set to false for new users
      });
    }
    await fetchUserData(
      userCredential.user.uid,
      userCredential.user.email || undefined
    );
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log("Google login - User authenticated:", {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      });

      if (!user.email) {
        throw new Error("Google account does not have an email address");
      }

      // Always check if user document exists, create one if it doesn't
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.log(
          "User document does not exist, creating new user document..."
        );

        // Determine if this is master admin
        const isMasterAdminUser = user.email === MASTER_ADMIN_EMAIL;

        // Create user document with Google account info
        const userDataToCreate = {
          email: user.email,
          name: user.displayName || user.email.split("@")[0] || "User",
          role: isMasterAdminUser ? "admin" : "user",
          shops: [], // Start with empty shops array
          isAdmin: isMasterAdminUser ? true : false, // Explicitly set to false for regular users
          isMasterAdmin: isMasterAdminUser ? true : false, // Explicitly set to false for regular users
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        console.log("Creating user document with data:", {
          ...userDataToCreate,
          createdAt: "Timestamp.now()",
          updatedAt: "Timestamp.now()",
        });

        await setDoc(userDocRef, userDataToCreate);
        console.log("User document created successfully with ID:", user.uid);
      } else {
        console.log("User document already exists:", {
          id: userDoc.id,
          email: userDoc.data().email,
          shops: userDoc.data().shops,
        });
      }

      // Fetch user data (this will get the newly created document or existing one)
      await fetchUserData(user.uid, user.email);
    } catch (error) {
      console.error("Error during Google login:", error);
      throw error;
    }
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

  // Check isMasterAdmin from userData document OR email fallback
  const isMasterAdmin =
    userData?.isMasterAdmin === true ||
    currentUser?.email === MASTER_ADMIN_EMAIL;

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
