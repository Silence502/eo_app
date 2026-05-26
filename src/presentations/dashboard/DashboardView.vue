<script setup lang="ts">
import { useRouter } from "vue-router";
import { logout } from "@/api/auth";

const router = useRouter();

async function handleLogout() {
	try {
		await logout();
	} catch {
		// L'API a échoué (ex. token expiré/absent) mais la session est déjà effacée
	} finally {
		router.push("/");
	}
}
</script>

<template>
	<div class="p-4">
		<h1 class="text-3xl font-bold mb-4">Tableau de bord</h1>
		<p>Bienvenue sur votre tableau de bord !</p>
		<button @click="handleLogout" class="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
			Déconnexion
		</button>
	</div>

</template>

<style scoped></style>