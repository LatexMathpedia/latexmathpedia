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
    loginWithGoogle: async (_idToken: any) => false,
    logout: async () => {},
    checkAuth: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  // Función helper para crear opciones de fetch optimizadas para Safari
  const createFetchOptions = (method: string, body?: any): RequestInit => {
    const options: RequestInit = {
      method,
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      cache: 'no-store',
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    return options;
  };

  const checkAuth = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${apiUrl}/auth/validate`, { 
        ...createFetchOptions('GET'),
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
        setEmail('');
        setIsAdmin(false);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('Auth check timed out - server may be slow');
      } else {
        console.error("Auth check error:", error);
      }
      setIsAuthenticated(false);
      setEmail('');
      setIsAdmin(false);
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

    try {
      const response = await fetch(`${apiUrl}/auth/login`, createFetchOptions('POST', credentials));

      if (!response.ok) {
        checkError(response.status);
      }

      // Importante: Esperar un poco para que Safari procese la cookie
      await new Promise(resolve => setTimeout(resolve, 300));

      setIsAuthenticated(true);
      await isAdminUser();
      await checkAuth();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async (idToken: any) => {
    try {
      const response = await fetch(`${apiUrl}/auth/google-login`, createFetchOptions('POST', { idToken }));
      if (!response.ok) {
        checkError(response.status);
      }
      // Importante: Esperar un poco para que Safari procese la cookie
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsAuthenticated(true);
      await isAdminUser();
      await checkAuth();
      return true;
    } catch (error) {
      console.error('Google Login error:', error);
      throw error;
    }
  }

  const checkError = (error: any) => {
    switch (error) {
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

  const logout = async () => {
    try {
      await fetch(`${apiUrl}/auth/logout`, createFetchOptions('POST'));
      
      // Esperar un poco para que Safari procese el logout
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setIsAuthenticated(false);
      setEmail('');
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Aún así limpiar el estado local
      setIsAuthenticated(false);
      setEmail('');
      setIsAdmin(false);
    }
  };

  const isAdminUser = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/is-admin`, createFetchOptions('GET'));
      
      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data);
        return data;
      } else {
        setIsAdmin(false);
        return false;
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
      value={{ isAuthenticated, loading, isAdmin, email, login, loginWithGoogle, logout, checkAuth }}
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