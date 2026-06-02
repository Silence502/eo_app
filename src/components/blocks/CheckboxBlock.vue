<script setup lang="ts">
import Checkbox from "primevue/checkbox";
import { FormField } from "@primevue/forms";
import Message from "primevue/message";
import Button from "primevue/button";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
	id: string;
	name: string;
	label: string;
	type?: string;
	textType?: "text" | "link";
	placeholder?: string;
	info?: boolean;
	infoText?: string;
	infoDirection?: "right" | "left";
}>();
</script>

<template>
	<FormField v-slot="$field" :name="name">
		<div class="flex flex-row gap-1">
			<Checkbox :id="id" :name="name" v-bind="$field" :binary="true" class="w-full" :invalid="!$field.value" />
			<label :for="id">
				{{ label }}
			</label>
		</div>
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
	</FormField>
</template>

<style scoped></style>