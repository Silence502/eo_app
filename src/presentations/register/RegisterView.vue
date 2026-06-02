<script setup lang="ts">
import RegisterComponent from './RegisterComponent.vue';
import { Routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { register } from "@/api/auth";
import { ref } from "vue";
import { useI18n } from 'vue-i18n'
import type { Register } from "@/schemas/User";

const { t } = useI18n()
const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

async function handleRegister(values: Register) {
	isLoading.value = true;
	errorMessage.value = null;
	try {
		await register(values);
		router.push(Routes.Login);
	} catch {
		errorMessage.value = t("auth.invalidCredentials");
	} finally {
		isLoading.value = false;
	}
}
</script>

<template>
	<RegisterComponent :loading="isLoading" :error-message="errorMessage" @submit="handleRegister" />
</template>

<style scoped></style>