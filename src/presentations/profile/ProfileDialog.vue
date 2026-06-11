<script setup lang="ts">
import type { UserProfile } from "@/schemas/User";
import ProfileComponent from "./ProfileComponent.vue";
import { useI18n } from 'vue-i18n'
import { ref } from "vue";
import { updateProfile } from "@/api/auth";
import { useUserStore } from "@/stores/userStore";

const { t } = useI18n()
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const userStore = useUserStore();

const props = withDefaults(
	defineProps<{
		userStore: any;
		user: {
			name: string;
			email: string;
		};
	}>(),
	{
		userStore: null,
		user: () => ({
			name: 'John Doe',
			email: 'exemple@email.com',
		}),
	},
);

async function handleSubmit(values: UserProfile) {
	isLoading.value = true;
	errorMessage.value = null;
	try {
		await updateProfile(values);
		userStore.updateProfile(values);
	} catch (error) {
		errorMessage.value = (error as Error).message;
	} finally {
		isLoading.value = false;
	}
}

</script>

<template>
	<ProfileComponent :user-store="userStore" :user="user" :loading="isLoading" :error-message="errorMessage"
		@submit="handleSubmit" />
</template>

<style scoped></style>