<script setup lang="ts">
import DashboardTemplate from "@/components/templates/DashboardTemplate.vue";
</script>

<template>
	<DashboardTemplate>
		<template #left>
			<p>Dashboard left content</p>
		</template>
		<template #details>
			<p>Dashboard details content</p>
		</template>
	</DashboardTemplate>
</template>

<style scoped></style>