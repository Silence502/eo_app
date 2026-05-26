<script setup lang="ts">
import { Form } from "@primevue/forms";
import type { FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import Button from "primevue/button";
import Message from "primevue/message";
import { LoginSchema, type Login } from "../../schemas/User";
import FieldBlock from "@/components/blocks/FieldBlock.vue";
import Divider from 'primevue/divider';

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

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
	<div class="flex items-center justify-center min-h-screen bg-surface-100 dark:bg-surface-900">
		<div class="w-full max-w-md p-8 bg-surface-0 dark:bg-surface-800 rounded-2xl shadow-lg">
			<h2 class="text-2xl font-bold text-center mb-6 text-surface-900 dark:text-surface-0">
				{{ t('auth.loginTitle') }}
			</h2>

			<Form :resolver="resolver" :initial-values="initialValues" class="flex flex-col gap-4" @submit="onSubmit">
				<!-- Email -->
				<FieldBlock id="email" name="email" label="Email" type="text" placeholder="exemple@email.com" />

				<!-- Mot de passe -->
				<FieldBlock id="password" name="password" label="Mot de passe" type="password" placeholder="••••••••"
					info />

				<Message v-if="errorMessage" severity="error" class="w-full">
					{{ errorMessage }}
				</Message>

				<div class="flex flex-col gap-1">
					<Button type="submit" :label="t('auth.login')" class="w-full mt-2" :loading="loading"
						:disabled="loading" />
				</div>

				<Divider />

				<Button severity="secondary">
					<router-link to="/register" class="w-full h-full">{{ t('auth.register') }}</router-link>
				</Button>

			</Form>
		</div>
	</div>
</template>

<style scoped></style>
