<script setup lang="ts">
import { Form } from "@primevue/forms";
import type { FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import Button from "primevue/button";
import Message from "primevue/message";
import { LoginSchema, type Login } from "../../schemas/User";
import FieldBlock from "@/components/blocks/FieldBlock.vue";
import Divider from 'primevue/divider';
import { Routes } from "@/router/routes";
import LanguageSwitcher from "@/components/blocks/LanguageSwitcher.vue";
import ThemeSwitcher from "@/components/blocks/ThemeSwitcher.vue";
import { useTheme } from '@/composables/useTheme';

import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const { isDark } = useTheme();

withDefaults(
	defineProps<{
		loading?: boolean;
		errorMessage?: string | null;
	}>(),
	{ loading: false, errorMessage: null },
);

const emit = defineEmits<{
	submit: [values: Login];
}>();

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
</script>

<template>
	<Teleport to="#auth-layout-header">
		<div class="w-full h-full flex items-center justify-end gap-2 px-4">
			<ThemeSwitcher />
			<LanguageSwitcher />
		</div>
	</Teleport>
	<div class="login-card">
		<div class="w-80 h-fit">
			<img v-if="isDark" src="@/assets/svg/eo_logo_text_dark.svg" alt="Logo">
			<img v-else src="@/assets/svg/eo_logo_text_light.svg" alt="Logo">
		</div>
		<div class="login-card-content relative">
			<h2 class="mb-6">
				{{ t('auth.loginTitle') }}
			</h2>

			<Form :resolver="resolver" :initial-values="initialValues" class="flex flex-col gap-4" @submit="onSubmit">
				<!-- Email -->
				<FieldBlock id="email" name="email" :label="t('auth.email')" type="text"
					placeholder="exemple@email.com" />

				<!-- Mot de passe -->
				<FieldBlock id="password" name="password" :label="t('auth.password')" type="password"
					placeholder="••••••••" info direction="right" />

				<Message v-if="errorMessage" severity="error" class="w-full">
					{{ errorMessage }}
				</Message>

				<div class="flex flex-col gap-1">
					<Button type="submit" :label="t('auth.login')" class="w-full mt-2" :loading="loading"
						:disabled="loading" />
				</div>

				<Divider />

				<div class="text-center text-sm text-gray-600 dark:text-gray-400">
					{{ t('auth.noAccount') }}
					<router-link :to="Routes.Register" class="font-bold hover:underline">{{
						t('auth.register') }}</router-link>
				</div>

			</Form>
		</div>
	</div>
</template>

<style scoped></style>
