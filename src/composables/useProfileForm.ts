import type { FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "@/composables/useTheme";
import { UserProfileSchema, type UserProfile } from "@/schemas/User";
import { useUserStore } from "@/stores/userStore";

export function useProfileForm(
  emit: (event: "submit", values: UserProfile) => void,
) {
  const { t } = useI18n();
  const { isDark } = useTheme();
  const userStore = useUserStore();

  const resolver = zodResolver(UserProfileSchema);

  const initialValues = computed<Partial<UserProfile>>(() => ({
    id: 0,
    email: userStore.profile?.email ?? "",
    firstName: userStore.profile?.firstName ?? "",
    lastName: userStore.profile?.lastName ?? "",
    role: userStore.profile?.role ?? "USER",
    plan: userStore.profile?.plan ?? "free",
    address: userStore.profile?.address ?? null,
    business: userStore.profile?.business ?? null,
    createdAt: userStore.profile?.createdAt,
    updatedAt: userStore.profile?.updatedAt,
  }));

  function onSubmit(event: FormSubmitEvent) {
    if (event.valid && event.values) {
      const values = event.values as UserProfile;
      emit("submit", values);
    }
  }

  return {
    t,
    resolver,
    isDark,
    initialValues,
    onSubmit,
  };
}
