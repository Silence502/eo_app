<script setup lang="ts">
import { useRouter } from "vue-router";
import { logout } from "@/api/auth";

const router = useRouter();
</script>

<template>
	<div class="p-4">
		<h1 class="text-3xl font-bold mb-4">Tableau de bord</h1>
		<p>Bienvenue sur votre tableau de bord !</p>
	</div>

</template>

<style scoped></style>