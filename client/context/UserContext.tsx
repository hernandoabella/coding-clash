"use client";

import { createContext, useState, ReactNode } from "react";
import { mockUser, User } from "../mocks/users";

interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  // Simulate login
  const login = (username: string, password: string) => {
    // For now, we just use mockUser
    setUser(mockUser);
  };

  // Logout
  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
