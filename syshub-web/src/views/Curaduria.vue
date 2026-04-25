<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <!-- Header Enfocado en Tareas -->
    <div
      class="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-indigo-600"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800">
          Panel de Tareas Recibidas
        </h1>
        <p class="text-gray-500">
          Revisa las entregas de los cursos y destaca los proyectos de
          referencia.
        </p>
      </div>
      <div class="flex gap-2">
        <div
          class="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600"
        >
          Solo Proyectos de Clase
        </div>
      </div>
    </div>

    <!-- Filtros de Control -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        v-model="filtro.texto"
        type="text"
        placeholder="Buscar por título o alumno..."
        class="px-4 py-2.5 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none border"
      />
      <select
        v-model="filtro.curso"
        class="px-4 py-2.5 rounded-xl border-gray-200 outline-none border"
      >
        <option value="todos">Todos los Cursos</option>
        <option v-for="c in cursosDisponibles" :key="c.id" :value="c.id">
          {{ c.nombre }}
        </option>
      </select>
      <button
        @click="filtro.soloPendientes = !filtro.soloPendientes"
        :class="
          filtro.soloPendientes
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-600'
        "
        class="px-4 py-2.5 rounded-xl border border-gray-200 transition-all font-semibold"
      >
        {{ filtro.soloPendientes ? "Viendo Pendientes" : "Ver Todos" }}
      </button>
    </div>

    <!-- Lista de Entregas -->
    <div
      class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <table class="w-full text-left">
        <thead
          class="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wider"
        >
          <tr>
            <th class="px-6 py-4">Estudiante / Proyecto</th>
            <th class="px-6 py-4">Curso Relacionado</th>
            <th class="px-6 py-4">Herramientas</th>
            <th class="px-6 py-4 text-center">Curaduría</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="tarea in tareasFiltradas"
            :key="tarea.id_recurso"
            class="hover:bg-indigo-50/30 transition-colors"
          >
            <td class="px-6 py-4">
              <div class="font-bold text-gray-700">{{ tarea.titulo }}</div>
              <div class="text-xs text-indigo-500 font-medium">
                {{ tarea.usuario.nombre }}
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ tarea.curso.nombre }}
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="h in tarea.herramientas"
                  :key="h.id"
                  class="px-2 py-0.5 bg-white border border-gray-200 text-gray-500 rounded text-[10px] font-bold uppercase"
                >
                  {{ h.nombre }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-center items-center gap-4">
                <button
                  @click="toggleDestacado(tarea)"
                  class="transition-transform active:scale-125"
                  :title="
                    tarea.es_destacado
                      ? 'Quitar de la Biblioteca'
                      : 'Destacar Proyecto'
                  "
                >
                  <svg
                    xmlns="http://w3.org"
                    class="h-7 w-7"
                    :class="
                      tarea.es_destacado
                        ? 'text-amber-400 fill-current'
                        : 'text-gray-200 outline-none'
                    "
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="none"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </button>
                <a
                  :href="tarea.url_archivo"
                  class="p-2 hover:bg-white rounded-full text-indigo-400"
                >
                  <svg
                    xmlns="http://w3.org"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface Tarea {
  id_recurso: number;
  titulo: string;
  usuario: { nombre: string };
  curso: { id: number; nombre: string };
  herramientas: { id: number; nombre: string }[];
  es_destacado: boolean;
  url_archivo: string;
}

const filtro = ref({
  texto: "",
  curso: "todos",
  soloPendientes: false,
});

const cursosDisponibles = ref([
  { id: 101, nombre: "Resistencia de Materiales" },
  { id: 102, nombre: "Análisis Estructural" },
]);

// Solo cargamos datos que tengan id_curso (Tareas)
const tareas = ref<Tarea[]>([
  {
    id_recurso: 1,
    titulo: "Proyecto Final Puentes",
    usuario: { nombre: "Marcos Sosa" },
    curso: { id: 101, nombre: "Resistencia de Materiales" },
    herramientas: [{ id: 1, nombre: "sap2000" }],
    es_destacado: true,
    url_archivo: "#",
  },
]);

const tareasFiltradas = computed(() => {
  return tareas.value.filter((t) => {
    const matchTxt =
      t.titulo.toLowerCase().includes(filtro.value.texto.toLowerCase()) ||
      t.usuario.nombre.toLowerCase().includes(filtro.value.texto.toLowerCase());
    const matchCur =
      filtro.value.curso === "todos" ||
      t.curso.id === Number(filtro.value.curso);
    const matchPen = !filtro.value.soloPendientes || !t.es_destacado;
    return matchTxt && matchCur && matchPen;
  });
});

const toggleDestacado = (tarea: Tarea) => {
  tarea.es_destacado = !tarea.es_destacado;
  // Lógica de API: PATCH /recursos/:id { es_destacado: true/false }
};
</script>
