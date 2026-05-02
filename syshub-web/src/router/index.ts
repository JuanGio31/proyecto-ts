// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Registro from "../views/Registro.vue";
import { useAuthStore } from "../stores/auth";
import DefaultLayout from "../layout/DefaultLayout.vue";
import MiPerfil from "../views/MiPerfil.vue";
import Home from "../views/Home.vue";
import Curaduria from "../views/auxiliar/Curaduria.vue";
import Explorar from "../views/Explorar.vue";
import GestionUsuarios from "../views/admin/GestionUsuarios.vue";
import AuxDashboard from "../views/auxiliar/AuxDashboard.vue";
import GestionEstudiantes from "../views/auxiliar/GestionEstudiantes.vue";
import Repositorios from "../views/estudiante/Repositorios.vue";
import AdminDashboard from "../views/admin/AdminDashboard.vue";
import GestionAcademica from "../views/admin/GestionAcademica.vue";
import Roles from "../views/admin/Roles.vue";
import Articulos from "../views/estudiante/Articulos.vue";
import Notificaciones from "../views/estudiante/Notificaciones.vue";
import Materias from "../views/auxiliar/Materias.vue";
import DetalleArticulo from "../views/estudiante/DetalleArticulo.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "",
        name: "home",
        component: Home,
        meta: { requiresAuth: true, requiredRole: "estudiante" },
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
        meta: { requiresAuth: false, requiredRole: "estudiante" },
      },
      {
        path: "/explorar",
        name: "explorar",
        component: Explorar,
        meta: { requiresAuth: true },
      },
      {
        path: "/articulos",
        name: "articulos",
        component: Articulos,
        meta: { requiresAuth: true },
      },
      {
        path: "/articulos/:id",
        name: "detalle-articulo",
        component: DetalleArticulo,
        meta: { requiresAuth: true },
      },
      {
        path: "/notificaciones",
        name: "notificaciones",
        component: Notificaciones,
        meta: { requiresAuth: true, requiredRole: "estudiante" },
      },
      {
        path: "/dashboard-auxiliar",
        name: "dashboard auxiliar",
        component: AuxDashboard,
        meta: { requiresAuth: true, requiredRole: "auxiliar" },
      },
      {
        path: "/curaduria",
        name: "curaduria",
        component: Curaduria,
        meta: { requiresAuth: true, requiredRole: "auxiliar" },
      },
      {
        path: "/gestion-estudiantes",
        name: "gestion de estudiantes",
        component: GestionEstudiantes,
        meta: { requiresAuth: true, requiredRole: "auxiliar" },
      },
      {
        path: "/materias",
        name: "materias",
        component: Materias,
        meta: { requiresAuth: true, requiredRole: "auxiliar" },
      },
      {
        path: "/dashboard-admin",
        name: "dashboard admin",
        component: AdminDashboard,
        meta: { requiresAuth: true, requiredRole: "administrador" },
      },
      {
        path: "/gestion-usuarios",
        name: "Gestion de Usuarios",
        component: GestionUsuarios,
        meta: { requiresAuth: true, requiredRole: "administrador" },
      },
      {
        path: "/gestion-academica",
        name: "gesion academica",
        component: GestionAcademica,
        meta: { requiresAuth: true, requiredRole: "administrador" },
      },
      {
        path: "/roles",
        name: "roles",
        component: Roles,
        meta: { requiresAuth: true, requiredRole: "administrador" },
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

router.beforeEach(async (to) => {
  const store = useAuthStore();

  if (store.token && store.isLoadingUser) {
    await store.fetchCurrentUser();
  }

  if (to.meta.requiresAuth && !store.isAuthenticated) {
    return "/login";
  }

  if (to.path === "/me" && store.user) {
    // Permitir acceso a Mi Perfil para todos los roles autenticados
  }

  if (to.meta.requiredRole) {
    const userRole = store.user?.rol?.nombre_rol;
    if (userRole !== to.meta.requiredRole) {
      return "/";
    }
  }
});

export default router;
