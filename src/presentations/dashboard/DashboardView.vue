<script setup lang="ts">
import { useRouter } from "vue-router";
import DashboardTemplate from "@/components/templates/DashboardTemplate.vue";

const router = useRouter();
</script>

<template>
	<section class="flex flex-col items-center h-full">
		<DashboardTemplate>
			<template #left>
				<p>Dashboard left content</p>
			</template>
			<template #details>
				<p>Dashboard details content</p>
			</template>
		</DashboardTemplate>
	</section>
</template>

<style scoped></style>