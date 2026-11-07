/**
 * Klien REST API KONSERVIBE.
 *
 * Semua halaman memakai helper ini agar:
 * - base URL konsisten (NEXT_PUBLIC_API_URL, default http://localhost:5000/api)
 * - token JWT otomatis dikirim sebagai Bearer
 * - access token otomatis di-refresh sekali ketika menerima 401
 * - bentuk respons backend `{ success, message, data }` dinormalisasi
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api";

const ACCESS_TOKEN_KEY = "konservibe.access-token";
const REFRESH_TOKEN_KEY = "konservibe.refresh-token";

export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export const tokenStore = {
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setTokens(accessToken: string, refreshToken?: string | null) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },
  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
  /** Jangan sertakan Authorization walaupun token tersedia. */
  anonymous?: boolean;
};

async function parsePayload(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStore.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    const payload = (await parsePayload(response)) as ApiEnvelope<{
      accessToken?: string;
    }> | null;

    if (!response.ok || !payload?.success || !payload.data?.accessToken) {
      return null;
    }
    tokenStore.setTokens(payload.data.accessToken);
    return payload.data.accessToken;
  } catch {
    return null;
  }
}

async function performRequest<T>(
  path: string,
  options: RequestOptions,
  allowRefresh = true,
): Promise<T> {
  const { method = "GET", body, headers: extraHeaders, signal, anonymous } = options;

  const headers = new Headers(extraHeaders);
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (body !== undefined && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (!anonymous) {
    const accessToken = tokenStore.getAccessToken();
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body:
        body === undefined
          ? undefined
          : isFormData
            ? (body as FormData)
            : JSON.stringify(body),
      signal,
      cache: "no-store",
    });
  } catch (error) {
    throw new ApiError(
      "Tidak dapat terhubung ke server. Pastikan backend berjalan.",
      0,
      error,
    );
  }

  if (response.status === 401 && allowRefresh && !anonymous) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return performRequest<T>(path, options, false);
    }
    tokenStore.clear();
  }

  const payload = (await parsePayload(response)) as ApiEnvelope<T> | string | null;

  if (!response.ok) {
    const message =
      (typeof payload === "object" && payload && "message" in payload
        ? (payload as ApiEnvelope<T>).message
        : null) || `Permintaan gagal (${response.status})`;
    throw new ApiError(message, response.status, payload);
  }

  if (payload && typeof payload === "object" && "success" in payload) {
    const envelope = payload as ApiEnvelope<T>;
    if (!envelope.success) {
      throw new ApiError(envelope.message || "Permintaan gagal", response.status, payload);
    }
    return envelope.data as T;
  }

  return payload as T;
}

export const api = {
  get<T>(path: string, options: Omit<RequestOptions, "method" | "body"> = {}) {
    return performRequest<T>(path, { ...options, method: "GET" });
  },
  post<T>(path: string, body?: unknown, options: Omit<RequestOptions, "method" | "body"> = {}) {
    return performRequest<T>(path, { ...options, method: "POST", body });
  },
  put<T>(path: string, body?: unknown, options: Omit<RequestOptions, "method" | "body"> = {}) {
    return performRequest<T>(path, { ...options, method: "PUT", body });
  },
  patch<T>(path: string, body?: unknown, options: Omit<RequestOptions, "method" | "body"> = {}) {
    return performRequest<T>(path, { ...options, method: "PATCH", body });
  },
  delete<T>(path: string, options: Omit<RequestOptions, "method" | "body"> = {}) {
    return performRequest<T>(path, { ...options, method: "DELETE" });
  },
};

/* ------------------------------------------------------------------ */
/* Tipe umum                                                           */
/* ------------------------------------------------------------------ */

export type UserRole = "customer" | "event_organizer" | "super_admin";

export type OrganizerProfile = {
  company_name: string;
  address: string;
  category: string;
  instagram: string;
  website: string;
  npwp: string;
  bank_name: string;
  bank_account: string;
  account_name: string;
  bio: string;
  verification_status: string;
  documents_count: number;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  profile_picture: string;
  is_verified: boolean;
  status: string;
  city: string;
  bio: string;
  favorite_genre: string;
  member_tier: string;
  member_since: string;
  initials: string;
  organizer_profile: OrganizerProfile | null;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type PublicEvent = {
  id: string;
  title: string;
  description: string;
  venue: string;
  location: string;
  city: string;
  date: string;
  start_time: string;
  end_time: string;
  poster_url: string | null;
  banner_url: string | null;
  category_name: string;
  organizer_name: string;
  min_price: number | string | null;
};

export const ROLE_HOME: Record<UserRole, string> = {
  customer: "/dashboard",
  event_organizer: "/organizer",
  super_admin: "/superadmin",
};

export function formatRupiah(value: number | string | null | undefined): string {
  const number = Number(value ?? 0);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(number) ? number : 0);
}

export function formatNumber(value: number | string | null | undefined): string {
  const number = Number(value ?? 0);
  return new Intl.NumberFormat("id-ID").format(Number.isFinite(number) ? number : 0);
}

export function formatDateID(value: string | null | undefined): string {
  if (!value) return "-";
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
