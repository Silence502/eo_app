import { createRouter, createWebHistory } from "vue-router";
import { getToken, getRefreshToken, isTokenExpired } from "@/api/http";
import { PUBLIC_ROUTES } from "@/router/routes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../presentations/login/LoginView.vue"),
      meta: {
        requiresAuth: false,
        layout: "AuthLayout",
      },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../presentations/dashboard/DashboardView.vue"),
      meta: {
        requiresAuth: true,
        layout: "DefaultLayout",
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../presentations/login/LoginView.vue"),
      meta: {
        requiresAuth: false,
        layout: "AuthLayout",
      },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../presentations/register/RegisterView.vue"),
      meta: {
        requiresAuth: false,
        layout: "AuthLayout",
      },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

router.beforeEach(to => {
  const hasValidToken = !!getToken() && !isTokenExpired();
  const hasRefreshToken = !!getRefreshToken();
  // L'utilisateur est considéré authentifié s'il a un token valide
  // OU un refresh token (l'intercepteur HTTP se chargera du renouvellement)
  const isAuthenticated = hasValidToken || hasRefreshToken;

  if (!(PUBLIC_ROUTES as string[]).includes(to.path) && !isAuthenticated) {
    return { name: "login" };
  }
});

export default router;
