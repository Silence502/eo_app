<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import { useRouter } from "vue-router";
import { logout } from "@/api/auth";
import { ref, computed } from "vue";
import { Routes } from "@/router/routes";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/stores/userStore";
import AvatarBlock from "@/components/blocks/AvatarBlock.vue";
import Dialog from 'primevue/dialog';
import ProfileDialog from "@/presentations/profile/ProfileDialog.vue";
import AvatarFullBlock from "@/components/blocks/AvatarFullBlock.vue";


const { isDark } = useTheme();
const router = useRouter();
const { t } = useI18n();

async function handleLogout() {
	try {
		await logout();
	} catch {
		// L'API a échoué (ex. token expiré/absent) mais la session est déjà effacée
	} finally {
		router.push("/");
	}
}

const showProfileDialog = ref(false);

const userStore = useUserStore();

const user = computed(() => {
	if (!userStore.profile) {
		return {
			name: '',
			email: '',
			image: undefined as string | undefined,
		};
	}

	return {
		name: userStore.fullName,
		email: userStore.profile.email,
		image: userStore.profile.avatarUrl ?? undefined,
	};
});

const menu = ref();
const items = computed(() => [
	{
		label: t('layout.nav.options'),
		items: [
			{
				separator: true,
			},
			{
				label: t('layout.nav.myProfile'),
				icon: 'pi pi-user',
				command: () => {
					showProfileDialog.value = true;
				}
			},
			{
				label: t('layout.nav.settings'),
				icon: 'pi pi-cog',
				command: () => {
					router.push('/settings');
				}
			},
			{
				label: t('auth.logout'),
				icon: 'pi pi-sign-out',
				command: () => {
					handleLogout();
				}
			}
		]
	}
]);

const toggle = (event: Event) => {
	menu.value.toggle(event);
};
</script>

<template>
	<header class="default-layout-header">
		<div class="default-layout-header-content">
			<div>
				<router-link :to="Routes.Dashboard">
					<h1 hidden>Event Orchestra</h1>
					<img v-if="isDark" src="@/assets/svg/eo_logo_horizontal_dark.svg" alt="Logo" class="h-12">
					<img v-else src="@/assets/svg/eo_logo_horizontal_light.svg" alt="Logo" class="h-12">
				</router-link>
			</div>
			<div>
				<Button size="large" icon="pi pi-angle-down" iconPos="right" class="p-button-text" @click="toggle" :pt="{
					root: {
						style: 'width: fit-content; display: flex; align-items: center; gap: 0.5rem; font-size: 18px; font-weight: 600;',
					}
				}">
					<AvatarFullBlock :user="user" shape="circle" size="small" isHeader />
					<i class="pi pi-angle-down"></i>
				</Button>
				<Menu :model="items" popup ref="menu">
					<template #submenulabel="{ item }">
						<div class="flex flex-col gap-0 p-2">
							<span class="font-bold">{{ user.name }}</span>
							<span class="font-medium text-sm">{{ user.email }}</span>
						</div>
					</template>
				</Menu>
			</div>
		</div>

		<!-- PROFILE DIALOG -->
		<Dialog :header="$t('profile.title')" :style="{ width: '45rem' }" v-model:visible="showProfileDialog"
			:modal="true" :closable="true" :draggable="false">
			<template #header>
				<div class="flex flex-col gap-1 items-start">
					<h2 class="text-lg font-bold">{{ $t('profile.title') }}</h2>
					<span class="text-surface-500 dark:text-surface-400 text-sm">{{ $t('profile.subtitle') }}</span>
				</div>
			</template>
			<ProfileDialog :user="user" :userStore="userStore" />
		</Dialog>
		<!-- PROFILE DIALOG -->
	</header>
	<main class="default-layout-main">
		<slot />
	</main>
	<footer class="default-layout-footer">
		<div class="default-layout-footer-content">
			<span>{{ $t('layout.footer.copyright') }}</span>
			|
			<span>{{ $t('layout.footer.designedBy') }} <span class="font-bold font-gantari">KaiWeb
					Tech</span>.</span>
		</div>
	</footer>
</template>

<style scoped></style>