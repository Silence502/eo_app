import type { Form, FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { computed, nextTick, ref, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "@/composables/useTheme";
import { SettingsSchema } from "@/schemas/Settings";
import { useUserStore } from "@/stores/userStore";
import { updateProfile, uploadAvatar } from "@/api/auth";
import { useToast } from "primevue/usetoast";

export function useProfileForm(formRef: Ref<InstanceType<typeof Form> | null>) {
  const { t } = useI18n();
  const { isDark } = useTheme();
  const userStore = useUserStore();
  const toast = useToast();

  const isLoading = ref(false);
  const errorMessage = ref<string | null>(null);

  const resolver = zodResolver(SettingsSchema);

  const initialValues = computed(() => ({
    theme: userStore.settings?.theme ?? "light",
    language: userStore.settings?.language ?? "en",
    timezone: userStore.settings?.timezone ?? "",
    notifications: userStore.settings?.notifications ?? {
      email: true,
      sms: false,
    },
  }));
}
