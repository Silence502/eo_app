import type { Form, FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { computed, nextTick, ref, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "@/composables/useTheme";
import { SettingsSchema, type UserSettings } from "@/schemas/Settings";
import { useUserStore } from "@/stores/userStore";
import { useToast } from "primevue/usetoast";
import { updateSettings } from "@/api/settingsApi";

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

    const values: UserSettings = {
      ...(event.values as UserSettings),
    };

    isLoading.value = true;
    errorMessage.value = null;

    try {
      await updateSettings(values as any);
      console.log("Settings updated successfully:", values);
      userStore.setSettings(values);
      await nextTick();
      toast.add({
        severity: "success",
        summary: t("settings.updateSuccess"),
        life: 3000,
      });
      resetForm();
    } catch (error) {
      console.error("Error updating settings:", error);
      errorMessage.value = t("settings.updateError");
      toast.add({
        severity: "error",
        summary: t("settings.updateError"),
        detail: t("validation.formInvalid"),
        life: 3000,
      });
    } finally {
      isLoading.value = false;
    }
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
