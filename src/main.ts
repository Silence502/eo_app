import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import "./assets/main.css";

import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";
import { getToken } from "./api/http";
import { getProfile } from "./api/auth";
import { useUserStore } from "./stores/userStore";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(i18n);
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: Aura,
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
    userStore.setUser(profile);
  } catch {
    // Token invalide ou expiré : la session sera nettoyée par l'intercepteur
  }
}

app.mount("#app");
