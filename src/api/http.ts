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

export function isTokenExpired(): boolean {
  const token = getToken();
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

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
  timeout: 10_000,
});

// Intercepteur de requête : injecte le token Bearer si présent
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// --- Gestion du refresh token ---
let isRefreshing = false;
type QueueItem = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};
let failedQueue: QueueItem[] = [];

function processQueue(error: unknown, token: string | null): void {
  failedQueue.forEach(item => {
    if (error) {
      item.reject(error);
    } else {
      item.resolve(token as string);
    }
  });
  failedQueue = [];
}

export async function attemptRefresh(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  // Appel direct (sans l'instance http) pour éviter une boucle d'intercepteurs
  const { data } = await axios.post<{
    accessToken: string;
    refreshToken?: string;
  }>(
    `${import.meta.env.VITE_API_BASE_URL}/v1.0/auth/refresh`,
    { refreshToken },
    { headers: { "Content-Type": "application/json" } },
  );

  setToken(data.accessToken);
  if (data.refreshToken) setRefreshToken(data.refreshToken);
  return data.accessToken;
}

// Intercepteur de réponse : tente un refresh sur 401 avant de rediriger
http.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;
    const is401 = status === 401;
    const is403Expired = status === 403 && isTokenExpired();

    if ((!is401 && !is403Expired) || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Mettre la requête en file d'attente pendant le refresh en cours
      return new Promise<AxiosResponse>((resolve, reject) => {
        failedQueue.push({
          resolve: token => {
            originalRequest.headers.set("Authorization", `Bearer ${token}`);
            resolve(http(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newToken = await attemptRefresh();
      processQueue(null, newToken);
      originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
      return http(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearSession();
      window.location.href = "/";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default http;
