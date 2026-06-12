import type { FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "@/composables/useTheme";
import {
  UserProfileFormSchema,
  type UserProfileForm,
  type UserProfile,
} from "@/schemas/User";
import { useUserStore } from "@/stores/userStore";

export function useProfileForm(
  emit: (event: "submit", values: UserProfile) => void,
) {
  const { t } = useI18n();
  const { isDark } = useTheme();
  const userStore = useUserStore();

  const resolver = zodResolver(UserProfileFormSchema);

  const initialValues = computed<Partial<UserProfileForm>>(() => ({
    email: userStore.profile?.email ?? "",
    firstName: userStore.profile?.firstName ?? "",
    lastName: userStore.profile?.lastName ?? "",
    phone: userStore.profile?.phone ?? null,
    address: userStore.profile?.address ?? null,
    business: userStore.profile?.business ?? null,
  }));

  function onSubmit(event: FormSubmitEvent) {
    if (event.valid && event.values) {
      const values: UserProfile = {
        ...userStore.profile!,
        ...(event.values as UserProfileForm),
      };
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
