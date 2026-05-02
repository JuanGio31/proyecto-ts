<template>
  <div class="max-w-6xl mx-auto">
    <div class="bg-white shadow-lg rounded-xl p-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Gestión Académica</h1>
        <div class="flex gap-3">
          <select
            v-model="carreraFiltro"
            class="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          >
            <option :value="null">Todas las carreras</option>
            <option v-for="carrera in carreras" :key="carrera.id_carrera" :value="carrera.id_carrera">
              {{ carrera.nombre_carrera }}
            </option>
          </select>
          <select
            v-model="semestreFiltro"
            class="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          >
            <option :value="null">Todos los semestres</option>
            <option v-for="s in 10" :key="s" :value="s">Semestre {{ s }}</option>
          </select>
          <button
            @click="abrirModalCrear"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
          >
            + Nuevo Curso
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-500">Cargando cursos...</p>
      </div>

      <div v-else-if="cursosFiltrados.length === 0" class="text-center py-8">
        <p class="text-gray-500">No hay cursos registrados</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Código</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nombre</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Semestre</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Auxiliar</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="curso in cursosFiltrados" :key="curso.id_curso" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-gray-600 font-mono">{{ curso.codigo_curso }}</td>
              <td class="px-4 py-3 font-medium text-gray-800">{{ curso.nombre_curso }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {{ curso.semestre }}° Semestre
                </span>
              </td>
              <td class="px-4 py-3">
                <button
                  @click="abrirModalAsignar(curso)"
                  class="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  <span
                    v-if="curso.usuarios?.[0]"
                    class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {{ curso.usuarios[0].nombre_completo }}
                  </span>
                  <span v-else class="text-gray-400 text-xs">Asignar</span>
                </button>
              </td>
              <td class="px-4 py-3">
                <button
                  @click="abrirModalInscripcion(curso)"
                  class="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Gestionar Estudiantes
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Crear Curso -->
    <div v-if="showModalCrear" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showModalCrear = false">
      <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Nuevo Curso</h2>
        <form @submit.prevent="crearCurso" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Código del Curso</label>
            <input v-model="form.codigo_curso" type="text" required class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Nombre del Curso</label>
            <input v-model="form.nombre_curso" type="text" required class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Semestre</label>
            <select v-model="form.semestre" required class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              <option v-for="s in 10" :key="s" :value="s">Semestre {{ s }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Carrera</label>
            <select v-model="form.id_carrera" required class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              <option v-for="carrera in carreras" :key="carrera.id_carrera" :value="carrera.id_carrera">
                {{ carrera.nombre_carrera }}
              </option>
            </select>
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showModalCrear = false" class="px-4 py-2 text-gray-600 hover:text-gray-800 transition">Cancelar</button>
            <button type="submit" :disabled="saving" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50">
              {{ saving ? 'Creando...' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Asignar Auxiliar -->
    <div v-if="showModalAsignar" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showModalAsignar = false">
      <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Asignar Auxiliar a {{ cursoSeleccionado?.nombre_curso }}</h2>
        <div class="space-y-2 max-h-60 overflow-y-auto">
          <label v-for="aux in auxiliares" :key="aux.id_usuario" class="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
            <input type="radio" :value="aux.id_usuario" v-model="auxiliarSeleccionado" class="rounded text-indigo-600" />
            <span>{{ aux.nombre_completo }}</span>
            <span class="text-gray-400 text-sm">@{{ aux.email }}</span>
          </label>
        </div>
        <div class="flex justify-end gap-3 pt-4 mt-4">
          <button type="button" @click="showModalAsignar = false" class="px-4 py-2 text-gray-600 hover:text-gray-800 transition">Cancelar</button>
          <button @click="asignarAuxiliar" :disabled="saving || auxiliarSeleccionado === null" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50">
            {{ saving ? 'Asignando...' : 'Asignar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Inscribir Estudiantes -->
    <div v-if="showModalInscripcion" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showModalInscripcion = false">
      <div class="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl max-h-[80vh] flex flex-col">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Gestionar Estudiantes - {{ cursoSeleccionado?.nombre_curso }}</h2>
        
        <!-- Estudiantes inscritos -->
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-2">Estudiantes Inscritos ({{ estudiantesInscritos.length }})</h3>
          <div v-if="estudiantesInscritos.length === 0" class="text-sm text-gray-500 py-2">No hay estudiantes inscritos</div>
          <div v-else class="max-h-32 overflow-y-auto border border-gray-100 rounded-lg p-2 space-y-1">
            <div v-for="est in estudiantesInscritos" :key="est.id_usuario" class="flex justify-between items-center text-sm">
              <span>{{ est.usuario?.nombre_completo }} ({{ est.usuario?.registro_academico }})</span>
              <button @click="desinscribirEstudiante(est.id_usuario)" class="text-red-600 hover:text-red-800 text-xs">Eliminar</button>
            </div>
          </div>
        </div>

        <!-- Agregar estudiantes -->
        <div class="flex-1 overflow-hidden">
          <h3 class="text-sm font-semibold text-gray-700 mb-2">Agregar Estudiantes</h3>
          <div class="border border-gray-200 rounded-lg p-2 max-h-40 overflow-y-auto">
            <label v-for="est in estudiantesNoInscritos" :key="est.id_usuario" class="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
              <input type="checkbox" :value="est.id_usuario" v-model="estudiantesSeleccionados" class="rounded text-indigo-600" />
              <span class="text-sm">{{ est.nombre_completo }}</span>
              <span class="text-xs text-gray-400">{{ est.registro_academico }}</span>
            </label>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 mt-4">
          <button type="button" @click="showModalInscripcion = false" class="px-4 py-2 text-gray-600 hover:text-gray-800 transition">Cerrar</button>
          <button @click="inscribirEstudiantes" :disabled="saving || estudiantesSeleccionados.length === 0" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50">
            {{ saving ? 'Inscribiendo...' : 'Inscribir Seleccionados' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { cursosService, type Curso } from "../../services/cursos.services";
import { carrerasService } from "../../services/carreras.services";
import { usuariosService } from "../../services/usuarios.services";
import api from "../../services/api";

const cursos = ref<Curso[]>([]);
const carreras = ref<any[]>([]);
const auxiliares = ref<any[]>([]);
const loading = ref(true);
const saving = ref(false);
const showModalCrear = ref(false);
const showModalAsignar = ref(false);
const showModalInscripcion = ref(false);
const cursoSeleccionado = ref<Curso | null>(null);
const auxiliarSeleccionado = ref<number | null>(null);
const carreraFiltro = ref<number | null>(null);
const semestreFiltro = ref<number | null>(null);

const todosEstudiantes = ref<any[]>([]);
const estudiantesInscritos = ref<any[]>([]);
const estudiantesSeleccionados = ref<number[]>([]);

const cursosFiltrados = computed(() => {
  let result = cursos.value;
  if (carreraFiltro.value) {
    result = result.filter(c => c.carrera?.id_carrera === carreraFiltro.value);
  }
  if (semestreFiltro.value) {
    result = result.filter(c => c.semestre === semestreFiltro.value);
  }
  return result;
});

const form = reactive({
  codigo_curso: "",
  nombre_curso: "",
  semestre: 1,
  id_carrera: 0,
});

const loadData = async () => {
  try {
    loading.value = true;
    const [cursosData, carrerasData, usuariosData] = await Promise.all([
      cursosService.getAll(),
      carrerasService.getAll(),
      usuariosService.getAll(),
    ]);
    cursos.value = cursosData;
    carreras.value = carrerasData;
    auxiliares.value = usuariosData.filter(u => u.rol?.nombre_rol === 'auxiliar');
    todosEstudiantes.value = usuariosData.filter(u => u.rol?.nombre_rol === 'estudiante');
  } catch (err) {
    console.error("Error al cargar datos:", err);
  } finally {
    loading.value = false;
  }
};

const estudiantesNoInscritos = computed(() => {
  const inscritosIds = estudiantesInscritos.value.map(e => e.id_usuario);
  return todosEstudiantes.value.filter(e => !inscritosIds.includes(e.id_usuario));
});

const abrirModalCrear = () => {
  form.codigo_curso = "";
  form.nombre_curso = "";
  form.semestre = 1;
  form.id_carrera = carreras.value[0]?.id_carrera || 0;
  showModalCrear.value = true;
};

const crearCurso = async () => {
  saving.value = true;
  try {
    await cursosService.create(form);
    showModalCrear.value = false;
    await loadData();
  } catch (err) {
    console.error("Error al crear curso:", err);
    alert("Error al crear curso");
  } finally {
    saving.value = false;
  }
};

const abrirModalAsignar = (curso: Curso) => {
  cursoSeleccionado.value = curso;
  auxiliarSeleccionado.value = curso.usuarios?.[0]?.id_usuario || null;
  showModalAsignar.value = true;
};

const asignarAuxiliar = async () => {
  if (!cursoSeleccionado.value || auxiliarSeleccionado.value === null) return;
  saving.value = true;
  try {
    await cursosService.asignarAuxiliar(cursoSeleccionado.value.id_curso, auxiliarSeleccionado.value);
    showModalAsignar.value = false;
    await loadData();
  } catch (err) {
    console.error("Error al asignar auxiliar:", err);
    alert("Error al asignar auxiliar");
  } finally {
    saving.value = false;
  }
};

const abrirModalInscripcion = async (curso: Curso) => {
  cursoSeleccionado.value = curso;
  showModalInscripcion.value = true;
  estudiantesSeleccionados.value = [];
  try {
    const response = await api.get(`/usuarios/cursos/${curso.id_curso}/estudiantes`);
    estudiantesInscritos.value = response.data;
  } catch (err) {
    console.error("Error al cargar estudiantes inscritos:", err);
    estudiantesInscritos.value = [];
  }
};

const inscribirEstudiantes = async () => {
  if (!cursoSeleccionado.value || estudiantesSeleccionados.value.length === 0) return;
  saving.value = true;
  try {
    for (const idEstudiante of estudiantesSeleccionados.value) {
      await api.post(`/usuarios/cursos/${cursoSeleccionado.value.id_curso}/estudiantes/${idEstudiante}`);
    }
    await abrirModalInscripcion(cursoSeleccionado.value);
    estudiantesSeleccionados.value = [];
  } catch (err) {
    console.error("Error al inscribir estudiantes:", err);
    alert("Error al inscribir estudiantes");
  } finally {
    saving.value = false;
  }
};

const desinscribirEstudiante = async (idEstudiante: number) => {
  if (!cursoSeleccionado.value) return;
  if (!confirm("¿Desinscribir este estudiante del curso?")) return;
  try {
    await api.delete(`/usuarios/cursos/${cursoSeleccionado.value.id_curso}/estudiantes/${idEstudiante}`);
    await abrirModalInscripcion(cursoSeleccionado.value);
  } catch (err) {
    console.error("Error al desinscribir estudiante:", err);
    alert("Error al desinscribir estudiante");
  }
};

onMounted(() => {
  loadData();
});
</script>