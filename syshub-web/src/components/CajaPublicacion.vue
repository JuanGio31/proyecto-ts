<template>
  <div class="bg-white border border-gray-200 p-4 rounded-xl">
    <div class="flex gap-3">
      <!-- Avatar -->
      <div class="w-10 h-10 rounded-full overflow-hidden shrink-0">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          alt="avatar"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <div
          v-else
          class="w-full h-full bg-gray-200 flex items-center justify-center"
        >
          👤
        </div>
      </div>

      <!-- Contenido -->
      <div class="flex-1">
        <textarea
          v-model="contenido"
          placeholder="¿Qué estás pensando?"
          class="w-full bg-transparent border-none focus:ring-0 text-lg outline-none resize-none placeholder-gray-400"
          rows="3"
        ></textarea>

        <!-- Preview de imágenes -->
        <div
          v-if="imagenesPreview.length > 0"
          class="mt-3 grid gap-1 max-w-sm"
          :class="imagenesPreview.length === 1 ? 'grid-cols-1' : 'grid-cols-2'"
        >
          <div
            v-for="(img, index) in imagenesPreview"
            :key="index"
            class="relative group aspect-square"
          >
            <img
              :src="img"
              alt="Preview"
              class="w-full h-full object-cover rounded-lg border border-gray-200"
            />
            <button
              @click="quitarImagen(index)"
              class="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 flex items-center justify-center transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Acciones -->
        <div
          class="flex justify-between items-center mt-3 pt-3 border-t border-gray-100"
        >
          <div class="flex gap-1">
            <label
              class="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-50 rounded-full cursor-pointer transition"
            >
              <input
                type="file"
                ref="fileInput"
                class="hidden"
                accept="image/*"
                multiple
                @change="capturarArchivos"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"
                />
                <path
                  d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"
                />
              </svg>
            </label>
          </div>

          <button
            @click="publicar"
            :disabled="
              (!contenido.trim() && imagenesPreview.length === 0) || loading
            "
            class="bg-blue-500 text-white px-4 py-1.5 rounded-full font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {{ loading ? "Publicando..." : "Publicar" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { postsService } from "../services/posts.services";

const emit = defineEmits(["publicado"]);

const authStore = useAuthStore();
const fileInput = ref<HTMLInputElement | null>(null);
const contenido = ref("");
const archivosSeleccionados = ref<File[]>([]);
const imagenesPreview = ref<string[]>([]);
const loading = ref(false);

const avatarUrl = computed(() => {
  const foto = authStore.user?.foto_perfil;
  if (!foto) return null;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
  return `${apiUrl.replace("/api/v1", "")}/uploads/perfiles/${foto}`;
});

const comprimirImagen = (
  file: File,
  maxWidth = 1200,
  quality = 0.7,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo crear el contexto"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Error al comprimir"));
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality,
        );
      };
      img.onerror = () => reject(new Error("Error al cargar la imagen"));
    };
    reader.onerror = () => reject(new Error("Error al leer el archivo"));
  });
};

const capturarArchivos = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const nuevosArchivos = Array.from(target.files);
    const totalActual = archivosSeleccionados.value.length;

    if (totalActual + nuevosArchivos.length > 4) {
      alert("Máximo 4 imágenes");
      return;
    }

    for (const file of nuevosArchivos) {
      try {
        const compressed = await comprimirImagen(file);
        archivosSeleccionados.value.push(compressed);
        imagenesPreview.value.push(URL.createObjectURL(compressed));
      } catch (error) {
        console.error("Error al comprimir imagen:", error);
        archivosSeleccionados.value.push(file);
        imagenesPreview.value.push(URL.createObjectURL(file));
      }
    }
  }
};

const quitarImagen = (index: number) => {
  archivosSeleccionados.value.splice(index, 1);
  imagenesPreview.value.splice(index, 1);
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const publicar = async () => {
  if (!contenido.value.trim() && imagenesPreview.value.length === 0) return;

  loading.value = true;
  try {
    await postsService.createPost(contenido.value, archivosSeleccionados.value);
    contenido.value = "";
    archivosSeleccionados.value = [];
    imagenesPreview.value = [];
    if (fileInput.value) {
      fileInput.value.value = "";
    }
    emit("publicado");
  } catch (error) {
    console.error("Error al publicar:", error);
    alert("Error al publicar");
  } finally {
    loading.value = false;
  }
};
</script>
