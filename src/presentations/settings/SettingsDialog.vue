<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useUserStore } from "@/stores/userStore";
import { Toast } from "primevue";

const { t } = useI18n()
const userStore = useUserStore();
</script>

<template>
	<div>Test</div>
</template>

<style scoped></style>