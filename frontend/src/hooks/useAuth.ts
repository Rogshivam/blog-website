import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  const router = useRouter();

  // Wait before checking auth to let backend/session warm up
  const delayedAuthCheck = async (delayMs = 2000) => {
    setAuthState((prev) => ({ ...prev, loading: true }));

    await new Promise((resolve) => setTimeout(resolve, delayMs)); // countdown delay

    try {
      const res = await fetch(`${baseURL}/api/profile`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          loading: false,
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${baseURL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          loading: false,
        });
        return { success: true };
      } else {
        const errorData = await res.json();
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Login failed" };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${baseURL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
      localStorage.clear();
      router.push("/login");
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    name: string;
    age: number;
  }) => {
    try {
      const res = await fetch(`${baseURL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        return { success: true };
      } else {
        const errorData = await res.json();
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: "Registration failed" };
    }
  };

  useEffect(() => {
    delayedAuthCheck(2000); // 2-second countdown before auth check
  }, []);

  return {
    ...authState,
    login,
    logout,
    register,
    checkAuth: delayedAuthCheck,
  };
};
