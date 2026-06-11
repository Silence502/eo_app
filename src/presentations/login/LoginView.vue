<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import LoginComponent from "./LoginComponent.vue";
import { login, getProfile } from "@/api/auth";
import type { Login } from "@/schemas/User";
import { Routes } from "@/router/routes";
import { useI18n } from 'vue-i18n'
import { useUserStore } from "@/stores/userStore";
const { t } = useI18n()

const router = useRouter();
const userStore = useUserStore();
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

async function handleLogin(values: Login) {
	isLoading.value = true;
	errorMessage.value = null;
	try {
		await login(values);
		userStore.setProfile(await getProfile());
		router.push(Routes.Dashboard);
	} catch {
		errorMessage.value = t("auth.invalidCredentials");
	} finally {
		isLoading.value = false;
	}
}
</script>

<template>
	<LoginComponent :loading="isLoading" :error-message="errorMessage" @submit="handleLogin" />
</template>

<style scoped></style>
