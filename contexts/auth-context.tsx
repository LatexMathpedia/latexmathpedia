"use client"

import { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';

type CredentialsDTO = {
    email: string;
    password: string;
}

const AuthContext = createContext({
    isAuthenticated: false,
    loading: true,
    isAdmin: false,
    email: '',
    login: async (_credentials: CredentialsDTO) => false,
    logout: async () => {},
    checkAuth: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const checkAuth = async () => {
    setLoading(true);
    try {
      console.log("Checking authentication status...");
      const res = await fetch(`${apiUrl}/auth/validate`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        console.log("Auth validated successfully:", data);
        setIsAuthenticated(true);
        setEmail(data.userEmail);
        await isAdminUser();
      } else {
        console.log("Auth validation failed:", res.status);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials:CredentialsDTO) => {
    if (
      !credentials.email ||
      !credentials.password ||
      credentials.email.trim() === '' ||
      credentials.password.trim() === ''
    ) {
      throw new Error('Email and password are required');
    }

    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    setIsAuthenticated(true);
    await isAdminUser();
    await checkAuth()
    return true;
  };

  const logout = async () => {
    await fetch(`${apiUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setIsAuthenticated(false);
  };

  const isAdminUser = async () => {
    const response = await fetch(`${apiUrl}/auth/is-admin`, { credentials: 'include' });
    if (response.ok) {
      const data = await response.json();
      setIsAdmin(data);
      return data;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, isAdmin, email, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};