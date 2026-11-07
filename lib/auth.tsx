"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  api,
  tokenStore,
  ROLE_HOME,
  type AuthUser,
  type LoginResponse,
  type UserRole,
} from "./api";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (payload: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
  setUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!tokenStore.getAccessToken()) {
      setUser(null);
      return null;
    }
    try {
      const me = await api.get<AuthUser>("/auth/me");
      setUser(me);
      return me;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!tokenStore.getAccessToken()) {
        if (active) setLoading(false);
        return;
      }
      try {
        const me = await api.get<AuthUser>("/auth/me");
        if (active) setUser(me);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post<LoginResponse>(
      "/auth/login",
      { email: email.trim(), password },
      { anonymous: true },
    );
    tokenStore.setTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(
    async (payload: { name: string; email: string; phone?: string; password: string }) => {
      await api.post(
        "/auth/register",
        {
          name: payload.name.trim(),
          email: payload.email.trim(),
          phone: payload.phone?.trim() || undefined,
          password: payload.password,
        },
        { anonymous: true },
      );
    },
    [],
  );

  const logout = useCallback(async () => {
    const refreshToken = tokenStore.getRefreshToken();
    try {
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch {
      // Tetap bersihkan sesi lokal meskipun backend tidak merespons.
    } finally {
      tokenStore.clear();
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
      setUser,
    }),
    [user, loading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  }
  return context;
}

/**
 * Menjaga halaman agar hanya bisa diakses role tertentu.
 * - belum login  -> /login
 * - role salah   -> halaman utama role tersebut
 */
export function RoleGuard({
  roles,
  children,
}: {
  roles: UserRole[];
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      const target = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${target}`);
      return;
    }
    if (!roles.includes(user.role)) {
      router.replace(ROLE_HOME[user.role] ?? "/");
    }
  }, [loading, pathname, roles, router, user]);

  if (loading) {
    return <GuardFallback />;
  }

  if (!user || !roles.includes(user.role)) {
    return <GuardFallback />;
  }

  return <>{children}</>;
}

function GuardFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#121422] px-5 py-4 text-sm text-slate-400">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
        Memeriksa sesi...
      </div>
    </div>
  );
}
