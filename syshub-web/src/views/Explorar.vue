<template>
  <div class="max-w-4xl mx-auto min-h-screen">
    <!-- Solo input de búsqueda -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar..."
        class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
      />
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="flex border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-1 px-4 py-3 font-semibold text-sm transition-colors relative"
          :class="activeTab === tab.id ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'"
        >
          {{ tab.label }}
          <span v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></span>
          <span
            v-if="getCount(tab.id) > 0"
            class="ml-1 text-xs text-gray-400"
          >
            ({{ getCount(tab.id) }})
          </span>
        </button>
      </div>

      <!-- Contenido por Tab -->
      <div class="p-4">
        <!-- Tab: Recursos (con curso) -->
        <div v-if="activeTab === 'recursos'">
          <div v-if="loading" class="text-center py-8 text-gray-500">Cargando...</div>
          <div v-else-if="recursosFiltrados.length === 0" class="text-center py-8 text-gray-500">
            No se encontraron recursos
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="item in recursosFiltrados"
              :key="item.id_recurso"
              class="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-gray-800">{{ item.titulo }}</span>
                    <span v-if="item.es_destacado" class="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded"><Star class="text-xs" /> Destacado</span>
                    <span v-if="item.curso" class="flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded"><Book class="text-xs" /> {{ item.curso.nombre_curso }}</span>
                  </div>
                  <p class="text-sm text-gray-600 mt-1">{{ item.descripcion }}</p>
                  <p class="text-xs text-gray-400 mt-1">Por: {{ item.usuario?.nombre_completo || item.usuario?.nombre }}</p>
                  <div class="flex flex-wrap gap-1 mt-2">
                    <span v-for="h in item.herramientas" :key="h.id_herramienta || h" class="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                      {{ typeof h === 'string' ? h : h.nombre }}
                    </span>
                  </div>
                </div>
                <a v-if="item.url_archivo" :href="getRecursoUrl(item.url_archivo)" target="_blank" class="text-indigo-600 text-sm">Descargar</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Hallazgos (recursos sin curso) -->
        <div v-if="activeTab === 'hallazgos'">
          <div v-if="loading" class="text-center py-8 text-gray-500">Cargando...</div>
          <div v-else-if="hallazgosFiltrados.length === 0" class="text-center py-8 text-gray-500">
            No se encontraron hallazgos
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="item in hallazgosFiltrados"
              :key="item.id_recurso"
              class="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-gray-800">{{ item.titulo }}</span>
                    <span class="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded"><Brain class="text-xs" /> Hallazgo</span>
                  </div>
                  <p class="text-sm text-gray-600 mt-1">{{ item.descripcion }}</p>
                  <p class="text-xs text-gray-400 mt-1">Por: {{ item.usuario?.nombre_completo || item.usuario?.nombre }}</p>
                  <div class="flex flex-wrap gap-1 mt-2">
                    <span v-for="tag in item.etiquetas" :key="tag.id_etiqueta || tag" class="text-xs text-indigo-500">
                      #{{ typeof tag === 'string' ? tag : tag.nombre }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Posts -->
        <div v-if="activeTab === 'posts'">
          <div v-if="loadingPosts" class="text-center py-8 text-gray-500">Cargando...</div>
          <div v-else-if="postsFiltrados.length === 0" class="text-center py-8 text-gray-500">
            No se encontraron posts
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="post in postsFiltrados"
              :key="post.id_post"
              class="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition"
            >
              <div class="flex items-center gap-2 mb-2">
                <span class="font-bold text-gray-800">{{ post.autor?.nombre_completo || post.autor?.nombre }}</span>
                <span class="text-xs text-gray-400">{{ formatFecha(post.fecha_creacion) }}</span>
              </div>
              <p class="text-gray-700">{{ post.contenido }}</p>
            </div>
          </div>
        </div>

        <!-- Tab: Articulos -->
        <div v-if="activeTab === 'articulos'">
          <div v-if="loadingArticulos" class="text-center py-8 text-gray-500">Cargando...</div>
          <div v-else-if="articulosFiltrados.length === 0" class="text-center py-8 text-gray-500">
            No se encontraron artículos
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="articulo in articulosFiltrados"
              :key="articulo.id_articulo"
              @click="verArticulo(articulo.id_articulo)"
              class="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition cursor-pointer"
            >
              <div class="flex items-center gap-2 mb-2">
                <span class="font-bold text-gray-800">{{ articulo.titulo }}</span>
                <span v-if="articulo.esta_publicado" class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Publicado</span>
              </div>
              <p class="text-sm text-gray-600">{{ articulo.resumen }}</p>
              <p class="text-xs text-gray-400 mt-1">Por: {{ articulo.autor?.nombre_completo || articulo.autor?.nombre }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Brain, Book, Star } from "@boxicons/vue";
import { recursosService } from "../services/recursos.services";
import api from "../services/api";

const router = useRouter();
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

// Data
const recursos = ref<any[]>([]);
const posts = ref<any[]>([]);
const articulos = ref<any[]>([]);

const loading = ref(true);
const loadingPosts = ref(true);
const loadingArticulos = ref(true);

// Filtros
const searchQuery = ref("");
const activeTab = ref("recursos");

const tabs = [
  { id: "recursos", label: "Recursos" },
  { id: "hallazgos", label: "Hallazgos" },
  { id: "posts", label: "Posts" },
  { id: "articulos", label: "Artículos" },
];

// Computed
const recursosFiltrados = computed(() => {
  return recursos.value.filter(r => {
    if (!r.es_destacado) return false;
    return matchesSearch(r.titulo, r.descripcion, r.herramientas, r.etiquetas);
  });
});

const hallazgosFiltrados = computed(() => {
  return recursos.value.filter(r => {
    if (r.curso) return false;
    return matchesSearch(r.titulo, r.descripcion, r.herramientas, r.etiquetas);
  });
});

const postsFiltrados = computed(() => {
  return posts.value.filter(p => {
    return matchesSearch(p.contenido, p.contenido, [], []);
  });
});

const articulosFiltrados = computed(() => {
  return articulos.value.filter(a => {
    return matchesSearch(a.titulo, a.resumen, [], []);
  });
});

// Helpers
const matchesSearch = (titulo: string, desc: string, herramientas: any[], etiquetas: any[]) => {
  if (!searchQuery.value) return true;
  const search = searchQuery.value.toLowerCase();
  return titulo?.toLowerCase().includes(search) || 
         desc?.toLowerCase().includes(search) ||
         herramientas?.some((h: any) => (typeof h === 'string' ? h : h.nombre)?.toLowerCase().includes(search)) ||
         etiquetas?.some((e: any) => (typeof e === 'string' ? e : e.nombre)?.toLowerCase().includes(search));
};

const getCount = (tabId: string) => {
  if (tabId === "recursos") return recursosFiltrados.value.length;
  if (tabId === "hallazgos") return hallazgosFiltrados.value.length;
  if (tabId === "posts") return postsFiltrados.value.length;
  if (tabId === "articulos") return articulosFiltrados.value.length;
  return 0;
};

const getRecursoUrl = (nombreArchivo: string) => {
  return `${apiUrl.replace("/api/v1", "")}/uploads/recursos/${nombreArchivo}`;
};

const verArticulo = (id: number) => {
  router.push(`/articulos/${id}`);
};

const formatFecha = (f: string | undefined) => {
  if (!f) return '';
  try {
    return new Date(f).toLocaleDateString("es-ES", { month: "short", day: "numeric" });
  } catch {
    return '';
  }
};

// Carga de datos
const loadData = async () => {
  try {
    loading.value = true;
    loadingPosts.value = true;
    loadingArticulos.value = true;

    const [recursosRes, postsRes, articulosRes] = await Promise.all([
      recursosService.getAll(),
      api.get("/posts"),
      api.get("/articulos"),
    ]);

    recursos.value = recursosRes;
    posts.value = postsRes.data;
    articulos.value = articulosRes.data;
  } catch (error) {
    console.error("Error al cargar datos:", error);
  } finally {
    loading.value = false;
    loadingPosts.value = false;
    loadingArticulos.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped></style>