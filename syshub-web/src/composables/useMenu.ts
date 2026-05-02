import {
  Bell,
  BookLibrary,
  Community,
  Dashboard,
  Education,
  Folder,
  Home,
  News,
  School,
  Search,
  Shield,
  User,
} from "@boxicons/vue";
import type { Component } from "vue";

export interface MenuItem {
  label: string;
  to: string;
  iconComponent: Component;
  roles?: string[]; // Si no existe, es público para todos
}

export const menuItems: MenuItem[] = [
  //vistas para estudiante
  {
    label: "Búsqueda",
    to: "/explorar",
    iconComponent: Search,
    roles: ["estudiante"],
  },
  { label: "Inicio", to: "/", iconComponent: Home, roles: ["estudiante"] },
  { label: "Articulos", to: "/articulos", iconComponent: News, roles: ["estudiante"] },
  {
    label: "Proyectos",
    to: "/repositorio",
    iconComponent: Folder,
    roles: ["estudiante"],
  },
  {
    label: "Notificaciones",
    to: "/notificaciones",
    iconComponent: Bell,
    roles: ["estudiante"],
  },
  // Solo visible docente (auxiliar)
  {
    label: "Dashboard",
    to: "/dashboard-auxiliar",
    iconComponent: Dashboard,
    roles: ["auxiliar"],
  },
  {
    label: "Curaduría",
    to: "/curaduria",
    iconComponent: Education,
    roles: ["auxiliar"],
  },
  {
    label: "Gestión de Estudiantes",
    to: "/gestion-estudiantes",
    iconComponent: Community,
    roles: ["auxiliar"],
  },
  {
    label: "Materias",
    to: "/materias",
    iconComponent: BookLibrary,
    roles: ["auxiliar"],
  },
  // solo visible para administrador
  {
    label: "Dashboard",
    to: "/dashboard-admin",
    iconComponent: Dashboard,
    roles: ["administrador"],
  },
  {
    label: "Gestión de Usuarios",
    to: "/gestion-usuarios",
    iconComponent: Community,
    roles: ["administrador"],
  },
  {
    label: "Gestión Académica",
    to: "/gestion-academica",
    iconComponent: School,
    roles: ["administrador"],
  },
  {
    label: "Roles",
    to: "/roles",
    iconComponent: Shield,
    roles: ["administrador"],
  },
  { label: "Perfil", to: "/me", iconComponent: User },
];
