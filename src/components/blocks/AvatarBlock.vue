<script setup lang="ts">
import Avatar from 'primevue/avatar';
import { generateInitials } from '@/utils/initialsGenerator';

defineProps<{
	shape?: "square" | "circle" | "diamond";
	userFullname?: string;
}>();



</script>

<template>
	<Avatar :shape="shape" :label="generateInitials(userFullname || '')" :pt="{
		root: {
			style: 'min-width: 32px; height: 32px;'
		}
	}" />
</template>

<style scoped></style>