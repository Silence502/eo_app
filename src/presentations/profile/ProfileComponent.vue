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
import { ref, onMounted, computed } from "vue";
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
const isUserFieldDirty = ref(false);
const isBusinessFieldDirty = ref(false);

const { t, isDark, resolver, initialValues, isLoading, errorMessage, onSubmit, resetForm } = useProfileForm(formRef);

function handleUserFieldDirty(value: boolean) {
	isUserFieldDirty.value = value;
}

function handleBusinessFieldDirty(value: boolean) {
	isBusinessFieldDirty.value = value;
}

onMounted(() => {
	// console.log(formRef.value); // Debug initial form states
	// console.log("Initial isUserFieldDirty:", isUserFieldDirty.value); // Debug initial user field dirty state
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
				<Tab value="profile">
					<div class="flex items-center gap-2">
						<i class="pi pi-user"></i>
						<span>Utilisateur</span>
					</div>

					<Badge v-if="isUserFieldDirty" severity="warn" class="ml-2 w-1 absolute top-2 right-2" />
				</Tab>
				<Tab value="business">
					<div class="flex items-center gap-2">
						<i class="pi pi-building"></i>
						<span>Entreprise</span>
					</div>
					<Badge v-if="isBusinessFieldDirty" severity="warn" class="ml-2 w-1 absolute top-2 right-2" />
				</Tab>
			</TabList>

			<TabPanels>
				<!-- PROFILE TAB -->
				<Form ref="formRef" :resolver="resolver" :initial-values="initialValues" @submit="onSubmit"
					v-slot="$form">
					<TabPanel value="profile">
						<div class="w-full flex flex-col gap-4">
							<div class="grid grid-cols-2 gap-4 w-full">
								<FieldBlock @isdirty="handleUserFieldDirty" id="firstName" name="firstName"
									label="Prénom" type="text" />
								<FieldBlock @isdirty="handleUserFieldDirty" id="lastName" name="lastName" label="Nom"
									type="text" />
							</div>
							<div class="grid grid-cols-2 gap-4 w-full">
								<FieldBlock @isdirty="handleUserFieldDirty" id="email" name="email" label="Email"
									type="text" />
								<FieldBlock @isdirty="handleUserFieldDirty" id="phone" name="phone" label="Téléphone"
									type="text" />
							</div>
							<Divider />
							<FieldBlock @isdirty="handleUserFieldDirty" id="address.street" name="address.street"
								label="Adresse" type="text" />
							<FieldBlock @isdirty="handleUserFieldDirty" id="address.otherStreet"
								name="address.otherStreet" label="Complément d'adresse" type="text" />
							<div class="grid grid-cols-2 gap-4 w-full">
								<FieldBlock @isdirty="handleUserFieldDirty" id="address.city" name="address.city"
									label="Ville" type="text" />
								<FieldBlock @isdirty="handleUserFieldDirty" id="address.zip" name="address.zip"
									label="Code postal" type="text" />
								<FieldBlock @isdirty="handleUserFieldDirty" id="address.state" name="address.state"
									label="Province / Région / État" type="text" />
								<FieldBlock @isdirty="handleUserFieldDirty" id="address.country" name="address.country"
									label="Pays" type="text" />

							</div>
						</div>
					</TabPanel>

					<!-- BUSINESS TAB -->
					<TabPanel value="business">
						<div class="w-full flex flex-col gap-4">
							<FieldBlock @isdirty="handleBusinessFieldDirty" id="business.name" name="business.name"
								label="Nom de l'entreprise" type="text" />
							<div class="grid grid-cols-2 gap-4 w-full">
								<FieldBlock @isdirty="handleBusinessFieldDirty" id="business.email"
									name="business.email" label="Email de l'entreprise" type="text" />
								<FieldBlock @isdirty="handleBusinessFieldDirty" id="business.phone"
									name="business.phone" label="Téléphone" type="text" />
							</div>

							<div class="grid grid-cols-2 gap-4 w-full">
								<!-- <FieldBlock id="business.siret" name="business.siret" label="SIRET" type="text" /> -->
								<FieldBlock @isdirty="handleBusinessFieldDirty" id="business.vatNumber"
									name="business.vatNumber" label="TVA intracommunautaire" type="text" />
								<FieldBlock @isdirty="handleBusinessFieldDirty" id="business.website"
									name="business.website" label="Site web" type="text" />
							</div>
							<Divider />
							<FieldBlock @isdirty="handleBusinessFieldDirty" id="business.address.street"
								name="business.address.street" label="Adresse" type="text" />
							<FieldBlock @isdirty="handleBusinessFieldDirty" id="business.address.otherStreet"
								name="business.address.otherStreet" label="Complément d'adresse" type="text" />
							<div class="grid grid-cols-2 gap-4 w-full">
								<FieldBlock @isdirty="handleBusinessFieldDirty" id="business.address.city"
									name="business.address.city" label="Ville" type="text" />
								<FieldBlock @isdirty="handleBusinessFieldDirty" id="business.address.zip"
									name="business.address.zip" label="Code postal" type="text" />
								<FieldBlock @isdirty="handleBusinessFieldDirty" id="business.address.state"
									name="business.address.state" label="Province / Région / État" type="text" />
								<FieldBlock @isdirty="handleBusinessFieldDirty" id="business.address.country"
									name="business.address.country" label="Pays" type="text" />
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
									:loading="isLoading" :disabled="isLoading || !isDirty" @click="resetForm" />
								<Button type="submit" label="Enregistrer" class="w-fit" :loading="isLoading"
									:disabled="isLoading || !isDirty" />
							</div>
						</div>
					</div>
				</Form>
			</TabPanels>
		</Tabs>
	</div>
</template>

<style scoped></style>