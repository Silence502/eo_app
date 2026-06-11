<script setup lang="ts">
import Avatar from 'primevue/avatar';
import { generateInitials } from '@/utils/initialsGenerator';

defineProps<{
	shape?: "square" | "circle" | "diamond";
	size?: "small" | "medium" | "large";
	user: {
		name: string;
		email: string;
	};
}>();



</script>

<template>
	<div class="flex items-center justify-center gap-2">
		<Avatar :shape="shape" :label="generateInitials(user.name || '')" :pt="{
			root: {
				style: size === 'small' ? 'min-width: 40px; height: 40px;' : size === 'medium' ? 'min-width: 60px; height: 60px; font-size: 1.5rem;' : 'min-width: 80px; height: 80px; font-size: 2rem;',
			}
		}" />
		<div class="flex flex-col items-start">
			<h2 class="text-xl text-left font-bold">{{ user.name }}</h2>
			<p class="text-sm text-gray-500 text-left">{{ user.email }}</p>
		</div>
	</div>
</template>

<style scoped></style>