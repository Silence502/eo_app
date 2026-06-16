import http, {
  getToken,
  setToken,
  setRefreshToken,
  clearSession,
  attemptRefresh,
} from "./http";
import type { Login, Register, User, UserProfile } from "@/schemas/User";

type PublicProfile = Omit<UserProfile, "password" | "hashedRefreshToken">;

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

export async function getProfile(): Promise<PublicProfile> {
  const { data } = await http.get<PublicProfile>("/v1.0/auth/profile");
  return data;
}

export async function updateProfile(
  values: Partial<PublicProfile>,
): Promise<PublicProfile> {
  const { data } = await http.patch<PublicProfile>(
    "/v1.0/auth/profile",
    values,
  );
  return data;
}

export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await http.post<{ avatarUrl: string }>(
    "/v1.0/auth/profile/avatar",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export { attemptRefresh as refreshToken };
