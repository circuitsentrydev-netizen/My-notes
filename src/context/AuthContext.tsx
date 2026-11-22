import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { storage } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, password: string, username: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateCredentials: (updates: { email?: string; password?: string; username?: string }) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const current = await storage.getCurrentUser();
      setUser(current);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    const users = await storage.getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Email already registered' };
    }
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, message: 'Username already taken' };
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: email.trim(),
      username: username.trim(),
      password,
    };

    users.push(newUser);
    await storage.saveUsers(users);
    await storage.setCurrentUser(newUser);
    setUser(newUser);
    return { success: true };
  };

  const login = async (email: string, password: string) => {
    const users = await storage.getUsers();
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      return { success: false, message: 'Invalid email or password' };
    }
    await storage.setCurrentUser(found);
    setUser(found);
    return { success: true };
  };

  const logout = async () => {
    await storage.setCurrentUser(null);
    setUser(null);
  };

  const updateCredentials = async (updates: { email?: string; password?: string; username?: string }) => {
    if (!user) return { success: false, message: 'Not logged in' };

    const users = await storage.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index === -1) return { success: false, message: 'User not found' };

    if (updates.email && users.some(u => u.id !== user.id && u.email.toLowerCase() === updates.email!.toLowerCase())) {
      return { success: false, message: 'Email already in use' };
    }
    if (updates.username && users.some(u => u.id !== user.id && u.username.toLowerCase() === updates.username!.toLowerCase())) {
      return { success: false, message: 'Username already taken' };
    }

    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    await storage.saveUsers(users);
    await storage.setCurrentUser(updatedUser);
    setUser(updatedUser);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateCredentials }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
