"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { AuthState, AuthContextType } from "@/types";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ isAdmin: false, username: null });

  const login = useCallback((username: string, password: string): boolean => {
    const expectedUser = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const expectedPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!expectedUser || !expectedPass) return false;
    if (username !== expectedUser || password !== expectedPass) return false;

    setAuth({ isAdmin: true, username });
    return true;
  }, []);

  const logout = useCallback(() => {
    setAuth({ isAdmin: false, username: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
