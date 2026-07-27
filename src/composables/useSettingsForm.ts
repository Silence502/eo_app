import type { Form, FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { computed, nextTick, ref, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "@/composables/useTheme";
import { SettingsSchema, type UserSettings } from "@/schemas/Settings";
import { useUserStore } from "@/stores/userStore";
import { updateProfile, uploadAvatar } from "@/api/auth";
import { useToast } from "primevue/usetoast";

export function useSettingsForm(
  formRef: Ref<InstanceType<typeof Form> | null>,
) {
  const { t } = useI18n();
  const { isDark } = useTheme();
  const userStore = useUserStore();
  const toast = useToast();

  const isLoading = ref(false);
  const errorMessage = ref<string | null>(null);

  const resolver = zodResolver(SettingsSchema);

  const initialValues = computed<Partial<UserSettings>>(() => ({
    timezone: userStore.settings?.timezone ?? "",
    notificationsEmail: userStore.settings?.notificationsEmail ?? true,
    notificationsSms: userStore.settings?.notificationsSms ?? false,
  }));

  async function onSubmit(event: FormSubmitEvent) {
    if (!event.valid || !event.values) {
      errorMessage.value = t("settings.updateError");
      toast.add({
        severity: "error",
        summary: t("profile.updateError"),
        detail: t("validation.formInvalid"),
        life: 3000,
      });
      return;
    }

    await nextTick();
    toast.add({
      severity: "success",
      summary: t("settings.updateSuccess"),
      detail: t("settings.updateSuccessDetail"),
      life: 3000,
    });
  }

  async function resetForm() {
    (formRef.value as any)?.reset();
    errorMessage.value = null;

    await nextTick();
  }

  return {
    t,
    isDark,
    initialValues,
    resolver,
    isLoading,
    onSubmit,
    errorMessage,
    resetForm,
  };
}
