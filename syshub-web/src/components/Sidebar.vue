<template>
  <aside
    class="hidden lg:flex fixed top-4 left-4 w-64 h-[calc(100vh-2rem)] bg-white border border-gray-200 rounded-[2.5rem] p-7 flex-col z-30"
  >
    <div
      class="h-12 w-full border-2 border-gray-200 rounded-lg mb-8 flex items-center justify-center bg-gray-200 shrink-0"
    >
      <span class="text-2xl px-6 py-3 font-bold text-gray-600">
        <span>syshu</span>
        <span class="text-pink-500">b</span>
      </span>
    </div>

    <nav class="flex-1 flex flex-col justify-center space-y-6">
      <RouterLink
        v-for="item in filteredMenu"
        :key="item.label"
        :to="item.to"
        class="flex items-center gap-3 text-xl hover:text-blue-500 transition px-2"
      >
        <component :is="item.iconComponent" :width="32" :height="32" />
        {{ item.label }}
      </RouterLink>
    </nav>

    <div class="relative shrink-0">
      <button
        @click="mostrarPerfilMenu = !mostrarPerfilMenu"
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
          <span class="font-medium text-gray-700 block">{{
            authStore.user?.nombre_completo
          }}</span>
          <span class="text-sm text-gray-500"
            >@{{ authStore.user?.registro_academico }}</span
          >
        </div>
        <DotsHorizontalRounded class="text-gray-400" />
      </button>

      <div
        v-if="mostrarPerfilMenu"
        class="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
      >
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 p-3 hover:bg-red-50 transition text-left"
        >
          <ArrowOutRightStrokeCircleHalf class="text-red-500" />
          <span class="text-red-600">Cerrar sesión</span>
        </button>
      </div>
    </div>
  </aside>

  <nav
    class="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 p-4 flex justify-between items-center"
  >
    <span class="text-xl font-bold text-gray-600"
      >syshu<span class="text-pink-500">b</span></span
    >
    <button
      @click="mostrarMenu = !mostrarMenu"
      class="p-2 rounded-lg hover:bg-gray-100"
    >
      <Menu />
    </button>
  </nav>

  <div
    v-if="mostrarMenu"
    class="lg:hidden fixed inset-0 bg-black/50 z-40 pt-16"
    @click="mostrarMenu = false"
  >
    <div class="bg-white border-b border-gray-200 p-4 space-y-4" @click.stop>
      <RouterLink
        v-for="item in filteredMenu"
        :key="item.label"
        :to="item.to"
        @click="mostrarMenu = false"
        class="flex items-center gap-3 text-lg p-3 rounded-xl hover:bg-gray-50 transition"
      >
        <component :is="item.iconComponent" />
        {{ item.label }}
      </RouterLink>

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
        <span class="font-medium text-gray-700">{{
          authStore.user?.nombre_completo
        }}</span>
      </div>

      <button
        @click="
          handleLogout;
          mostrarMenu = false;
        "
        class="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition"
      >
        <ArrowOutRightStrokeCircleHalf class="text-red-500" />
        <span>Cerrar sesión</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { menuItems } from "../composables/useMenu";
import {
  ArrowOutRightStrokeCircleHalf,
  DotsHorizontalRounded,
  Menu,
} from "@boxicons/vue";

const authStore = useAuthStore();
const userRole = computed(() => authStore.user?.rol.nombre_rol);

const filteredMenu = computed(() => {
  return menuItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(userRole.value);
  });
});
const router = useRouter();

const mostrarMenu = ref(false);
const mostrarPerfilMenu = ref(false);

const avatarUrl = computed(() => {
  const foto = authStore.user?.foto_perfil;
  if (!foto) return null;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
  return `${apiUrl.replace("/api/v1", "")}/uploads/perfiles/${foto}`;
});

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>
