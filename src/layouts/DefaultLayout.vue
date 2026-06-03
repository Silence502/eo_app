<script setup lang="ts">
import ThemeSwitcher from "@/components/blocks/ThemeSwitcher.vue";
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

const userStore = useUserStore();

const user = computed(() => {
	if (!userStore.user) {
		return {
			name: '',
			email: '',
		};
	}

	return {
		name: userStore.fullName,
		email: userStore.user.email,
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
					router.push('/profile');
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
				<!-- <ThemeSwitcher /> -->
			</div>
			<div>
				<Button size="large" icon="pi pi-angle-down" iconPos="right" class="p-button-text" @click="toggle" :pt="{
					root: {
						style: 'width: fit-content; display: flex; align-items: center; gap: 0.5rem;',
					}
				}">
					<AvatarBlock :userFullname="user.name" shape="circle" />
					{{ user.name }}
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