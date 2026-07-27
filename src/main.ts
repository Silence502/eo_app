import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
// import Aura from "@primeuix/themes/aura";
import { defaultTheme } from "./themes/default";
import "./assets/main.css";

import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";
import { getToken } from "./api/http";
import { getProfile, getSettings } from "./api/auth";
import { useUserStore } from "./stores/userStore";
import ToastService from "primevue/toastservice";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(i18n);
app.use(ToastService);
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: defaultTheme,
    options: {
      darkModeSelector: ".eo-dark",
    },
  },
});

// Restore saved theme preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("eo-dark");
}

// Restore user session if a token is present
if (getToken()) {
  try {
    const userStore = useUserStore();
    const profile = await getProfile();
    const settings = await getSettings();
    userStore.setProfile(profile);
    userStore.setSettings(settings);
  } catch {
    // Token invalide ou expiré : la session sera nettoyée par l'intercepteur
  }
}

app.mount("#app");
