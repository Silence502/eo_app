<script setup lang="ts">
import ThemeSwitcher from "@/components/blocks/ThemeSwitcher.vue";
import { useTheme } from "@/composables/useTheme";

const { isDark } = useTheme();
</script>

<template>
	<header class="h-[5vh] bg-white dark:bg-gray-800">
		<div class="w-full h-full flex items-center gap-2 px-4">
			<div>
				<img v-if="isDark" src="@/assets/svg/eo_logo_horizontal_dark.svg" alt="Logo" class="h-12">
				<img v-else src="@/assets/svg/eo_logo_horizontal_light.svg" alt="Logo" class="h-12">
			</div>
			<!-- <ThemeSwitcher /> -->
		</div>
	</header>
	<main class="default-layout">
		<slot />
	</main>
	<footer>Test footer</footer>
</template>

<style scoped></style>