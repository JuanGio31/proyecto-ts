<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-indigo-600">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Gestión de Estudiantes</h1>
        <p class="text-gray-500 text-sm">Estudiantes inscritos en mis cursos</p>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-500">Cargando estudiantes...</p>
    </div>

    <div v-else-if="estudiantes.length === 0" class="text-center py-8 bg-white rounded-xl">
      <p class="text-gray-500">No tienes estudiantes en tus cursos</p>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="p-4 border-b border-gray-100">
        <div class="flex items-center gap-4">
          <label class="text-sm font-medium text-gray-700">Filtrar por curso:</label>
          <select
            v-model="cursoFiltro"
            class="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          >
            <option :value="null">Todos los cursos</option>
            <option v-for="curso in misCursos" :key="curso.id_curso" :value="curso.id_curso">
              {{ curso.nombre_curso }} ({{ curso.codigo_curso }})
            </option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nombre</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Registro Académico</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Curso</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="est in estudiantesFiltrados" :key="est.id_usuario" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium text-gray-800">{{ est.nombre_completo }}</td>
              <td class="px-4 py-3 text-gray-600">{{ est.email }}</td>
              <td class="px-4 py-3 text-gray-600 font-mono text-sm">{{ est.registro_academico }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                  {{ est.curso?.nombre_curso }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="estudiantesFiltrados.length === 0" class="p-6 text-center text-gray-500">
        No hay estudiantes en el curso seleccionado
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import api from "../../services/api";

const loading = ref(true);
const estudiantes = ref<any[]>([]);
const misCursos = ref<any[]>([]);
const cursoFiltro = ref<number | null>(null);

const loadData = async () => {
  try {
    loading.value = true;
    const [estudiantesRes, cursosRes] = await Promise.all([
      api.get("/usuarios/me/estudiantes"),
      api.get("/usuarios/me/cursos"),
    ]);
    estudiantes.value = estudiantesRes.data;
    misCursos.value = cursosRes.data;
  } catch (err) {
    console.error("Error al cargar datos:", err);
  } finally {
    loading.value = false;
  }
};

const estudiantesFiltrados = computed(() => {
  if (!cursoFiltro.value) return estudiantes.value;
  return estudiantes.value.filter(est => est.curso?.id_curso === cursoFiltro.value);
});

onMounted(() => {
  loadData();
});
</script>