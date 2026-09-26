"use client"

import { createContext, useContext, useCallback, PropsWithChildren } from 'react';
import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react';

type LoginOptions = {
  // URL a la que volver tras autenticarse
  redirectTo?: string;
  // Alias del Identity Provider configurado en Keycloak (p. ej. 'google')
  idpHint?: string;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  loading: boolean;
  isAdmin: boolean;
  email: string;
  accessToken?: string;
  login: (options?: LoginOptions) => Promise<void>;
  register: (options?: Pick<LoginOptions, 'redirectTo'>) => Promise<void>;
  changePassword: (options?: Pick<LoginOptions, 'redirectTo'>) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const AuthStateProvider = ({ children }: PropsWithChildren) => {
  const { data: session, status, update } = useSession();

  // Si Keycloak rechazó el refresh token la sesión ya no es válida
  const isAuthenticated = status === 'authenticated' && !session?.error;
  const accessToken = isAuthenticated ? session?.accessToken : undefined;

  const login = async ({ redirectTo = '/dashboard', idpHint }: LoginOptions = {}) => {
    await signIn('keycloak', { redirectTo }, idpHint ? { kc_idp_hint: idpHint } : undefined);
  };

  // Provider que abre directamente el formulario de registro de Keycloak (ver auth.ts)
  const register = async ({ redirectTo = '/dashboard' }: Pick<LoginOptions, 'redirectTo'> = {}) => {
    await signIn('keycloak-register', { redirectTo });
  };

  // Application Initiated Action: Keycloak muestra el formulario de cambio de
  // contraseña y vuelve a la app al terminar
  const changePassword = async ({ redirectTo = '/dashboard/profile' }: Pick<LoginOptions, 'redirectTo'> = {}) => {
    await signIn('keycloak', { redirectTo }, { kc_action: 'UPDATE_PASSWORD' });
  };

  const logout = async () => {
    await signOut({ redirect: false });
  };

  const checkAuth = async () => {
    await update();
  };

  // fetch que envía el JWT de Keycloak como 'Authorization: Bearer' al backend
  const authFetch = useCallback(
    async (input: RequestInfo | URL, init: RequestInit = {}) => {
      const withToken = (token?: string) => {
        const headers = new Headers(init.headers);
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        return fetch(input, { ...init, headers });
      };

      const response = await withToken(accessToken);
      if (response.status !== 401 || !accessToken) {
        return response;
      }

      // El token del cliente puede haber caducado: pedir la sesión otra vez hace
      // que el servidor lo renueve con el refresh token, y se reintenta una vez
      const refreshed = await update();
      if (!refreshed?.accessToken || refreshed.error || refreshed.accessToken === accessToken) {
        return response;
      }
      return withToken(refreshed.accessToken);
    },
    [accessToken, update]
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading: status === 'loading',
        isAdmin: isAuthenticated && (session?.isAdmin ?? false),
        email: isAuthenticated ? session?.user?.email ?? '' : '',
        accessToken,
        login,
        register,
        changePassword,
        logout,
        checkAuth,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }: PropsWithChildren) => (
  // Refrescar la sesión periódicamente para que el access token no caduque en el cliente
  <SessionProvider refetchInterval={4 * 60} refetchOnWindowFocus>
    <AuthStateProvider>{children}</AuthStateProvider>
  </SessionProvider>
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
