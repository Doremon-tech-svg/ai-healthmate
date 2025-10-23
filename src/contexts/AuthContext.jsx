import { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Email/Password signup
  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  // Email/Password login
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // ✅ Google Sign-In
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  // Logout
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{ user, login, signup, loginWithGoogle, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook for components to use
export function useAuth() {
  return useContext(AuthContext);
}
