<script setup lang="ts">
import ProfileComponent from "./ProfileComponent.vue";
import { useI18n } from 'vue-i18n'
import { useUserStore } from "@/stores/userStore";
import { Toast } from "primevue";

const { t } = useI18n()
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

</script>

<template>
	<ProfileComponent :user-store="userStore" :user="user" />
	<Toast />
</template>

<style scoped></style>