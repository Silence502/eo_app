<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useUserStore } from "@/stores/userStore";
import { Toast } from "primevue";
import SettingsComponent from './SettingsComponent.vue';

const { t } = useI18n()
const userStore = useUserStore();
</script>

<template>
	<SettingsComponent :user-store="userStore" />
	<Toast />
</template>

<style scoped></style>