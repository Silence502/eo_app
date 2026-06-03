import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "@/schemas/User";

type PublicUser = Omit<User, "password" | "hashedRefreshToken">;

export const useUserStore = defineStore("user", () => {
  const user = ref<PublicUser | null>(null);

  const isAuthenticated = computed(() => user.value !== null);
  const isAdmin = computed(() => user.value?.role === "admin");
  const fullName = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : "",
  );

  function setUser(data: PublicUser): void {
    user.value = data;
  }

  function clearUser(): void {
    user.value = null;
  }

  return { user, isAuthenticated, isAdmin, fullName, setUser, clearUser };
});
