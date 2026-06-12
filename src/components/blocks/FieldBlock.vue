<script setup lang="ts">
import { FormField } from "@primevue/forms";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Message from "primevue/message";
import Button from "primevue/button";
import { ref, onMounted } from "vue";
import { useI18n } from 'vue-i18n';
import { useFieldDirty } from "@/utils/formDirty";
import Badge from 'primevue/badge';

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
	disabled?: boolean;
}>();

const fieldRef = ref<InstanceType<typeof FormField> | null>(null);
const isFieldDirty = useFieldDirty(fieldRef);

</script>

<template>
	<FormField ref="fieldRef" v-slot="$field" :name="name">
		<div class="flex flex-col gap-1">
			<label :for="id">
				{{ label }}
				<Badge v-if="isFieldDirty" severity="warn" class="ml-2 w-1" />
			</label>
			<InputText v-if="type === 'text'" :id="id" :name="name" v-bind="$field" :type="type"
				:placeholder="placeholder" class="w-full" :invalid="$field.invalid" :disabled="disabled" />
			<Password v-else-if="type === 'password'" :id="id" :name="name" v-bind="$field" :placeholder="placeholder"
				class="w-full" :invalid="$field.invalid" :feedback="false" toggle-mask fluid :disabled="disabled" />
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
