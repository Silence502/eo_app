import { type Form, type FormField } from "@primevue/forms";
import { computed, type Ref } from "vue";

function checkDirty(obj: unknown): boolean {
  if (obj !== null && typeof obj === "object") {
    if ("dirty" in obj && (obj as { dirty: boolean }).dirty === true)
      return true;
    return Object.values(obj).some(checkDirty);
  }
  return false;
}

export function useFormDirty(formRef: Ref<InstanceType<typeof Form> | null>) {
  return computed(() => {
    const states = (formRef.value as any)?.states;
    if (!states) return false;
    return Object.values(states).some(checkDirty);
  });
}

export function useFieldDirty(
  formRef: Ref<InstanceType<typeof FormField> | null>,
) {
  return computed(() => {
    const field = (formRef.value as any)?.field?.states?.dirty;
    if (!field) return false;
    return field;
  });
}
