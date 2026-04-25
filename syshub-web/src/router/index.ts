// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Registro from "../views/Registro.vue";
import { useAuthStore } from "../stores/auth";
import DefaultLayout from "../layout/DefaultLayout.vue";
import MiPerfil from "../views/MiPerfil.vue";
import Home from "../views/Home.vue";
import Repositorios from "../views/Repositorios.vue";
import Curaduria from "../views/Curaduria.vue";
import Explorar from "../views/Explorar.vue";
import GestionUsuarios from "../views/GestionUsuarios.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "",
        name: "home",
        component: Home,
        meta: { requiresAuth: true },
      },
      {
        path: "/me",
        name: "mi-perfil",
        component: MiPerfil,
        meta: { requiresAuth: true },
      },
      {
        path: "/repositorio",
        name: "repositorio",
        component: Repositorios,
        meta: { requiresAuth: false },
      },
      {
        path: "/curaduria",
        name: "curaduria",
        component: Curaduria,
        meta: { requiresAuth: true },
      },
      {
        path: "/explorar",
        name: "explorar",
        component: Explorar,
        meta: { requiresAuth: true },
      },
      {
        path: "/gestion-usuarios",
        name: "Gestion de Usuarios",
        component: GestionUsuarios,
        meta: { requiresAuth: true },
      },
    ],
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
  const store = useAuthStore();
  if (to.meta.requiresAuth && !store.isAuthenticated) return "/login";
});

export default router;
