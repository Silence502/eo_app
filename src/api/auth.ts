import http, {
  getToken,
  setToken,
  setRefreshToken,
  clearSession,
  attemptRefresh,
} from "./http";
import type { Login, Register, User } from "@/schemas/User";

type PublicUser = Omit<User, "password" | "hashedRefreshToken">;

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: "bearer";
}

export async function login(credentials: Login): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>(
    "/v1.0/auth/login",
    credentials,
  );
  setToken(data.accessToken);
  setRefreshToken(data.refreshToken);
  return data;
}

export async function logout(): Promise<void> {
  try {
    if (getToken()) {
      await http.post("/v1.0/auth/logout");
    }
  } catch {
    // Erreur réseau ou token invalide : on déconnecte quand même côté client
  } finally {
    clearSession();
  }
}

export async function register(
  values: Omit<Register, "confirmPassword">,
): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>("/v1.0/auth/register", values);
  setToken(data.accessToken);
  setRefreshToken(data.refreshToken);
  return data;
}

export async function getProfile(): Promise<PublicUser> {
  const { data } = await http.get<PublicUser>("/v1.0/auth/profile");
  return data;
}

export { attemptRefresh as refreshToken };
