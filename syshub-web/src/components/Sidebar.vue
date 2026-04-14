<template>
  <!-- SIDEBAR: visible solo en desktop (md y arriba) -->
  <aside
    class="w-auto h-[calc(100vh-2rem)] sticky top-4 bg-white border border-gray-200 rounded-[2.5rem] flex-col p-7 shadow-sm hidden md:flex flex-col"
  >
    <!-- Logo -->
    <div
      class="h-12 w-full border-2 border-gray-200 rounded-lg mb-8 flex items-center justify-center bg-gray-200"
    >
      <span class="text-2xl px-6 py-3 font-bold text-gray-600">
        <span>syshu</span>
        <span class="text-pink-500">b</span>
      </span>
    </div>

    <!-- Menú desktop -->
    <nav class="flex-1 flex flex-col justify-center space-y-6">
      <RouterLink
        v-for="item in menuItems"
        :key="item.label"
        :to="item.to"
        class="flex items-center gap-3 text-xl hover:text-blue-500 transition px-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path :d="item.iconPath" /></svg
        >{{ item.label }}
      </RouterLink>
    </nav>

    <!-- Perfil desktop (al final, como Twitter/X) -->
    <div class="relative">
      <button
        @click="togglePerfilMenu"
        class="w-full p-3 border-gray-100 border-2 border-b-2 rounded-2xl flex items-center gap-3 hover:bg-gray-50 transition"
      >
        <div
          class="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-200"
        >
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            alt="avatar"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full bg-gray-200 flex items-center justify-center text-xl"
          >
            👤
          </div>
        </div>
        <div class="flex-1 text-left">
          <span class="font-medium text-gray-700 block">{{ authStore.user?.nombre_completo }}</span>
          <span class="text-sm text-gray-500">@{{ authStore.user?.registro_academico }}</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" class="text-gray-400">
          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
        </svg>
      </button>

      <!-- Menú desplegable perfil -->
      <div
        v-if="mostrarPerfilMenu"
        class="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
      >
        <RouterLink
          to="/me"
          class="flex items-center gap-3 p-3 hover:bg-gray-50 transition border-b border-gray-100"
          @click="mostrarPerfilMenu = false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" class="text-gray-600">
            <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5m0-8c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3M4 22h16c.55 0 1-.45 1-1v-1c0-3.86-3.14-7-7-7h-4c-3.86 0-7 3.14-7 7v1c0 .55.45 1 1 1"/>
          </svg>
          <span class="text-gray-700">Ver perfil</span>
        </RouterLink>
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 p-3 hover:bg-red-50 transition text-left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" class="text-red-500">
            <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
            <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3 3z"/>
          </svg>
          <span class="text-red-600">Cerrar sesión</span>
        </button>
      </div>
    </div>
  </aside>

  <!-- NAVBAR MÓVIL: visible solo en móvil (menor a md) -->
  <nav
    class="md:hidden fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50 shadow-sm"
  >
    <div class="flex justify-between items-center p-4">
      <!-- Logo -->
      <div class="flex items-center">
        <span class="text-2xl font-bold text-gray-600">
          <span>syshu</span>
          <span class="text-pink-500">b</span>
        </span>
      </div>

      <!-- Botón hamburguesa -->
      <button
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="p-2 rounded-lg hover:bg-gray-100"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            v-if="!isMobileMenuOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Menú desplegable móvil -->
    <div
      v-show="isMobileMenuOpen"
      class="bg-white border-t border-gray-200 max-h-[calc(100vh-4rem)] overflow-y-auto"
    >
      <div class="p-4 space-y-4">
        <RouterLink
          v-for="item in menuItems"
          :key="item.label"
          :to="item.to"
          @click="isMobileMenuOpen = false"
          class="flex items-center gap-3 text-lg p-3 rounded-xl hover:bg-gray-50 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path :d="item.iconPath" /></svg
          >{{ item.label }}
        </RouterLink>

        <!-- Perfil móvil -->
        <div
          class="pt-4 mt-4 border-t border-gray-100 flex items-center gap-3 p-3"
        >
          <div
            class="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-200"
          >
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              alt="avatar"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full bg-gray-200 flex items-center justify-center"
            >
              👤
            </div>
          </div>
          <span class="font-medium text-gray-700">{{ authStore.user?.nombre_completo }}</span>
        </div>

        <!-- Cerrar sesión móvil -->
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
            <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3 3z"/>
          </svg>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const router = useRouter();

const isMobileMenuOpen = ref(false);
const mostrarPerfilMenu = ref(false);

const avatarUrl = computed(() => {
  const foto = authStore.user?.foto_perfil;
  if (!foto) return null;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
  return `${apiUrl.replace('/api/v1', '')}/uploads/perfiles/${foto}`;
});

const togglePerfilMenu = () => {
  mostrarPerfilMenu.value = !mostrarPerfilMenu.value;
};

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};

const menuItems = [
  {
    label: "Búsqueda",
    to: "/",
    iconPath:
      "M18 10c0-4.41-3.59-8-8-8s-8 3.59-8 8 3.59 8 8 8c1.85 0 3.54-.63 4.9-1.69l5.1 5.1L21.41 20l-5.1-5.1A8 8 0 0 0 18 10M4 10c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6",
  },
  {
    label: "Inicio",
    to: "/",
    iconPath:
      "M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1c.4 0 .77-.24.92-.62.15-.37.07-.8-.22-1.09l-8.99-9a.996.996 0 0 0-1.41 0l-9.01 9c-.29.29-.37.72-.22 1.09s.52.62.92.62Zm9-8.59 6 6V20H6v-9.59z",
  },
  {
    label: "Artículos",
    to: "/",
    iconPath:
      "M5 7h5v6H5zm0 8h10v2H5zm7-4h3v2h-3zm0-4h3v2h-3zM21 18c0 .55-.45 1-1 1s-1-.45-1-1V5c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v13c0 1.65 1.35 3 3 3h16c1.65 0 3-1.35 3-3V6h-2zM4 19c-.55 0-1-.45-1-1V5h14v13c0 .35.07.69.18 1z",
  },
  {
    label: "Proyectos",
    to: "/",
    iconPath:
      "M19 2H5c-.55 0-1 .45-1 1v4H2v2h2v2H2v2h2v2H2v2h2v4c0 .55.45 1 1 1h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2M6 4h8v16H6zm13 16h-3V4h3z",
  },
  {
    label: "Notificaciones",
    to: "/",
    iconPath:
      "M19 12.59V10c0-3.22-2.18-5.93-5.14-6.74C13.57 2.52 12.85 2 12 2s-1.56.52-1.86 1.26C7.18 4.08 5 6.79 5 10v2.59L3.29 14.3a1 1 0 0 0-.29.71v2c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-2c0-.27-.11-.52-.29-.71zM19 16H5v-.59l1.71-1.71a1 1 0 0 0 .29-.71v-3c0-2.76 2.24-5 5-5s5 2.24 5 5v3c0 .27.11.52.29.71L19 15.41zm-4.18 4H9.18c.41 1.17 1.51 2 2.82 2s2.41-.83 2.82-2",
  },
  {
    label: "Perfil",
    to: "/me",
    iconPath:
      "M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5m0-8c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3M4 22h16c.55 0 1-.45 1-1v-1c0-3.86-3.14-7-7-7h-4c-3.86 0-7 3.14-7 7v1c0 .55.45 1 1 1m6-7h4c2.76 0 5 2.24 5 5H5c0-2.76 2.24-5 5-5",
  },
];
</script>