<script setup lang="ts">
import { useRouter } from "vue-router";
import DashboardTemplate from "@/components/templates/DashboardTemplate.vue";
import DashboardComponent from "./DashboardComponent.vue";

const router = useRouter();
</script>

<template>
	<section class="flex flex-col items-center h-full">
		<DashboardComponent />
	</section>
</template>

<style scoped></style>