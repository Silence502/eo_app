import axios from "axios";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function decodeTokenExpiry(token: string | null): boolean {
  if (!token) return true;
  try {
    const parts = token.split(".");
    const encoded = parts[1];
    if (!encoded) return true;
    const payload = JSON.parse(atob(encoded));
    return typeof payload.exp === "number" && payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function isTokenExpired(): boolean {
  return decodeTokenExpiry(getToken());
}

export function isRefreshTokenExpired(): boolean {
  return decodeTokenExpiry(getRefreshToken());
}

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
  timeout: 10_000,
});

// Intercepteur de requête : refresh proactif si l'accessToken est expiré, puis injection du token
http.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (isTokenExpired() && getRefreshToken()) {
      try {
        await getRefreshPromise();
      } catch {
        clearSession();
        window.location.href = "/login";
        return Promise.reject(new Error("Session expirée"));
      }
    }
    const token = getToken();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// --- Gestion du refresh token ---
// Une seule promesse partagée pour éviter les refreshs concurrents
let refreshPromise: Promise<string> | null = null;

function getRefreshPromise(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = attemptRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function attemptRefresh(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  // Le backend attend le refreshToken dans le header Authorization (Bearer)
  // Appel direct (sans l'instance http) pour éviter une boucle d'intercepteurs
  const { data } = await axios.post<{
    accessToken: string;
    refreshToken?: string;
  }>(`/v1.0/auth/refresh`, null, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  setToken(data.accessToken);
  if (data.refreshToken) setRefreshToken(data.refreshToken);
  return data.accessToken;
}

// Intercepteur de réponse : fallback sur 401 inattendu (ex. révocation côté serveur)
http.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      !getRefreshToken()
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await getRefreshPromise();
      const newToken = getToken()!;
      originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
      return http(originalRequest);
    } catch {
      clearSession();
      window.location.href = "/login";
      return Promise.reject(error);
    }
  },
);

export default http;
