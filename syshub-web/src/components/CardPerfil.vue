<template>
  <div class="flex flex-col sm:flex-row items-center gap-6">
    <!-- Avatar -->
    <div class="relative group">
      <div
        class="w-32 h-32 rounded-full p-1 bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600"
      >
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          alt="avatar"
          class="w-full h-full object-cover rounded-full border-2 border-white"
        />
        <div
          v-else
          class="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-5xl"
        >
          👤
        </div>
      </div>
      <button
        @click="abrirModal"
        class="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-md transition-all transform hover:scale-110"
      >
        <Pencil />
      </button>
    </div>

    <!-- Info -->
    <div class="w-full flex-1">
      <div
        class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4"
      >
        <div>
          <h2 class="text-2xl font-bold text-gray-900">
            {{ authStore.user?.nombre_completo }}
          </h2>
          <p class="text-sm text-indigo-600 font-medium">
            {{ authStore.user?.rol.nombre_rol }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
          <div class="bg-indigo-100 p-2 rounded-lg">
            <UserIdCard fill="#9810fa" size="{16}" />
          </div>
          <div>
            <p class="text-xs text-gray-500 font-medium">Registro Académico</p>
            <p class="text-sm text-gray-900 font-semibold">
              {{ authStore.user?.registro_academico }}
            </p>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
          <div class="bg-purple-100 p-2 rounded-lg">
            <Education fill="#9810fa" size="{16}" />
          </div>
          <div>
            <p class="text-xs text-gray-500 font-medium">Carrera</p>
            <p class="text-sm text-gray-900 font-semibold">
              {{ authStore.user?.carrera?.nombre_carrera || "Sin asignar" }}
            </p>
          </div>
        </div>

        <div
          class="bg-gray-50 rounded-lg p-3 flex items-center gap-3 sm:col-span-2"
        >
          <div class="bg-blue-100 p-2 rounded-lg">
            <Envelope fill="#9810fa" size="{16}" />
          </div>
          <div class="flex-1">
            <p class="text-xs text-gray-500 font-medium">Correo electrónico</p>
            <p class="text-sm text-gray-900 font-semibold">
              {{ authStore.user?.email }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div
    v-if="mostrarModal"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
  >
    <div
      class="bg-white rounded-xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
    >
      <form @submit.prevent="guardarCambios">
        <div class="space-y-8">
          <!-- Perfil -->
          <div class="border-b border-gray-200 pb-4">
            <h2 class="text-lg font-semibold text-gray-900">Perfil</h2>
            <p class="mt-1 text-sm text-gray-500">
              Esta información se mostrará en tu perfil.
            </p>

            <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-6">
              <div class="sm:col-span-4">
                <label class="block text-sm font-medium text-gray-700">
                  Nombre de usuario
                </label>
                <div
                  class="mt-2 flex items-center rounded-md border border-gray-300 bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500"
                >
                  <span class="px-3 text-gray-500 text-sm">@</span>
                  <input
                    type="text"
                    class="w-full bg-transparent py-2 pr-3 text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
                    placeholder="Username"
                    v-model="form.username"
                  />
                </div>
              </div>

              <div class="col-span-full">
                <label class="block text-sm font-medium text-gray-700"
                  >Foto</label
                >
                <div class="mt-2 flex items-center gap-3">
                  <img
                    v-if="imagenPreview || fotoPerfilUrl"
                    :src="imagenPreview || fotoPerfilUrl || undefined"
                    alt="Preview"
                    class="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                  <div v-else>
                    <UserCircle
                      size="{36}"
                      pack="filled"
                      removePadding
                      class="text-gray-400"
                    />
                  </div>

                  <input
                    type="file"
                    ref="fileInput"
                    class="hidden"
                    accept="image/*"
                    @change="capturarArchivo"
                  />

                  <button
                    type="button"
                    @click="abrirSelectorArchivo"
                    class="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Información personal -->
          <div class="border-b border-gray-200 pb-3">
            <h2 class="text-lg font-semibold text-gray-900">
              Información personal
            </h2>

            <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-6">
              <div class="sm:col-span-4">
                <label class="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  v-model="form.nombre_completo"
                  type="text"
                  class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div class="sm:col-span-4">
                <label class="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div class="sm:col-span-3">
                <label class="block text-sm font-medium text-gray-700">
                  Carrera
                </label>
                <input
                  v-model="form.carrera"
                  disabled="true"
                  type="text"
                  class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div class="sm:col-span-3">
                <label class="block text-sm font-medium text-gray-700">
                  Registro Académico
                </label>
                <input
                  v-model="form.registro"
                  disabled="true"
                  type="text"
                  class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div
          class="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3"
        >
          <button
            @click="cerrarModal"
            type="button"
            class="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import api from "../services/api";
import {
  Education,
  Envelope,
  Pencil,
  UserCircle,
  UserIdCard,
} from "@boxicons/vue";

const authStore = useAuthStore();
const mostrarModal = ref(false);

const fileInput = ref<HTMLInputElement | null>(null);
const archivoSeleccionado = ref<File | null>(null);
const imagenPreview = ref<string | null>(null);

const avatarUrl = computed(() => {
  const foto = authStore.user?.foto_perfil;
  if (!foto) return null;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
  return `${apiUrl.replace("/api/v1", "")}/uploads/perfiles/${foto}`;
});

const fotoPerfilUrl = computed(() => {
  const foto = authStore.user?.foto_perfil;
  if (!foto) return null;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
  return `${apiUrl.replace("/api/v1", "")}/uploads/perfiles/${foto}`;
});

const form = ref({
  nombre_completo: authStore.user?.nombre_completo,
  email: authStore.user?.email,
  carrera: authStore.user?.carrera?.nombre_carrera,
  registro: authStore.user?.registro_academico,
  username: authStore.user?.username,
});

const abrirModal = () => {
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
  // Limpiar la imagen temporal si el usuario cancela
  archivoSeleccionado.value = null;
  imagenPreview.value = null;
};

const abrirSelectorArchivo = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const capturarArchivo = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    archivoSeleccionado.value = file;
    // Mostrar la imagen en la previsualización local
    imagenPreview.value = URL.createObjectURL(file);
  }
};

const guardarCambios = async () => {
  try {
    const datosPerfil = {
      nombre_completo: form.value.nombre_completo,
      email: form.value.email,
    };

    const resPerfil = await api.patch("/usuarios/perfil", datosPerfil);

    let usuarioActualizado = resPerfil.data;

    if (archivoSeleccionado.value) {
      const formData = new FormData();
      formData.append("foto", archivoSeleccionado.value);
      try {
        const resFoto = await api.patch("/usuarios/perfil/foto", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        usuarioActualizado = { ...usuarioActualizado, ...resFoto.data };
      } catch (fotoError: any) {
        console.error("Error al subir la foto:", fotoError);
        alert("Los datos se guardaron pero la foto no se pudo actualizar");
      }
    }

    authStore.updateUser(usuarioActualizado);
    alert("Perfil actualizado correctamente");
    cerrarModal();
  } catch (error: any) {
    console.error("Error al actualizar el perfil:", error);
    const mensaje =
      error.response?.data?.message || "Hubo un error al actualizar los datos";
    alert(mensaje);
  }
};
</script>
