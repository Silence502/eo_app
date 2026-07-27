<script setup lang="ts">
import { Form, FormField } from "@primevue/forms";
import Button from "primevue/button";
import Message from "primevue/message";
import Divider from 'primevue/divider';
import Select from 'primevue/select';
import { useSettingsForm } from "@/composables/useSettingsForm";
import { useFormDirty } from "@/utils/formDirty";
import { ref, onMounted, computed, provide } from "vue";
import { UserProfileFormSchema } from "@/schemas/User";
import LanguageSwitcher from "@/components/blocks/LanguageSwitcher.vue";
import ThemeSwitcher from "@/components/blocks/ThemeSwitcher.vue";
import CheckboxBlock from "@/components/blocks/CheckboxBlock.vue";
import { useI18n } from 'vue-i18n';
import FieldBlock from "@/components/blocks/FieldBlock.vue";

const { t } = useI18n();

const props = withDefaults(
	defineProps<{
		userStore: any;
	}>(),
	{
		userStore: null,
	},
);

const formRef = ref<InstanceType<typeof Form> | null>(null);
const isDirty = useFormDirty(formRef);
const isSettingsFieldDirty = ref(false);

const {
	resolver,
	initialValues,
	isLoading,
	errorMessage,
	onSubmit,
	resetForm,
} = useSettingsForm(formRef);

const timezones = computed(() => {
	const timezones = Intl.supportedValuesOf('timeZone');
	return timezones.map((tz) => ({ label: tz, value: tz }));
});

provide('formSchema', UserProfileFormSchema);
</script>

<template>
	<div class="w-full flex items-center justify-end gap-2">
		<ThemeSwitcher />
		<LanguageSwitcher />
	</div>

	<Divider />

	<Form ref="formRef" :resolver="resolver" :initial-values="initialValues" @submit="onSubmit" v-slot="$form">
		<div class="w-full flex flex-col gap-4">


			<div class="grid grid-cols-2 gap-4 w-full">
				<FieldBlock id="timezone" name="timezone" :label="t('settings.timezone')" type="select"
					:options-value="timezones" badge />
			</div>

			<div class="flex flex-col gap-2">
				<CheckboxBlock id="notificationsEmail" name="notificationsEmail"
					:label="t('settings.notifications_email')" infoDirection="right" badge />

				<CheckboxBlock id="notificationsSms" name="notificationsSms" :label="t('settings.notifications_sms')"
					infoDirection="right" badge />
			</div>

			<Divider />
		</div>

		<!-- <Divider /> -->
		<div class="flex flex-col gap-4 w-full mt-4">
			<Message v-if="errorMessage" severity="error" class="w-full">
				{{ errorMessage }}
			</Message>
			<div class="flex flex-row justify-between gap-4">
				<div class="flex flex-row justify-start gap-4">
					<Message v-if="isDirty" severity="warn" variant="outlined">
						{{ $t('common.inProgress') }}
					</Message>
				</div>
				<div class="flex flex-row justify-end gap-4">
					<Button type="button" severity="secondary" :label="$t('common.cancel')" class="w-fit"
						:loading="isLoading" :disabled="isLoading || (!isDirty)" @click="resetForm" />
					<Button type="submit" :label="$t('common.save')" class="w-fit" :loading="isLoading"
						:disabled="isLoading || !$form.valid || (!isDirty)" />
				</div>
			</div>
		</div>
	</Form>
</template>

<style scoped></style>