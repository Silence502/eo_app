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
import { updateProfile, uploadAvatar } from "@/api/auth";
import { useToast } from "primevue/usetoast";
import type { Address } from "@/schemas/User";

function toAddressForm(address: Address | null | undefined): Address {
  return {
    street: address?.street ?? null,
    otherStreet: address?.otherStreet ?? null,
    city: address?.city ?? null,
    state: address?.state ?? null,
    zip: address?.zip ?? null,
    country: address?.country ?? null,
  };
}

export function useProfileForm(
  formRef: Ref<InstanceType<typeof Form> | null>,
  avatarComponent: Ref<InstanceType<
    typeof import("@/components/blocks/AvatarFullBlock.vue").default
  > | null>,
) {
  const { t } = useI18n();
  const { isDark } = useTheme();
  const userStore = useUserStore();
  const toast = useToast();

  const isUploadingAvatar = ref(false);
  const isAvatarChanged = ref(false);
  const isLoading = ref(false);
  const errorMessage = ref<string | null>(null);
  const file = ref<File | null>(null);

  const resolver = zodResolver(UserProfileFormSchema);

  const initialValues = computed<Partial<UserProfileForm>>(() => ({
    email: userStore.profile?.email ?? "",
    firstName: userStore.profile?.firstName ?? "",
    lastName: userStore.profile?.lastName ?? "",
    phone: userStore.profile?.phone ?? null,
    avatarUrl: userStore.profile?.avatarUrl ?? null,
    address: toAddressForm(userStore.profile?.address),
    business: {
      name: userStore.profile?.business?.name ?? null,
      email: userStore.profile?.business?.email ?? null,
      phone: userStore.profile?.business?.phone ?? null,
      website: userStore.profile?.business?.website ?? null,
      vatNumber: userStore.profile?.business?.vatNumber ?? null,
      address: toAddressForm(userStore.profile?.business?.address),
    },
  }));

  async function onSubmit(event: FormSubmitEvent) {
    if (!event.valid || !event.values) {
      console.warn("Profile form is invalid, submission aborted.", event);
      errorMessage.value = t("profile.updateError");
      toast.add({
        severity: "error",
        summary: t("profile.updateError"),
        detail: t("validation.formInvalid"),
        life: 3000,
      });
      return;
    }

    const values: UserProfile = {
      ...userStore.profile!,
      ...(event.values as UserProfileForm),
    };
    isLoading.value = true;
    errorMessage.value = null;
    try {
      await updateProfile(values);
      if (file.value) {
        console.log("Uploading avatar...");
        isUploadingAvatar.value = true;
        const { avatarUrl } = await uploadAvatar(file.value);
        userStore.updateProfile({ avatarUrl });
        isAvatarChanged.value = false;
        file.value = null;
        values.avatarUrl = avatarUrl;
        isUploadingAvatar.value = false;
      }
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

  async function onAvatarChange(fileInput: File) {
    file.value = fileInput;
    isAvatarChanged.value = true;
    await nextTick();
  }

  async function resetForm() {
    (formRef.value as any)?.reset();
    errorMessage.value = null;
    isAvatarChanged.value = false;
    file.value = null;
    avatarComponent.value?.resetPreview();

    await nextTick();
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
    onAvatarChange,
    isUploadingAvatar,
    isAvatarChanged,
    avatarComponent,
  };
}
