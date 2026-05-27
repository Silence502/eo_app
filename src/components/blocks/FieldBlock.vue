<script setup lang="ts">
import { FormField } from "@primevue/forms";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Message from "primevue/message";
import Button from "primevue/button";

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const props = defineProps<{
	id: string;
	name: string;
	label: string;
	type?: string;
	placeholder?: string;
	info?: boolean;
	direction?: "right" | "left";
}>();
</script>

<template>
	<FormField v-slot="$field" :name="name">
		<div class="flex flex-col gap-1">
			<label :for="id">
				{{ label }}
			</label>
			<InputText v-if="type === 'text'" :id="id" :name="name" v-bind="$field" :type="type"
				:placeholder="placeholder" class="w-full" :invalid="$field.invalid" />
			<Password v-else-if="type === 'password'" :id="id" :name="name" v-bind="$field" :placeholder="placeholder"
				class="w-full" :invalid="$field.invalid" :feedback="false" toggle-mask fluid />
			<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
				{{ t($field.error?.message ?? '') }}
			</Message>
			<div v-if="info" class="flex items-center justify-start"
				:class="{ 'flex-row-reverse': direction === 'right' }">
				<Button :pt="{
					root: {
						style: 'font-size: var(--text-sm) /* 0.875rem = 14px */ !important; padding: 0 !important; margin: 0 !important;',
					}
				}" :label="t('auth.forgotPassword')" variant="link" />
			</div>
		</div>
	</FormField>
</template>

<style scoped></style>
