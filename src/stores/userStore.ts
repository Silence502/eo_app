import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { UserProfile } from "@/schemas/User";

type PublicProfile = Omit<UserProfile, "password" | "hashedRefreshToken">;

export const useUserStore = defineStore("user", () => {
  const profile = ref<PublicProfile | null>(null);

  const isAuthenticated = computed(() => profile.value !== null);
  const isAdmin = computed(() => profile.value?.role === "ADMIN");
  const fullName = computed(() =>
    profile.value ? `${profile.value.firstName} ${profile.value.lastName}` : "",
  );

  function setProfile(data: PublicProfile): void {
    profile.value = data;
  }

  function clearProfile(): void {
    profile.value = null;
  }

  function updateProfile(data: Partial<PublicProfile>): void {
    if (profile.value) {
      profile.value = { ...profile.value, ...data };
    }
  }

  return {
    profile,
    isAuthenticated,
    isAdmin,
    fullName,
    setProfile,
    clearProfile,
    updateProfile,
  };
});
