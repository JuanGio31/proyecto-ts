<template>
  <div class="max-w-4xl mx-auto space-y-4">
    <!-- CardPerfil -->
    <div class="bg-white border border-gray-200 p-6 rounded-2xl">
      <CardPerfil />
    </div>

    <!-- Tabs para estudiante -->
    <div v-if="esEstudiante" class="bg-white border border-gray-200 rounded-2xl">
      <!-- Navegación de tabs -->
      <div class="flex border-b border-gray-200 overflow-x-auto">
        <button
          v-for="tab in tabsEstudiante"
          :key="tab.id"
          @click="tabActivo = tab.id"
          :class="[
            'px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors',
            tabActivo === tab.id
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Contenido de tabs -->
      <div class="p-4">
        <!-- Publicaciones -->
        <div v-if="tabActivo === 'publicaciones'">
          <div v-if="loading" class="text-center py-8 text-gray-500">Cargando...</div>
          <div v-else-if="misPosts.length === 0" class="text-center py-8 text-gray-500">
            No has publicado nada aún
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="post in misPosts"
              :key="post.id_post"
              class="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer"
              @click="verPost(post)"
            >
              <p class="text-gray-800 line-clamp-2">{{ post.contenido }}</p>
              <p class="text-xs text-gray-400 mt-2">{{ formatFecha(post.fecha_publicacion) }}</p>
            </div>
          </div>
        </div>

        <!-- Likes/Dislikes -->
        <div v-else-if="tabActivo === 'likes'">
          <div v-if="loading" class="text-center py-8 text-gray-500">Cargando...</div>
          <div v-else-if="misLikesPosts.length === 0 && misLikesArticulos.length === 0" class="text-center py-8 text-gray-500">
            No has dado like o dislike a nada aún
          </div>
          <div v-else class="space-y-4">
            <div v-if="misLikesPosts.length > 0">
              <h3 class="text-sm font-medium text-gray-500 mb-2">Posts</h3>
              <div
                v-for="post in misLikesPosts"
                :key="post.id_post"
                class="p-3 border border-gray-100 rounded-lg"
              >
                <div class="flex items-center gap-2 mb-1">
                  <span
                    :class="[
                      'flex items-center gap-1 text-xs px-2 py-0.5 rounded-full',
                      post.reaction === 'like' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    ]"
                  >
                    <ArrowBigUp v-if="post.reaction === 'like'" class="text-sm" />
                    <ArrowBigDown v-else class="text-sm" />
                    {{ post.reaction === 'like' ? 'Like' : 'Dislike' }}
                  </span>
                </div>
                <p class="text-gray-800 text-sm line-clamp-2">{{ post.contenido }}</p>
                <p class="text-xs text-gray-400 mt-1">Por {{ post.autor?.nombre_completo }}</p>
              </div>
            </div>
            <div v-if="misLikesArticulos.length > 0">
              <h3 class="text-sm font-medium text-gray-500 mb-2 mt-4">Artículos</h3>
              <div
                v-for="articulo in misLikesArticulos"
                :key="articulo.id_articulo"
                class="p-3 border border-gray-100 rounded-lg"
              >
                <div class="flex items-center gap-2 mb-1">
                  <span
                    :class="[
                      'flex items-center gap-1 text-xs px-2 py-0.5 rounded-full',
                      articulo.reaction === 'like' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    ]"
                  >
                    <ArrowBigUp v-if="articulo.reaction === 'like'" class="text-sm" />
                    <ArrowBigDown v-else class="text-sm" />
                    {{ articulo.reaction === 'like' ? 'Like' : 'Dislike' }}
                  </span>
                </div>
                <p class="text-gray-800 font-medium">{{ articulo.titulo }}</p>
                <p class="text-xs text-gray-400 mt-1">Por {{ articulo.autor?.nombre_completo }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Comentarios -->
        <div v-else-if="tabActivo === 'comentarios'">
          <div v-if="loading" class="text-center py-8 text-gray-500">Cargando...</div>
          <div v-else-if="misComentariosPosts.length === 0 && misComentariosArticulos.length === 0" class="text-center py-8 text-gray-500">
            No has comentado nada aún
          </div>
          <div v-else class="space-y-4">
            <div v-if="misComentariosPosts.length > 0">
              <h3 class="text-sm font-medium text-gray-500 mb-2">Respuestas a Posts</h3>
              <div
                v-for="comentario in misComentariosPosts"
                :key="comentario.id_post"
                class="p-3 border border-gray-100 rounded-lg"
              >
                <p class="text-gray-800 text-sm line-clamp-2">{{ comentario.contenido }}</p>
                <p class="text-xs text-gray-400 mt-1">
                  En respuesta a post de {{ comentario.postRespuesta?.autor?.nombre_completo }}
                  · {{ formatFecha(comentario.fecha_publicacion) }}
                </p>
              </div>
            </div>
            <div v-if="misComentariosArticulos.length > 0">
              <h3 class="text-sm font-medium text-gray-500 mb-2 mt-4">Comentarios en Artículos</h3>
              <div
                v-for="comentario in misComentariosArticulos"
                :key="comentario.id_comentario"
                class="p-3 border border-gray-100 rounded-lg"
              >
                <p class="text-gray-800 text-sm line-clamp-2">{{ comentario.contenido }}</p>
                <p class="text-xs text-gray-400 mt-1">
                  En: {{ comentario.articulo?.titulo }} · {{ formatFecha(comentario.fecha_creacion) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Proyectos -->
        <div v-else-if="tabActivo === 'proyectos'">
          <div v-if="loading" class="text-center py-8 text-gray-500">Cargando...</div>
          <div v-else-if="misRecursos.length === 0" class="text-center py-8 text-gray-500">
            No has subido ningún proyecto aún
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="recurso in misRecursos"
              :key="recurso.id_recurso"
              class="p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
            >
              <h3 class="font-medium text-gray-800">{{ recurso.titulo }}</h3>
              <p class="text-sm text-gray-500 line-clamp-2 mt-1">{{ recurso.descripcion }}</p>
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="etiqueta in recurso.etiquetas"
                  :key="etiqueta.id_etiqueta"
                  class="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                >
                  #{{ etiqueta.nombre_etiqueta }}
                </span>
              </div>
              <p class="text-xs text-gray-400 mt-2">{{ formatFecha(recurso.fecha_publicacion) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Para auxiliar -->
    <div v-else-if="esAuxiliar" class="bg-white border border-gray-200 rounded-2xl p-4">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Recursos Creados</h2>
      <div v-if="loading" class="text-center py-8 text-gray-500">Cargando...</div>
      <div v-else-if="misRecursos.length === 0" class="text-center py-8 text-gray-500">
        No has subido ningún recurso aún
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="recurso in misRecursos"
          :key="recurso.id_recurso"
          class="p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
        >
          <div class="flex items-start justify-between">
            <h3 class="font-medium text-gray-800">{{ recurso.titulo }}</h3>
            <span
              v-if="recurso.es_destacado"
              class="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded"
            >
              ⭐ Destacado
            </span>
          </div>
          <p class="text-sm text-gray-500 line-clamp-2 mt-1">{{ recurso.descripcion }}</p>
          <p class="text-xs text-gray-400 mt-2">{{ formatFecha(recurso.fecha_publicacion) }}</p>
        </div>
      </div>
    </div>

    <!-- Para admin: solo CardPerfil -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import CardPerfil from "../components/CardPerfil.vue";
import { ArrowBigUp, ArrowBigDown } from "@boxicons/vue";
import { postsService } from "../services/posts.services";
import { articulosService } from "../services/articulos.services";
import { recursosService } from "../services/recursos.services";

const authStore = useAuthStore();

const esEstudiante = computed(() => authStore.user?.rol?.nombre_rol === "estudiante");
const esAuxiliar = computed(() => authStore.user?.rol?.nombre_rol === "auxiliar");

const tabActivo = ref("publicaciones");
const loading = ref(false);

const tabsEstudiante = [
  { id: "publicaciones", label: "Publicaciones" },
  { id: "likes", label: "Likes/Dislikes" },
  { id: "comentarios", label: "Comentarios" },
  { id: "proyectos", label: "Proyectos" },
];

const misPosts = ref<any[]>([]);
const misLikesPosts = ref<any[]>([]);
const misLikesArticulos = ref<any[]>([]);
const misComentariosPosts = ref<any[]>([]);
const misComentariosArticulos = ref<any[]>([]);
const misRecursos = ref<any[]>([]);

const loadDataEstudiante = async () => {
  loading.value = true;
  try {
    const [posts, likesPosts, likesArticulos, comentariosPosts, comentariosArticulos, recursos] = await Promise.all([
      postsService.getMyPosts(),
      postsService.getMyLikes(),
      articulosService.getMyLikes(),
      postsService.getMyComments(),
      articulosService.getMyComments(),
      recursosService.getMyRecursos(),
    ]);
    misPosts.value = posts;
    misLikesPosts.value = likesPosts;
    misLikesArticulos.value = likesArticulos;
    misComentariosPosts.value = comentariosPosts;
    misComentariosArticulos.value = comentariosArticulos;
    misRecursos.value = recursos;
  } catch (error) {
    console.error("Error al cargar datos:", error);
  } finally {
    loading.value = false;
  }
};

const loadDataAuxiliar = async () => {
  loading.value = true;
  try {
    const recursos = await recursosService.getMyRecursos();
    misRecursos.value = recursos;
  } catch (error) {
    console.error("Error al cargar datos:", error);
  } finally {
    loading.value = false;
  }
};

const formatFecha = (fecha?: string) => {
  if (!fecha) return "";
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const verPost = (post: any) => {
  console.log("Ver post:", post);
};

onMounted(async () => {
  if (esEstudiante.value) {
    await loadDataEstudiante();
  } else if (esAuxiliar.value) {
    await loadDataAuxiliar();
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>