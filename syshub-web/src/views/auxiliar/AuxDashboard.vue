<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-indigo-600">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Dashboard del Auxiliar</h1>
        <p class="text-gray-500 text-sm">Resumen de tus actividades</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-indigo-100 rounded-lg">
            <BookOpen size="24" fill="#4f46e5" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Mis Cursos</p>
            <p class="text-2xl font-bold text-gray-800">{{ misCursos.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-green-100 rounded-lg">
            <Group size="24" fill="#16a34a" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Estudiantes</p>
            <p class="text-2xl font-bold text-gray-800">{{ totalEstudiantes }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-amber-100 rounded-lg">
            <Folder size="24" fill="#d97706" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Proyectos</p>
            <p class="text-2xl font-bold text-gray-800">{{ totalProyectos }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-purple-100 rounded-lg">
            <Star size="24" fill="#9333ea" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Proyectos Destacados</p>
            <p class="text-2xl font-bold text-gray-800">{{ proyectosDestacados }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Accesos Rápidos</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link
          to="/materias"
          class="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition"
        >
          <div class="p-2 bg-indigo-100 rounded-lg">
            <BookOpen size="20" fill="#4f46e5" />
          </div>
          <div>
            <p class="font-medium text-gray-800">Mis Materias</p>
            <p class="text-sm text-gray-500">Ver recursos de mis cursos</p>
          </div>
        </router-link>

        <router-link
          to="/curaduria"
          class="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition"
        >
          <div class="p-2 bg-amber-100 rounded-lg">
            <Star size="20" fill="#d97706" />
          </div>
          <div>
            <p class="font-medium text-gray-800">Curaduría</p>
            <p class="text-sm text-gray-500">Gestionar proyectos</p>
          </div>
        </router-link>

        <router-link
          to="/gestion-estudiantes"
          class="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition"
        >
          <div class="p-2 bg-green-100 rounded-lg">
            <Group size="20" fill="#16a34a" />
          </div>
          <div>
            <p class="font-medium text-gray-800">Estudiantes</p>
            <p class="text-sm text-gray-500">Ver estudiantes inscritos</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Mis Cursos Recientes -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Mis Cursos</h2>
      <div v-if="loading" class="text-center py-4 text-gray-500">Cargando...</div>
      <div v-else-if="misCursos.length === 0" class="text-center py-4 text-gray-500">
        No tienes cursos asignados
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="curso in misCursos"
          :key="curso.id_curso"
          class="p-4 rounded-lg border border-gray-200 hover:border-indigo-500 transition"
        >
          <h3 class="font-bold text-gray-800">{{ curso.nombre_curso }}</h3>
          <p class="text-sm text-gray-500">{{ curso.codigo_curso }}</p>
          <div class="mt-2 flex gap-2">
            <span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
              {{ getEstudiantesPorCurso(curso.id_curso) }} estudiantes
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { BookOpen, Group, Folder, Star } from "@boxicons/vue";
import api from "../../services/api";

const loading = ref(true);
const misCursos = ref<any[]>([]);
const estudiantes = ref<any[]>([]);
const proyectos = ref<any[]>([]);

const loadData = async () => {
  try {
    loading.value = true;
    const [cursosRes, estudiantesRes, proyectosRes] = await Promise.all([
      api.get("/usuarios/me/cursos"),
      api.get("/usuarios/me/estudiantes"),
      api.get("/recursos"),
    ]);
    misCursos.value = cursosRes.data;
    estudiantes.value = estudiantesRes.data;
    proyectos.value = proyectosRes.data;
  } catch (err) {
    console.error("Error al cargar datos:", err);
  } finally {
    loading.value = false;
  }
};

const totalEstudiantes = computed(() => estudiantes.value.length);

const misCursosIds = computed(() => misCursos.value.map(c => c.id_curso));

const totalProyectos = computed(() => {
  return proyectos.value.filter(p => 
    p.curso && misCursosIds.value.includes(p.curso.id_curso)
  ).length;
});

const proyectosDestacados = computed(() => {
  return proyectos.value.filter(p => 
    p.curso && misCursosIds.value.includes(p.curso.id_curso) && p.es_destacado
  ).length;
});

const getEstudiantesPorCurso = (cursoId: number) => {
  return estudiantes.value.filter(e => e.curso?.id_curso === cursoId).length;
};

onMounted(() => {
  loadData();
});
</script>