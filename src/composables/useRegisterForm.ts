import type { FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { useI18n } from "vue-i18n";
import { RegisterSchema, type Register } from "@/schemas/User";
import { useTheme } from "@/composables/useTheme";

export function useRegisterForm(
  emit: (event: "submit", values: Register) => void,
) {
  const { t } = useI18n();
  const { isDark } = useTheme();

  const resolver = zodResolver(RegisterSchema);

  const initialValues: Register = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    termsAccepted: false,
    privacyAccepted: false,
    marketingAccepted: false,
    consentVersion: "",
    language: "",
    timezone: "",
    theme: "system",
    receiveNotifications: true,
    receiveReminders: true,
  };

  function onSubmit(event: FormSubmitEvent) {
    if (event.valid && event.values) {
      const values = event.values as Register;
      if (values.termsAccepted) {
        values.privacyAccepted = true;
        values.marketingAccepted = true;
        values.consentVersion = "1.0";
      }
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
