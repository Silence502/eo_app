import type { FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { useI18n } from "vue-i18n";
import { LoginSchema, type Login } from "@/schemas/User";
import { useTheme } from "@/composables/useTheme";

export function useLoginForm(emit: (event: "submit", values: Login) => void) {
  const { t } = useI18n();
  const { isDark } = useTheme();

  const resolver = zodResolver(LoginSchema);

  const initialValues: Login = {
    email: "",
    password: "",
  };

  function onSubmit(event: FormSubmitEvent) {
    if (event.valid) {
      emit("submit", event.values as Login);
    }
  }

  return { t, isDark, resolver, initialValues, onSubmit };
}
