<script setup lang="ts">
import { Form } from "@primevue/forms";
import Button from "primevue/button";
import Message from "primevue/message";
import type { Register } from "../../schemas/User";
import FieldBlock from "@/components/blocks/FieldBlock.vue";
import CheckboxBlock from "@/components/blocks/CheckboxBlock.vue";
import Divider from 'primevue/divider';
import { Routes } from "@/router/routes";
import LanguageSwitcher from "@/components/blocks/LanguageSwitcher.vue";
import ThemeSwitcher from "@/components/blocks/ThemeSwitcher.vue";
import { useRegisterForm } from "@/composables/useRegisterForm";

withDefaults(
	defineProps<{
		loading?: boolean;
		errorMessage?: string | null;
	}>(),
	{ loading: false, errorMessage: null },
);

const emit = defineEmits<{
	submit: [values: Register];
}>();

const { t, isDark, resolver, initialValues, onSubmit } = useRegisterForm(emit);
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

				<!-- First Name -->
				<FieldBlock id="firstName" name="firstName" :label="t('auth.firstName')" type="text"
					placeholder="John" />

				<!-- Last Name -->
				<FieldBlock id="lastName" name="lastName" :label="t('auth.lastName')" type="text" placeholder="Doe" />

				<!-- Mot de passe -->
				<FieldBlock id="password" name="password" :label="t('auth.password')" type="password"
					placeholder="••••••••" />

				<!-- Confirmation mot de passe -->
				<FieldBlock id="confirmPassword" name="confirmPassword" :label="t('auth.confirmPassword')"
					type="password" placeholder="••••••••" />

				<!-- Conditions générales -->
				<CheckboxBlock id="termsAccepted" name="termsAccepted" :label="t('auth.acceptTerms')" info
					text-type="link" :info-text="t('auth.termsInfo')" />

				<Message v-if="errorMessage" severity="error" class="w-full">
					{{ errorMessage }}
				</Message>

				<div class="flex flex-col gap-1">
					<Button type="submit" :label="t('auth.register')" class="w-full mt-2" :loading="loading"
						:disabled="loading" />
				</div>

				<Divider />

				<div class="text-center text-sm text-gray-600 dark:text-gray-400">
					{{ t('auth.alreadyRegistered') }}
					<router-link :to="Routes.Login" class="font-bold hover:underline">{{
						t('auth.login') }}</router-link>
				</div>

			</Form>
		</div>
	</div>
</template>

<style scoped></style>
