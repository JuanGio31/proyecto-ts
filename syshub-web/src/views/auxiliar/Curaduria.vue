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
    </div>

    <!-- Filtros de Control -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <option v-for="c in misCursos" :key="c.id_curso" :value="c.id_curso">
          {{ c.nombre_curso }}
        </option>
      </select>
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
            <th class="px-6 py-4 text-center">Archivo</th>
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
              {{ tarea.curso.nombre_curso }}
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="h in tarea.herramientas"
                  :key="h.id_herramienta"
                  class="px-2 py-0.5 bg-white border border-gray-200 text-gray-500 rounded text-[10px] font-bold uppercase"
                >
                  {{ h.nombre }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 text-center">
              <button
                v-if="tarea.url_archivo"
                @click="openModalDetalle(tarea)"
                class="px-3 py-1.5 bg-indigo-100 text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-200 transition-colors"
              >
                Ver
              </button>
              <span v-else class="text-gray-400 text-xs">-</span>
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-center items-center">
                <button
                  @click="toggleDestacado(tarea)"
                  class="p-2 transition-transform active:scale-125 hover:bg-gray-100 rounded-lg"
                  :title="
                    tarea.es_destacado
                      ? 'Quitar de la Biblioteca'
                      : 'Destacar Proyecto'
                  "
                >
                  <Star
                    :class="
                      tarea.es_destacado
                        ? 'text-amber-400 fill-current'
                        : 'text-gray-300'
                    "
                    pack="filled"
                  />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Detalle del Recurso -->
    <div v-if="showModalDetalle" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-800">Detalle del Recurso</h2>
          <button @click="closeModalDetalle" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div v-if="recursoSeleccionado" class="p-6 space-y-4">
          <div>
            <h3 class="text-lg font-bold text-gray-800">{{ recursoSeleccionado.titulo }}</h3>
            <p class="text-sm text-indigo-500 font-medium">Estudiante: {{ recursoSeleccionado.usuario.nombre }}</p>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-600">Curso:</p>
            <p class="text-gray-700">{{ recursoSeleccionado.curso.nombre_curso }}</p>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-600">Descripción:</p>
            <p class="text-gray-700">{{ recursoSeleccionado.descripcion }}</p>
          </div>
          <div v-if="recursoSeleccionado.herramientas && recursoSeleccionado.herramientas.length > 0">
            <p class="text-sm font-semibold text-gray-600">Herramientas:</p>
            <div class="flex flex-wrap gap-1 mt-1">
              <span
                v-for="h in recursoSeleccionado.herramientas"
                :key="h.id_herramienta"
                class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
              >
                {{ h.nombre }}
              </span>
            </div>
          </div>
          <div v-if="recursoSeleccionado.herramientas_adicionales">
            <p class="text-sm font-semibold text-gray-600">Recursos adicionales:</p>
            <p class="text-gray-700">{{ recursoSeleccionado.herramientas_adicionales }}</p>
          </div>
          <div v-if="recursoSeleccionado.etiquetas && recursoSeleccionado.etiquetas.length > 0">
            <p class="text-sm font-semibold text-gray-600">Etiquetas:</p>
            <div class="flex flex-wrap gap-1 mt-1">
              <span
                v-for="tag in recursoSeleccionado.etiquetas"
                :key="tag.id_etiqueta"
                class="text-xs text-indigo-500"
              >
                #{{ tag.nombre }}
              </span>
            </div>
          </div>
          <div class="pt-4 border-t border-gray-100">
            <p class="text-sm font-semibold text-gray-600 mb-2">Archivo:</p>
            <a
              v-if="recursoSeleccionado.url_archivo"
              :href="getRecursoUrl(recursoSeleccionado.url_archivo)"
              target="_blank"
              class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <span>Descargar Archivo</span>
            </a>
            <span v-else class="text-gray-400">Sin archivo</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Star } from "@boxicons/vue";
import { ref, computed, onMounted } from "vue";
import { recursosService } from "../../services/recursos.services";
import api from "../../services/api";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

interface Tarea {
  id_recurso: number;
  titulo: string;
  descripcion: string;
  usuario: { nombre: string };
  curso: { id_curso: number; nombre_curso: string };
  herramientas: { id_herramienta: number; nombre: string }[];
  herramientas_adicionales?: string;
  etiquetas: { id_etiqueta: number; nombre: string }[];
  es_destacado: boolean;
  url_archivo: string;
  fecha_publicacion: string;
}

const filtro = ref({
  texto: "",
  curso: "todos",
});

const misCursos = ref<{ id_curso: number; nombre_curso: string }[]>([]);
const tareas = ref<Tarea[]>([]);
const loading = ref(true);
const currentUserId = ref<number | null>(null);

const showModalDetalle = ref(false);
const recursoSeleccionado = ref<Tarea | null>(null);

const cargarDatos = async () => {
  try {
    loading.value = true;
    const [userRes, misCursosRes, recursosData] = await Promise.all([
      api.get("/auth/me"),
      api.get("/usuarios/me/cursos"),
      recursosService.getAll(),
    ]);
    currentUserId.value = userRes.data.id_usuario;
    misCursos.value = misCursosRes.data;
    const misCursosIds = misCursos.value.map(c => c.id_curso);
    
    tareas.value = recursosData.filter((r: any) => 
      r.curso && r.curso.id_curso && misCursosIds.includes(r.curso.id_curso) &&
      r.usuario && r.usuario.id_usuario !== currentUserId.value
    ).map((r: any) => ({
      id_recurso: r.id_recurso,
      titulo: r.titulo,
      descripcion: r.descripcion || '',
      usuario: { nombre: r.usuario?.nombre_completo || r.usuario?.nombre || 'Unknown' },
      curso: { id_curso: r.curso.id_curso, nombre_curso: r.curso.nombre_curso },
      herramientas: r.herramientas || [],
      herramientas_adicionales: r.herramientas_adicionales || '',
      etiquetas: r.etiquetas || [],
      es_destacado: r.es_destacado,
      url_archivo: r.url_archivo || '',
      fecha_publicacion: r.fecha_publicacion || '',
    })) as Tarea[];
  } catch (error) {
    console.error("Error al cargar datos:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  cargarDatos();
});

const tareasFiltradas = computed(() => {
  return tareas.value.filter((t) => {
    const matchTxt =
      t.titulo.toLowerCase().includes(filtro.value.texto.toLowerCase()) ||
      t.usuario?.nombre?.toLowerCase().includes(filtro.value.texto.toLowerCase());
    const matchCur =
      filtro.value.curso === "todos" ||
      t.curso?.id_curso === Number(filtro.value.curso);
    return matchTxt && matchCur;
  });
});

const toggleDestacado = async (tarea: Tarea) => {
  try {
    const updated = await recursosService.toggleDestacado(tarea.id_recurso);
    tarea.es_destacado = updated.es_destacado;
  } catch (error) {
    console.error("Error al cambiar estado de destacado:", error);
  }
};

const getRecursoUrl = (nombreArchivo: string) => {
  return `${apiUrl.replace("/api/v1", "")}/uploads/recursos/${nombreArchivo}`;
};

const openModalDetalle = (tarea: Tarea) => {
  recursoSeleccionado.value = tarea;
  showModalDetalle.value = true;
};

const closeModalDetalle = () => {
  showModalDetalle.value = false;
  recursoSeleccionado.value = null;
};
</script>
