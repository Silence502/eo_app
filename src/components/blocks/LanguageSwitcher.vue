<script setup lang="ts">
import { IconLanguage } from '@tabler/icons-vue';
import Select from 'primevue/select';
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();

function onLocaleChange(value: string) {
	locale.value = value;
	localStorage.setItem('locale', value);
}

const languages = [
	{ label: 'Français', value: 'fr', flag: 'fi fi-fr' },
	{ label: 'English', value: 'en', flag: 'fi fi-gb' }
];
</script>

<template>
	<Select :model-value="locale" @update:model-value="onLocaleChange" :pt="{
		root: {
			style: 'background: transparent; border: none;'
		}
	}" class="language-switcher" :options="languages" option-label="label" option-value="value">
		<template #dropdownicon>
			<IconLanguage />
		</template>
		<template #option="{ option }">
			<span class="flex items-center gap-2">
				<span :class="option.flag"></span>
			</span>
		</template>
		<template #value="{ value }">
			<span class="flex items-center gap-2" v-if="value">
				<span :class="languages.find(l => l.value === value)?.flag"></span>
			</span>
		</template>
	</Select>
</template>

<style scoped></style>