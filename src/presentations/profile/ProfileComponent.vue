<script setup lang="ts">
import AvatarFullBlock from "@/components/blocks/AvatarFullBlock.vue";
import { Form } from "@primevue/forms";
import Button from "primevue/button";
import Message from "primevue/message";
import FieldBlock from "@/components/blocks/FieldBlock.vue";
import Divider from 'primevue/divider';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import { useProfileForm } from "@/composables/useProfileForm";
import { useFormDirty } from "@/utils/formDirty";
import { ref, onMounted } from "vue";
import Badge from 'primevue/badge';

const props = withDefaults(
	defineProps<{
		userStore: any;
		user: {
			name: string;
			email: string;
		};
	}>(),
	{
		userStore: null,
		user: () => ({
			name: 'John Doe',
			email: 'exemple@email.com',
		}),
	},
);

const formRef = ref<InstanceType<typeof Form> | null>(null);
const isDirty = useFormDirty(formRef);

const { t, isDark, resolver, initialValues, isLoading, errorMessage, onSubmit } = useProfileForm(formRef);

onMounted(() => {
	// console.log(formRef.value); // Debug initial form states
});
</script>

<template>
	<div class="flex flex-col items-center gap-4 p-4">
		<div class="w-full flex items-center justify-start">
			<AvatarFullBlock :user="user" shape="circle" size="large" />
		</div>

		<!-- {{ isDirty ? 'Formulaire modifié' : 'Formulaire non modifié' }} -->

		<Tabs value="profile" class="w-full">
			<TabList>
				<Tab value="profile">Utilisateur</Tab>
				<Tab value="business">Entreprise</Tab>
			</TabList>

			<TabPanels>
				<!-- PROFILE TAB -->
				<Form ref="formRef" :resolver="resolver" :initial-values="initialValues" @submit="onSubmit"
					v-slot="$form">
					<TabPanel value="profile">
						<div class="w-full flex flex-col gap-4">
							<div class="grid grid-cols-2 gap-4 w-full">
								<FieldBlock id="firstName" name="firstName" label="Prénom" type="text" />
								<FieldBlock id="lastName" name="lastName" label="Nom" type="text" />
							</div>
							<div class="grid grid-cols-2 gap-4 w-full">
								<FieldBlock id="email" name="email" label="Email" type="text" />
								<FieldBlock id="phone" name="phone" label="Téléphone" type="text" />
							</div>
							<Divider />
							<FieldBlock id="address.street" name="address.street" label="Adresse" type="text" />
							<FieldBlock id="address.otherStreet" name="address.otherStreet" label="Complément d'adresse"
								type="text" />
							<div class="grid grid-cols-2 gap-4 w-full">
								<FieldBlock id="address.city" name="address.city" label="Ville" type="text" />
								<FieldBlock id="address.zip" name="address.zip" label="Code postal" type="text" />
								<FieldBlock id="address.state" name="address.state" label="Province / Région / État"
									type="text" />
								<FieldBlock id="address.country" name="address.country" label="Pays" type="text" />

							</div>
						</div>
					</TabPanel>

					<!-- BUSINESS TAB -->
					<TabPanel value="business">
						<div class="w-full flex flex-col gap-4">
							<FieldBlock id="business.name" name="business.name" label="Nom de l'entreprise"
								type="text" />
							<div class="grid grid-cols-2 gap-4 w-full">
								<FieldBlock id="business.email" name="business.email" label="Email de l'entreprise"
									type="text" />
								<FieldBlock id="business.phone" name="business.phone" label="Téléphone" type="text" />
							</div>

							<div class="grid grid-cols-2 gap-4 w-full">
								<!-- <FieldBlock id="business.siret" name="business.siret" label="SIRET" type="text" /> -->
								<FieldBlock id="business.vatNumber" name="business.vatNumber"
									label="TVA intracommunautaire" type="text" />
								<FieldBlock id="business.website" name="business.website" label="Site web"
									type="text" />
							</div>
							<Divider />
							<FieldBlock id="business.address.street" name="business.address.street" label="Adresse"
								type="text" />
							<FieldBlock id="business.address.otherStreet" name="business.address.otherStreet"
								label="Complément d'adresse" type="text" />
							<div class="grid grid-cols-2 gap-4 w-full">
								<FieldBlock id="business.address.city" name="business.address.city" label="Ville"
									type="text" />
								<FieldBlock id="business.address.zip" name="business.address.zip" label="Code postal"
									type="text" />
								<FieldBlock id="business.address.state" name="business.address.state"
									label="Province / Région / État" type="text" />
								<FieldBlock id="business.address.country" name="business.address.country" label="Pays"
									type="text" />
							</div>
						</div>
					</TabPanel>
					<!-- <Divider /> -->
					<div class="flex flex-col gap-4 w-full mt-4">
						<Message v-if="errorMessage" severity="error" class="w-full">
							{{ errorMessage }}
						</Message>
						<div class="flex flex-row justify-between gap-4">
							<div class="flex flex-row justify-start gap-4">
								<Message v-if="isDirty" severity="warn" variant="outlined">En cours de modification
								</Message>
							</div>
							<div class="flex flex-row justify-end gap-4">
								<Button type="button" severity="secondary" label="Annuler" class="w-fit"
									:loading="isLoading" :disabled="isLoading" @click="$form.reset()" />
								<Button type="submit" label="Enregistrer" class="w-fit" :loading="isLoading"
									:disabled="isLoading" />
							</div>
						</div>
					</div>
				</Form>
			</TabPanels>
		</Tabs>
	</div>
</template>

<style scoped></style>