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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821 1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"
          />
        </svg>
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
          <p class="text-sm text-indigo-600 font-medium">Estudiante</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
          <div class="bg-indigo-100 p-2 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              class="text-indigo-600"
              viewBox="0 0 16 16"
            >
              <path
                d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z"
              />
              <path
                d="M2 10a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z"
              />
            </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              class="text-purple-600"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 16a2 2 0 0 0 2-2c0-1.5-1.5-3-3.5-3S3 12.5 3 14a2 2 0 0 0 4 0c0-1.5 1.5-3 3.5-3s3.5 1.5 3.5 3a2 2 0 0 0 2 2c0 2-3 3.5-5.5 3.5S2 18 2 16a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2c2 0 5.5 1.5 5.5 3.5s-3.5 3.5-5.5 3.5S2 21 2 18a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2c0 2-3 3.5-5.5 3.5S2 20 2 18V16z"
              />
            </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              class="text-blue-600"
              viewBox="0 0 16 16"
            >
              <path
                d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H4zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z"
              />
            </svg>
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
                  <span class="px-3 text-gray-500 text-sm">syshub/</span>
                  <input
                    type="text"
                    class="w-full bg-transparent py-2 pr-3 text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
                    placeholder="ElGatoVolador"
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
                    :src="imagenPreview || fotoPerfilUrl"
                    alt="Preview"
                    class="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="36"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    class="text-gray-400"
                  >
                    <path
                      d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2m0 5c1.73 0 3 1.27 3 3s-1.27 3-3 3-3-1.27-3-3 1.27-3 3-3m0 13a7.98 7.98 0 0 1-5.48-2.18C7.33 16.16 9.03 15 11 15h2c1.97 0 3.66 1.16 4.47 2.82A7.94 7.94 0 0 1 12 20"
                    ></path>
                  </svg>

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

// ✨ ESTA FUNCIÓN SOLUCIONA TU WARNING ✨
// Se usa para hacer clic "virtualmente" en el input de archivo oculto
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
    // Creamos la previsualización local
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
