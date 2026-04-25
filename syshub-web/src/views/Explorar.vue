<template>
  <div
    class="max-w-3xl mx-auto min-h-screen border-x border-gray-100 rounded-xl bg-white"
  >
    <!-- Barra de Búsqueda Sticky -->
    <div
      class="sticky top-0 bg-white/80 backdrop-blur-md z-10 p-4 border-b border-gray-100"
    >
      <div class="relative group">
        <div
          class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500"
        >
          <svg
            xmlns="http://w3.org"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar herramientas, etiquetas o proyectos..."
          class="w-full bg-gray-100 border-none rounded-full py-2.5 pl-12 pr-4 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm"
        />
      </div>

      <!-- Filtros Rápidos (Pestañas tipo Twitter) -->
      <div class="flex mt-4 overflow-x-auto no-scrollbar gap-2">
        <button
          v-for="filtro in filtros"
          :key="filtro.id"
          @click="filtroActivo = filtro.id"
          :class="[
            'px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap border',
            filtroActivo === filtro.id
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50',
          ]"
        >
          {{ filtro.label }}
        </button>
      </div>
    </div>

    <!-- Feed de Resultados -->
    <div class="divide-y divide-gray-100 rounded-2xl">
      <div
        v-for="item in resultadosFiltrados"
        :key="item.id"
        class="p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
      >
        <div class="flex gap-4">
          <!-- Icono según tipo -->
          <div
            class="shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl"
          >
            {{ item.id_curso ? "📚" : "💡" }}
          </div>

          <div class="flex-1">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1">
                <span class="font-bold text-gray-900 hover:underline">{{
                  item.usuario.nombre
                }}</span>
                <span class="text-gray-500 text-sm"
                  >· {{ formatFecha(item.fecha) }}</span
                >
                <!-- Badge de Destacado -->
                <span
                  v-if="item.es_destacado"
                  class="ml-2 bg-amber-100 text-amber-600 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-1"
                >
                  ⭐ TOP
                </span>
              </div>
            </div>

            <h3 class="text-gray-900 font-semibold mt-1">{{ item.titulo }}</h3>
            <p class="text-gray-600 text-sm mt-1 line-clamp-2">
              {{ item.descripcion }}
            </p>

            <!-- Herramientas & Tags -->
            <div class="flex flex-wrap gap-2 mt-3">
              <span
                v-for="h in item.herramientas"
                :key="h"
                class="text-indigo-600 text-sm hover:underline font-medium"
              >
                #{{ h }}
              </span>
              <span
                v-for="tag in item.etiquetas"
                :key="tag"
                class="text-gray-400 text-sm"
              >
                #{{ tag }}
              </span>
            </div>

            <!-- Botones de Acción (Estilo Twitter) -->
            <div class="flex justify-between mt-4 text-gray-500 max-w-xs">
              <button class="hover:text-blue-500 flex items-center gap-2 group">
                <div
                  class="p-2 group-hover:bg-blue-50 rounded-full transition-colors"
                >
                  📂
                </div>
                <span class="text-xs">Ver</span>
              </button>
              <button
                class="hover:text-green-500 flex items-center gap-2 group"
              >
                <div
                  class="p-2 group-hover:bg-green-50 rounded-full transition-colors"
                >
                  🔗
                </div>
                <span class="text-xs">Clonar</span>
              </button>
              <button class="hover:text-red-500 flex items-center gap-2 group">
                <div
                  class="p-2 group-hover:bg-red-50 rounded-full transition-colors"
                >
                  🔖
                </div>
                <span class="text-xs">Guardar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface Resultado {
  id: number;
  titulo: string;
  descripcion: string;
  usuario: { nombre: string };
  herramientas: string[];
  etiquetas: string[];
  es_destacado: boolean;
  id_curso: number | null;
  fecha: string;
}

const searchQuery = ref("");
const filtroActivo = ref("todo");

const filtros = [
  { id: "todo", label: "Todo" },
  { id: "destacados", label: "⭐ Destacados" },
  { id: "tareas", label: "Tareas" },
  { id: "hallazgos", label: "Hallazgos" },
  { id: "herramientas", label: "Por Stack" },
];

const mockData = ref<Resultado[]>([
  {
    id: 1,
    titulo: "Cálculo de Vigas Simples con Python",
    descripcion:
      "Un script que automatiza el cálculo de momentos flectores y esfuerzos cortantes basado en el libro de Hibbeler.",
    usuario: { nombre: "Marcos Sosa" },
    herramientas: ["python", "numpy"],
    etiquetas: ["estructuras", "automatización"],
    es_destacado: true,
    id_curso: 101,
    fecha: "2023-10-25",
  },
  {
    id: 2,
    titulo: "Hallazgo: Atajo para Renderizado Lumion",
    descripcion:
      "Descubrí un plugin que reduce el tiempo de renderizado a la mitad usando presets de iluminación global.",
    usuario: { nombre: "Carla Benítez" },
    herramientas: ["lumion", "sketchup"],
    etiquetas: ["renderizado", "arquitectura"],
    es_destacado: false,
    id_curso: null,
    fecha: "2023-10-24",
  },
]);

const resultadosFiltrados = computed(() => {
  return mockData.value.filter((item) => {
    const matchesSearch =
      item.titulo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.herramientas.some((h) =>
        h.includes(searchQuery.value.toLowerCase()),
      );

    if (filtroActivo.value === "destacados")
      return matchesSearch && item.es_destacado;
    if (filtroActivo.value === "tareas")
      return matchesSearch && item.id_curso !== null;
    if (filtroActivo.value === "hallazgos")
      return matchesSearch && item.id_curso === null;

    return matchesSearch;
  });
});

const formatFecha = (f: string) =>
  new Date(f).toLocaleDateString("es-ES", { month: "short", day: "numeric" });
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
