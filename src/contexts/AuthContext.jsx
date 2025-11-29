import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getApiUrl } from "../Config/api";

const STORAGE_KEY = "bvss-auth";

const AuthContext = createContext(null);

const getStoredAuth = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Failed to read auth data from storage:", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(getStoredAuth);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (authState) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [authState]);

  const authenticate = useCallback(async (endpoint, credentials) => {
    try {
      const response = await fetch(getApiUrl(endpoint), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          payload?.message || "Authentication request failed. Please try again.";
        throw new Error(message);
      }

      setAuthState(payload);
      return payload;
    } catch (error) {
      console.error("Auth request failed:", error);
      throw error;
    }
  }, []);

  const login = useCallback(
    (credentials) => authenticate("/auth/login", credentials),
    [authenticate]
  );

  const signup = useCallback(
    (credentials) => authenticate("/auth/signup", credentials),
    [authenticate]
  );

  const logout = useCallback(() => {
    setAuthState(null);
  }, []);

  const value = useMemo(
    () => ({
      token: authState?.token || null,
      user: authState?.user || null,
      isAuthenticated: Boolean(authState?.token),
      login,
      signup,
      logout,
    }),
    [authState, login, logout, signup]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
