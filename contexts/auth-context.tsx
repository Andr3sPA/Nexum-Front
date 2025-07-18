import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { LocalStorageService } from "@/lib/services/local-storage.service";

interface AuthUser {
  id: string;
  email: string;
  role: string;
  name?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Cargar usuario desde localStorage al montar
    const storedUser = LocalStorageService.getItem<AuthUser>("user");
    setUser(storedUser || null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
} 