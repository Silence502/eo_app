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
import type { UserProfile } from "@/schemas/User";
import { onMounted } from "vue";

const props = withDefaults(
	defineProps<{
		userStore: any;
		user: {
			name: string;
			email: string;
		};
		loading?: boolean;
		errorMessage?: string | null;
	}>(),
	{
		userStore: null,
		user: () => ({
			name: 'John Doe',
			email: 'exemple@email.com',
		}),
		loading: false,
		errorMessage: null,
	},
);

const emit = defineEmits<{
	submit: [values: UserProfile];
}>();

const { t, isDark, resolver, initialValues, onSubmit } = useProfileForm(emit);

onMounted(() => {
	console.log('ProfileDialog mounted with user:', props.user);
	console.log('ProfileDialog mounted with userStore:', props.userStore.profile);
});

</script>

<template>
	<div class="flex flex-col items-center gap-4 p-4">
		<div class="w-full flex items-center justify-start">
			<AvatarFullBlock :user="user" shape="circle" size="large" />
		</div>

		<Tabs value="profile" class="w-full">
			<TabList>
				<Tab value="profile">Utilisateur</Tab>
				<Tab value="business">Entreprise</Tab>
			</TabList>

			<TabPanels>
				<!-- PROFILE TAB -->
				<Form :resolver="resolver" :initial-values="initialValues" @submit="onSubmit">
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
				</Form>
			</TabPanels>
		</Tabs>
	</div>
</template>

<style scoped></style>