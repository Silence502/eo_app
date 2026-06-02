<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import DefaultLayout from './layouts/DefaultLayout.vue';
import AuthLayout from './layouts/AuthLayout.vue';

const route = useRoute();
const router = useRouter();

const layouts: Record<string, any> = {
  DefaultLayout,
  AuthLayout
};

const isReady = ref(false);
router.isReady().then(() => { isReady.value = true; });

const currentLayout = computed(() => {
  const layoutName = (route.meta.layout as string) || 'DefaultLayout';

  return layouts[layoutName] || DefaultLayout;
});
</script>

<template>
  <component v-if="isReady" :is="currentLayout">
    <router-view />
  </component>
</template>

<style scoped></style>
