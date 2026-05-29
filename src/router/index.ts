import { createRouter, createWebHistory } from "vue-router";
import { getToken } from "@/api/http";
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
  const isAuthenticated = !!getToken();
  if (!(PUBLIC_ROUTES as string[]).includes(to.path) && !isAuthenticated) {
    return { name: "home" };
  }
});

export default router;
