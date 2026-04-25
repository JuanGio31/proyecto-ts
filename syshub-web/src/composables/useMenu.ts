import {
  Bell,
  Education,
  Folder,
  Home,
  News,
  Search,
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
  {
    label: "Búsqueda",
    to: "/explorar",
    iconComponent: Search,
    roles: ["estudiante"],
  },
  { label: "Inicio", to: "/", iconComponent: Home, roles: ["estudiante"] },
  { label: "Articulos", to: "/", iconComponent: News, roles: ["estudiante"] },
  {
    label: "Proyectos",
    to: "/repositorio",
    iconComponent: Folder,
    roles: ["estudiante"],
  },
  { label: "Notificaciones", to: "/", iconComponent: Bell },
  { label: "Perfil", to: "/me", iconComponent: User },
  // Solo visible para admin y docente (auxiliar)
  {
    label: "Curaduría",
    to: "/curaduria",
    iconComponent: Education,
    roles: ["auxiliar"],
  },
  {
    label: "Gestión de Usuarios",
    to: "/gestion-usuarios",
    iconComponent: Education,
    roles: ["administrador"],
  },
];
