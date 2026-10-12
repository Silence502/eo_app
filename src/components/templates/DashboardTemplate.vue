<script setup lang="ts">
import Panel from 'primevue/panel';
</script>

<template>
	<div class="dashboard">
		<!-- TODO: Boucler sur le nombre d'events et afficher un panel par event -->
		<Panel class="dashboard_left">
			<template #header>
				<h2>Mes événements (3)</h2>
			</template>
			<slot name="left"></slot>
		</Panel>

		<!-- TODO: Afficher le détail de l'event sélectionné dans un panel à droite -->
		<Panel class="dashboard_details">
			<template #header>
				<h2>Détails de l'événement</h2>
			</template>
			<slot name="details"></slot>
		</Panel>
	</div>
</template>

<style scoped></style>