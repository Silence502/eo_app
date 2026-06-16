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
import { ref, onMounted, computed, provide } from "vue";
import Badge from 'primevue/badge';
import { UserProfileFormSchema } from "@/schemas/User";

const props = withDefaults(
	defineProps<{
		userStore: any;
		user: {
			name: string;
			email: string;
			image?: string;
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
const avatarComponent = ref<InstanceType<typeof AvatarFullBlock> | null>(null);
const isDirty = useFormDirty(formRef);
const isUserFieldDirty = ref(false);
const isBusinessFieldDirty = ref(false);

const {
	resolver,
	initialValues,
	isLoading,
	errorMessage,
	onSubmit,
	resetForm,
	onAvatarChange,
	isUploadingAvatar,
	isAvatarChanged
} = useProfileForm(formRef, avatarComponent);

function handleUserFieldDirty(value: boolean) {
	isUserFieldDirty.value = value;
}

function handleBusinessFieldDirty(value: boolean) {
	isBusinessFieldDirty.value = value;
}

provide('formSchema', UserProfileFormSchema);
</script>

<template>
	<div class="flex flex-col items-center gap-4 p-4">
		<div class="w-full flex items-center justify-start">
			<AvatarFullBlock ref="avatarComponent" :user="user" shape="circle" size="large" editable
				:uploading="isUploadingAvatar" @avatarChange="onAvatarChange" />
		</div>

		<Tabs value="profile" class="w-full">
			<TabList>
				<Tab value="profile">
					<div class="flex items-center gap-2">
						<i class="pi pi-user"></i>
						<span>{{ $t('profile.user') }}</span>
					</div>

					<Badge v-if="isUserFieldDirty" severity="warn" class="ml-2 w-1 absolute top-2 right-2" />
				</Tab>
				<Tab value="business">
					<div class="flex items-center gap-2">
						<i class="pi pi-building"></i>
						<span>{{ $t('profile.business') }}</span>
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
								<FieldBlock @isdirty="handleUserFieldDirty" id="firstName" name="firstName" badge
									:label="$t('auth.firstName')" type="text" />
								<FieldBlock @isdirty="handleUserFieldDirty" id="lastName" name="lastName" badge
									:label="$t('auth.lastName')" type="text" />
							</div>
							<div class="grid grid-cols-2 gap-4 w-full">
								<FieldBlock @isdirty="handleUserFieldDirty" id="email" name="email" badge
									:label="$t('auth.email')" type="text" />
								<FieldBlock @isdirty="handleUserFieldDirty" id="phone" name="phone" badge
									:label="$t('auth.phone')" type="text" />
							</div>
							<Divider />
							<FieldBlock @isdirty="handleUserFieldDirty" id="address.street" name="address.street" badge
								:label="$t('auth.address')" type="text" />
							<FieldBlock @isdirty="handleUserFieldDirty" id="address.otherStreet"
								name="address.otherStreet" badge :label="$t('auth.addressOther')" type="text" />
							<div class="grid grid-cols-2 gap-4 w-full">
								<FieldBlock @isdirty="handleUserFieldDirty" id="address.city" name="address.city" badge
									:label="$t('auth.city')" type="text" />
								<FieldBlock @isdirty="handleUserFieldDirty" id="address.zip" name="address.zip" badge
									:label="$t('auth.zip')" type="text" />
								<FieldBlock @isdirty="handleUserFieldDirty" id="address.state" name="address.state"
									badge :label="$t('auth.state')" type="text" />
								<FieldBlock @isdirty="handleUserFieldDirty" id="address.country" name="address.country"
									badge :label="$t('auth.country')" type="text" />

							</div>
						</div>
					</TabPanel>

					<!-- BUSINESS TAB -->
					<TabPanel value="business">
						<div class="w-full flex flex-col gap-4">
							<FieldBlock @isdirty="handleBusinessFieldDirty" id="business.name" name="business.name"
								badge :label="$t('profile.businessName')" type="text" />
							<div class="grid grid-cols-2 gap-4 w-full">
								<FieldBlock @isdirty="handleBusinessFieldDirty" id="business.email"
									name="business.email" badge :label="$t('profile.businessEmail')" type="text" />
								<FieldBlock @isdirty="handleBusinessFieldDirty" id="business.phone"
									name="business.phone" badge :label="$t('profile.businessPhone')" type="text" />
							</div>

							<div class="grid grid-cols-2 gap-4 w-full">
								<!-- <FieldBlock id="business.siret" name="business.siret" label="SIRET" type="text" /> -->
								<FieldBlock @isdirty="handleBusinessFieldDirty" id="business.vatNumber"
									name="business.vatNumber" badge :label="$t('profile.businessVatNumber')"
									type="text" />
								<FieldBlock @isdirty="handleBusinessFieldDirty" id="business.website"
									name="business.website" badge :label="$t('profile.businessWebsite')" type="text" />
							</div>
							<Divider />
							<FieldBlock @isdirty="handleBusinessFieldDirty" id="business.address.street"
								name="business.address.street" badge :label="$t('profile.businessAddress')"
								type="text" />
							<FieldBlock @isdirty="handleBusinessFieldDirty" id="business.address.otherStreet"
								name="business.address.otherStreet" badge :label="$t('profile.businessAddressOther')"
								type="text" />
							<div class="grid grid-cols-2 gap-4 w-full">
								<FieldBlock @isdirty="handleBusinessFieldDirty" id="business.address.city"
									name="business.address.city" badge :label="$t('profile.businessCity')"
									type="text" />
								<FieldBlock @isdirty="handleBusinessFieldDirty" id="business.address.zip"
									name="business.address.zip" badge :label="$t('profile.businessZip')" type="text" />
								<FieldBlock @isdirty="handleBusinessFieldDirty" id="business.address.state"
									name="business.address.state" badge :label="$t('profile.businessState')"
									type="text" />
								<FieldBlock @isdirty="handleBusinessFieldDirty" id="business.address.country"
									name="business.address.country" badge :label="$t('profile.businessCountry')"
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
								<Message v-if="isDirty || isAvatarChanged" severity="warn" variant="outlined">
									{{ $t('common.inProgress') }}
								</Message>
							</div>
							<div class="flex flex-row justify-end gap-4">
								<Button type="button" severity="secondary" :label="$t('common.cancel')" class="w-fit"
									:loading="isLoading" :disabled="isLoading || (!isDirty && !isAvatarChanged)"
									@click="resetForm" />
								<Button type="submit" :label="$t('common.save')" class="w-fit" :loading="isLoading"
									:disabled="isLoading || !$form.valid || (!isDirty && !isAvatarChanged)" />
							</div>
						</div>
					</div>
				</Form>
			</TabPanels>
		</Tabs>
	</div>
</template>

<style scoped></style>