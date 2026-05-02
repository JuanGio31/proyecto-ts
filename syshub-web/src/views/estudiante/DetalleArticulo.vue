<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Botón Volver -->
    <button
      @click="goBack"
      class="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition"
    >
      <span class="text-xl">←</span>
      <span class="font-medium">Volver</span>
    </button>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 text-gray-500">
      Cargando artículo...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-12 text-red-500">
      {{ error }}
    </div>

    <!-- Artículo -->
    <div v-else-if="articulo" class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <!-- Título -->
      <h1 class="text-3xl font-bold text-gray-800 mb-4">
        {{ articulo.titulo }}
      </h1>

      <!-- Autor y Fecha -->
      <div class="flex items-center gap-4 mb-6 text-sm text-gray-500">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
            {{ articulo.autor?.nombre_completo?.charAt(0) || '?' }}
          </div>
          <span class="font-medium text-gray-700">{{ articulo.autor?.nombre_completo }}</span>
        </div>
        <span>·</span>
        <span v-if="articulo.autor?.carrera">{{ articulo.autor.carrera.nombre_carrera }}</span>
        <span>·</span>
        <span>{{ formatFecha(articulo.fecha_publicacion) }}</span>
      </div>

      <!-- Etiquetas -->
      <div v-if="articulo.etiquetas && articulo.etiquetas.length > 0" class="flex flex-wrap gap-2 mb-6">
        <span
          v-for="tag in articulo.etiquetas"
          :key="tag.id_etiqueta"
          class="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
        >
          #{{ tag.nombre_etiqueta }}
        </span>
      </div>

      <!-- Contenido -->
      <div
        class="prose max-w-none"
        v-html="articulo.contenido"
      ></div>

      <!-- Likes/Dislikes -->
      <div class="flex items-center gap-6 mt-8 pt-6 border-t border-gray-100 text-gray-500">
        <button
          @click="toggleLike"
          class="flex items-center gap-2 hover:text-blue-500 transition"
          :class="userReaction === 'like' ? 'text-blue-500' : ''"
        >
          <ArrowBigUp class="text-xl" />
          <span class="text-sm font-medium">{{ likes }}</span>
        </button>
        <button
          @click="toggleDislike"
          class="flex items-center gap-2 hover:text-red-500 transition"
          :class="userReaction === 'dislike' ? 'text-red-500' : ''"
        >
          <ArrowBigDown class="text-xl" />
          <span class="text-sm font-medium">{{ dislikes }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowBigUp, ArrowBigDown } from "@boxicons/vue";
import { articulosService } from "../../services/articulos.services";

const route = useRoute();
const router = useRouter();

interface Articulo {
  id_articulo: number;
  titulo: string;
  contenido: string;
  fecha_publicacion: string;
  autor: {
    nombre_completo: string;
    carrera?: { nombre_carrera: string };
  };
  etiquetas: { id_etiqueta: number; nombre_etiqueta: string }[];
}

const articulo = ref<Articulo | null>(null);
const loading = ref(true);
const error = ref("");
const likes = ref(0);
const dislikes = ref(0);
const userReaction = ref<"like" | "dislike" | null>(null);

const goBack = () => {
  router.back();
};

const formatFecha = (fecha?: string) => {
  if (!fecha) return "";
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const loadArticulo = async () => {
  const id = Number(route.params.id);
  if (!id) {
    error.value = "ID de artículo inválido";
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    articulo.value = await articulosService.getById(id);
    
    // Cargar reacciones
    const reactions = await articulosService.getReactions(id);
    likes.value = reactions.likes;
    dislikes.value = reactions.dislikes;
    
    const myReaction = await articulosService.getMyReaction(id);
    userReaction.value = myReaction.reaction;
  } catch (err: any) {
    console.error("Error al cargar:", err);
    error.value = "Error al cargar el artículo";
  } finally {
    loading.value = false;
  }
};

const toggleLike = async () => {
  if (!articulo.value) return;
  try {
    if (userReaction.value === "like") {
      const result = await articulosService.removeReaction(articulo.value.id_articulo);
      userReaction.value = null;
      likes.value = result.likes;
      dislikes.value = result.dislikes;
    } else {
      const result = await articulosService.toggleLike(articulo.value.id_articulo);
      userReaction.value = "like";
      likes.value = result.likes;
      dislikes.value = result.dislikes;
    }
  } catch (err) {
    console.error("Error:", err);
  }
};

const toggleDislike = async () => {
  if (!articulo.value) return;
  try {
    if (userReaction.value === "dislike") {
      const result = await articulosService.removeReaction(articulo.value.id_articulo);
      userReaction.value = null;
      likes.value = result.likes;
      dislikes.value = result.dislikes;
    } else {
      const result = await articulosService.toggleDislike(articulo.value.id_articulo);
      userReaction.value = "dislike";
      likes.value = result.likes;
      dislikes.value = result.dislikes;
    }
  } catch (err) {
    console.error("Error:", err);
  }
};

onMounted(() => {
  loadArticulo();
});
</script>

<style scoped>
.prose :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
.prose :deep(h1), .prose :deep(h2), .prose :deep(h3) {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: bold;
}
.prose :deep(p) {
  margin-bottom: 1em;
  line-height: 1.7;
}
.prose :deep(ul), .prose :deep(ol) {
  margin-left: 1.5em;
  margin-bottom: 1em;
}
.prose :deep(a) {
  color: #4f46e5;
  text-decoration: underline;
}
.prose :deep(blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1em;
  font-style: italic;
  color: #6b7280;
}
</style>