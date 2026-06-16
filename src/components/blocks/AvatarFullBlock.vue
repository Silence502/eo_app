<script setup lang="ts">
import Avatar from 'primevue/avatar';
import { generateInitials } from '@/utils/initialsGenerator';
import { ref, watch } from 'vue';

const props = defineProps<{
	shape?: "square" | "circle" | "diamond";
	size?: "small" | "medium" | "large";
	isHeader?: boolean;
	user: {
		name: string;
		email: string;
		image?: string;
	};
	editable?: boolean;
	uploading?: boolean;
}>();

const emit = defineEmits<{
	avatarChange: [file: File];
}>();

watch(() => props.user, (newUser) => {
	previewImage.value = newUser.image;
});

function resetPreview() {
	previewImage.value = props.user.image;
	if (fileInput.value) {
		fileInput.value.value = '';
	}
}

defineExpose({
	resetPreview
});

const fileInput = ref<HTMLInputElement | null>(null);
const previewImage = ref<string | undefined>(props.user.image);

function openFilePicker() {
	fileInput.value?.click();
}

function onFileChange(event: Event) {
	const file = (event.target as HTMLInputElement).files?.[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = (e) => {
			previewImage.value = e.target?.result as string;
			emit('avatarChange', file);
		};
		reader.readAsDataURL(file);
	}
}
</script>

<template>
	<div v-if="!isHeader" class="flex items-center justify-center gap-2">
		<div class="relative" :class="{ 'cursor-pointer': editable && !uploading }"
			@click="editable && !uploading && openFilePicker()">
			<Avatar :shape="shape" :image="previewImage"
				:label="previewImage ? undefined : generateInitials(user.name || '')" :pt="{
					root: {
						style: size === 'small' ? 'min-width: 40px; height: 40px;' : size === 'medium' ? 'min-width: 60px; height: 60px; font-size: 1.5rem;' : 'min-width: 80px; height: 80px; font-size: 2rem;',
					}
				}" />
			<div v-if="editable"
				class="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity"
				:class="[shape === 'circle' ? 'rounded-full' : 'rounded', uploading ? 'opacity-100' : 'opacity-0 hover:opacity-100']">
				<i :class="uploading ? 'pi pi-spin pi-spinner' : 'pi pi-camera'" class="text-white text-xl"></i>
			</div>
		</div>
		<div class="flex flex-col items-start">
			<h2 class="text-xl text-left font-bold">{{ user.name }}</h2>
			<p class="text-sm text-gray-500 text-left">{{ user.email }}</p>
		</div>
		<input v-if="editable" ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
	</div>
	<div class="flex items-center justify-center gap-2" v-else>
		<Avatar :shape="shape" :image="user.image" :label="previewImage ? undefined : generateInitials(user.name || '')"
			:pt="{
				root: {
					style: 'min-width: 32px; height: 32px;'
				}
			}" />
		{{ user.name }}
	</div>
</template>

<style scoped></style>