import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ApiError } from "../types/apiError";
import type { LoginRequest, MeResponse, RegisterRequest } from "../types/auth";
import {
  clearToken,
  getToken,
  login as loginService,
  me as meService,
  register as registerService,
  saveToken,
} from "../services/authService";

type AuthContextValue = {
  user: MeResponse | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const profile = await meService();
      setUser(profile);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.status === 401) {
        clearToken();
        setUser(null);
        return;
      }
      throw error;
    }
  }, []);

  useEffect(() => {
    async function hydrate() {
      try {
        await refreshUser();
      } finally {
        setLoading(false);
      }
    }

    hydrate();
  }, [refreshUser]);

  const handleLogin = useCallback(async (payload: LoginRequest) => {
    const response = await loginService(payload);
    saveToken(response.token);
    const profile = await meService();
    setUser(profile);
  }, []);

  const handleRegister = useCallback(async (payload: RegisterRequest) => {
    const response = await registerService(payload);
    saveToken(response.token);
    const profile = await meService();
    setUser(profile);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login: handleLogin,
      register: handleRegister,
      logout,
      refreshUser,
    }),
    [user, loading, handleLogin, handleRegister, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext deve ser usado dentro de <AuthProvider />");
  }

  return context;
}