<script setup lang="ts">
import { FormField } from "@primevue/forms";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Select from "primevue/select";
import Message from "primevue/message";
import Button from "primevue/button";
import { ref, computed, watch, inject } from "vue";
import { useI18n } from 'vue-i18n';
import { useFieldDirty } from "@/utils/formDirty";
import Badge from 'primevue/badge';
import type { ZodObject, ZodTypeAny } from "zod";

const { t } = useI18n();

const props = withDefaults(
	defineProps<{
		id: string;
		name: string;
		label: string;
		type?: string;
		textType?: "text" | "link";
		placeholder?: string;
		info?: boolean;
		infoText?: string;
		infoDirection?: "right" | "left";
		disabled?: boolean;
		schema?: ZodObject<any>;
		badge?: boolean;
		optionsValue?: Array<{ label: string; value: any }>;
	}>(),
	{
		type: 'text',
		textType: 'link',
		info: false,
		infoDirection: 'right',
		disabled: false,
		badge: false,
		optionsValue: () => [],
	}
);

const fieldRef = ref<InstanceType<typeof FormField> | null>(null);
const isFieldDirty = useFieldDirty(fieldRef);

const emit = defineEmits<{
	(e: "isdirty", value: boolean): void
}>();

watch(isFieldDirty, (newValue) => {
	emit("isdirty", newValue);
});

const injectedSchema = inject<ZodObject<any> | null>('formSchema', null);

const isRequired = computed(() => {
	if (!injectedSchema) return false;

	try {
		const fieldSchema = injectedSchema.shape[props.name] as ZodTypeAny;
		if (!fieldSchema) return false;

		const acceptsUndefined = fieldSchema.safeParse(undefined).success;
		const acceptsNull = fieldSchema.safeParse(null).success;

		return !acceptsUndefined && !acceptsNull;
	} catch {
		return false;
	}
});

</script>

<template>
	<FormField ref="fieldRef" v-slot="$field" :name="name">
		<div class="flex flex-col gap-1">
			<label :for="id">
				{{ label }}
				<span v-if="isRequired" class="text-red-500 ml-1" aria-hidden="true">*</span>
				<Badge v-if="isFieldDirty && badge" severity="warn" class="ml-2 w-1" />
			</label>

			<InputText v-if="type === 'text'" :id="id" :name="name" v-bind="$field" :type="type"
				:placeholder="placeholder" class="w-full" :invalid="$field.invalid" :required="isRequired"
				:disabled="disabled" />

			<Password v-else-if="type === 'password'" :id="id" :name="name" v-bind="$field" :placeholder="placeholder"
				class="w-full" :invalid="$field.invalid" :feedback="false" toggle-mask fluid :required="isRequired"
				:disabled="disabled" />

			<Select v-else-if="type === 'select'" :id="id" :name="name" v-bind="$field" :options="optionsValue"
				:invalid="$field.invalid" :required="isRequired" :disabled="disabled" optionLabel="label"
				optionValue="value" />

			<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
				{{ t($field.error?.message ?? '') }}
			</Message>

			<div v-if="info" class="flex items-center justify-start"
				:class="{ 'flex-row-reverse': infoDirection === 'right' }">
				<Button v-if="textType === 'link'" :pt="{
					root: {
						style: 'font-size: var(--text-sm) /* 0.875rem = 14px */ !important; padding: 0 !important; margin: 0 !important;',
					}
				}" :label="infoText" variant="link" />
				<div v-else class="text-sm text-gray-400 flex items-center justify-start"
					:class="{ 'flex-row-reverse': infoDirection === 'right' }">
					{{ infoText }}
				</div>
			</div>
		</div>
	</FormField>
</template>

<style scoped></style>
