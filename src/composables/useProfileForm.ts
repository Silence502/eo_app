import type { Form, FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { computed, nextTick, ref, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "@/composables/useTheme";
import {
  UserProfileFormSchema,
  type UserProfileForm,
  type UserProfile,
} from "@/schemas/User";
import { useUserStore } from "@/stores/userStore";
import { updateProfile } from "@/api/auth";
import { useToast } from "primevue/usetoast";

export function useProfileForm(formRef: Ref<InstanceType<typeof Form> | null>) {
  const { t } = useI18n();
  const { isDark } = useTheme();
  const userStore = useUserStore();
  const toast = useToast();

  const isLoading = ref(false);
  const errorMessage = ref<string | null>(null);

  const resolver = zodResolver(UserProfileFormSchema);

  const initialValues = computed<Partial<UserProfileForm>>(() => ({
    email: userStore.profile?.email ?? "",
    firstName: userStore.profile?.firstName ?? "",
    lastName: userStore.profile?.lastName ?? "",
    phone: userStore.profile?.phone ?? null,
    address: userStore.profile?.address ?? null,
    business: userStore.profile?.business ?? null,
  }));

  async function onSubmit(event: FormSubmitEvent) {
    if (event.valid && event.values) {
      const values: UserProfile = {
        ...userStore.profile!,
        ...(event.values as UserProfileForm),
      };
      isLoading.value = true;
      errorMessage.value = null;
      try {
        await updateProfile(values);
        userStore.updateProfile(values);
        await nextTick();
        toast.add({
          severity: "success",
          summary: t("profile.updateSuccess"),
          detail: t("profile.updateSuccessDetail"),
          life: 3000,
        });
        resetForm();
      } catch (error) {
        errorMessage.value = (error as Error).message;
        toast.add({
          severity: "error",
          summary: t("profile.updateError"),
          detail: errorMessage.value,
          life: 3000,
        });
      } finally {
        isLoading.value = false;
      }
    }
  }

  async function resetForm() {
    (formRef.value as any)?.reset();
    errorMessage.value = null;
  }

  return {
    t,
    resolver,
    isDark,
    initialValues,
    isLoading,
    errorMessage,
    onSubmit,
    resetForm,
  };
}
