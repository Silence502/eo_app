import { createRouter, createWebHistory } from "vue-router";
import { getToken } from "@/api/http";

const PUBLIC_ROUTES = ["/", "/login"];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../presentations/login/LoginView.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../presentations/dashboard/DashboardView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../presentations/login/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../presentations/register/RegisterView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

router.beforeEach(to => {
  const isAuthenticated = !!getToken();
  if (!PUBLIC_ROUTES.includes(to.path) && !isAuthenticated) {
    return { name: "home" };
  }
});

export default router;
