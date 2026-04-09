// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Registro from "../views/Registro.vue";
import Home from "../views/Home.vue";
import { useAuthStore } from "../stores/auth";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/registro",
    name: "registro",
    component: Registro,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  // ✅ This will work because the router starts its navigation after
  // the router is installed and pinia will be installed too
  const store = useAuthStore();

  if (to.meta.requiresAuth && !store.isAuthenticated) return "/login";
});

export default router;
