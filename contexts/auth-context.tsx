"use client"

// AUTH MOCKEADA (T-13, MIGRATION.md): decisión de producto vigente mientras no exista
// Keycloak real en el backend (ver MIGRATION.md T-10/T-12, hoy en pausa). Este contexto
// NO llama a ningún endpoint de auth del backend: expone tres identidades locales fijas
// (admin / usuario / anónimo) que se alternan desde `nav-user.tsx` y se persisten en
// localStorage. Cuando Keycloak esté listo, sustituye la implementación de este fichero
// detrás de la misma interfaz pública — el resto de la app no debería enterarse del cambio.
//
// Importante: como no hay JWT real, las llamadas a endpoints protegidos del backend
// (GET /pdf, POST /pdf/create, ...) devolverán 401 de verdad contra el backend aunque
// `isAuthenticated`/`isAdmin` sean `true` aquí. Es un límite conocido y aceptado por ahora.

import { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';

type CredentialsDTO = {
  email: string;
  password: string;
}

export type MockIdentity = "admin" | "user" | "anonymous";

const MOCK_ACCOUNTS: Record<Exclude<MockIdentity, "anonymous">, { email: string; displayName: string }> = {
  admin: { email: "admin@local.test", displayName: "Admin (local)" },
  user: { email: "user@local.test", displayName: "Usuario (local)" },
};

const MOCK_IDENTITY_STORAGE_KEY = "mathtexpedia-mock-identity";

function isMockIdentity(value: unknown): value is MockIdentity {
  return value === "admin" || value === "user" || value === "anonymous";
}

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  isAdmin: boolean;
  email: string;
  displayName: string;
  identity: MockIdentity;
  setIdentity: (identity: MockIdentity) => void;
  login: (credentials: CredentialsDTO) => Promise<boolean>;
  loginWithGoogle: (idToken: any) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  isAdmin: false,
  email: '',
  displayName: '',
  identity: 'anonymous',
  setIdentity: () => {},
  login: async (_credentials: CredentialsDTO) => false,
  loginWithGoogle: async (_idToken: any) => false,
  logout: async () => {},
  checkAuth: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [identity, setIdentityState] = useState<MockIdentity>('anonymous');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(MOCK_IDENTITY_STORAGE_KEY);
      if (isMockIdentity(stored)) {
        setIdentityState(stored);
      }
    } catch (error) {
      console.error('No se pudo leer la identidad mockeada de localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const setIdentity = (next: MockIdentity) => {
    setIdentityState(next);
    try {
      localStorage.setItem(MOCK_IDENTITY_STORAGE_KEY, next);
    } catch (error) {
      console.error('No se pudo persistir la identidad mockeada en localStorage:', error);
    }
  };

  const isAuthenticated = identity !== 'anonymous';
  const isAdmin = identity === 'admin';
  const email = identity === 'anonymous' ? '' : MOCK_ACCOUNTS[identity].email;
  const displayName = identity === 'anonymous' ? '' : MOCK_ACCOUNTS[identity].displayName;

  const login = async (credentials: CredentialsDTO) => {
    if (
      !credentials.email ||
      !credentials.password ||
      credentials.email.trim() === '' ||
      credentials.password.trim() === ''
    ) {
      throw new Error('Email and password are required');
    }

    // Mock: cualquier credencial válida entra como usuario normal, salvo que el email
    // coincida con la cuenta admin de mentira.
    const normalizedEmail = credentials.email.trim().toLowerCase();
    setIdentity(normalizedEmail === MOCK_ACCOUNTS.admin.email ? 'admin' : 'user');
    return true;
  };

  const loginWithGoogle = async (_idToken: any) => {
    setIdentity('user');
    return true;
  };

  const logout = async () => {
    setIdentity('anonymous');
  };

  const checkAuth = async () => {
    // No-op: el mock no tiene sesión de servidor que revalidar.
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        isAdmin,
        email,
        displayName,
        identity,
        setIdentity,
        login,
        loginWithGoogle,
        logout,
        checkAuth,
      }}
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
