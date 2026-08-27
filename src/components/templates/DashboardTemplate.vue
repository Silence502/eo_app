<script setup lang="ts">
import Panel from 'primevue/panel';
</script>

<template>
	<div class="dashboard">
		<!-- TODO: Boucler sur le nombre d'events et afficher un panel par event -->
		<Panel class="dashboard_left" header="Dashboard left">
			<slot name="left"></slot>
		</Panel>

		<!-- TODO: Afficher le détail de l'event sélectionné dans un panel à droite -->
		<Panel class="dashboard_details" header="Dashboard Details">
			<slot name="details"></slot>
		</Panel>
	</div>
</template>

<style scoped></style>