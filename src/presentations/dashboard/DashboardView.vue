<script setup lang="ts">
import { useRouter } from "vue-router";
import DashboardTemplate from "@/components/templates/DashboardTemplate.vue";

const router = useRouter();
</script>

<template>
	<section class="px-80 h-full">
		<DashboardTemplate>
			<template #right>
				<p>Dashboard right content</p>
			</template>
			<template #details>
				<p>Dashboard details content</p>
			</template>
		</DashboardTemplate>
	</section>
</template>

<style scoped></style>