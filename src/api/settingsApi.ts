import http, {
  getToken,
  setToken,
  setRefreshToken,
  clearSession,
  attemptRefresh,
} from "./http";
import type { Login, Register, User, UserProfile } from "@/schemas/User";

export async function getSettings(): Promise<UserProfile> {
  return http
    .get<UserProfile>("/v1.0/settings")
    .then(response => response.data);
}

export async function updateSettings(
  values: Partial<UserProfile>,
): Promise<UserProfile> {
  const { data } = await http.patch<UserProfile>("/v1.0/settings", values);
  return data;
}
