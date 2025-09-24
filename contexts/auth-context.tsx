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
    // No mostrar loading en la verificación inicial para mejorar UX
    try {
      // Crear timeout manualmente para mejor compatibilidad
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout

      const res = await fetch(`${apiUrl}/auth/validate`, { 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          // Header específico para Safari
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
        // Configuración específica para Safari/iOS
        cache: 'no-store',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        setEmail(data.email);
        await isAdminUser();
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('Auth check timed out');
      } else {
        console.error("Auth check error:", error);
      }
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
      headers: { 
        'Content-Type': 'application/json',
        // Headers específicos para Safari
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      credentials: 'include',
      // Configuración específica para Safari/iOS
      cache: 'no-store',
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      switch (response.status) {
        case 480:
          throw new Error('Email inválido. Por favor, introduce un email correcto.');
        case 481:
          throw new Error('Usuario no encontrado. Revisa tus credenciales.');
        case 483:
          throw new Error('Contraseña incorrecta. Inténtalo de nuevo.');
        case 484:
          throw new Error('El email ya está en uso. Prueba con otro.');
        case 485:
          throw new Error('Error en la verificación del email. Prueba de nuevo.');
        case 486:
          throw new Error('La contraseña es demasiado débil. Usa al menos 6 caracteres.');
        case 490:
          throw new Error('Error en la autenticación. Pruebe de nuevo.');
        case 500:
          throw new Error('Error del servidor. Por favor, inténtalo más tarde.');
        default:
          throw new Error('Error desconocido. Por favor, inténtalo de nuevo.');
      }
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
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      cache: 'no-store',
    });
    setIsAuthenticated(false);
    setEmail('');
    setIsAdmin(false);
  };

  const isAdminUser = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/is-admin`, { 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
        cache: 'no-store',
      });
      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data);
        return data;
      }
    } catch (error) {
      console.error("isAdmin check error:", error);
      setIsAdmin(false);
      return false;
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