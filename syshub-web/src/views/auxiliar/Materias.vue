<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-indigo-600">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Mis Materias</h1>
        <p class="text-gray-500 text-sm">Cursos que impartes</p>
      </div>
      <button
        @click="openModalRecurso"
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-xl transition-all flex items-center gap-2"
      >
        <span class="text-lg">+</span> Nuevo Recurso
      </button>
    </div>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-500">Cargando cursos...</p>
    </div>

    <div v-else-if="misCursos.length === 0" class="text-center py-8 bg-white rounded-xl">
      <p class="text-gray-500">No tienes cursos asignados</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          v-for="curso in misCursos"
          :key="curso.id_curso"
          @click="seleccionarCurso(curso)"
          class="p-4 rounded-xl border-2 text-left transition"
          :class="cursoSeleccionado?.id_curso === curso.id_curso ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'"
        >
          <h3 class="font-bold text-gray-800">{{ curso.nombre_curso }}</h3>
          <p class="text-sm text-gray-500">{{ curso.codigo_curso }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ curso.carrera?.nombre_carrera }}</p>
        </button>
      </div>

      <div v-if="cursoSeleccionado" class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">
            Recursos del curso: {{ cursoSeleccionado.nombre_curso }}
          </h2>
          
          <!-- Tabs -->
          <div class="flex border-b border-gray-200 mb-4">
            <button
              @click="activeTab = 'mios'"
              class="px-6 py-2 font-semibold transition-colors relative"
              :class="activeTab === 'mios' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'"
            >
              Míos
              <span v-if="activeTab === 'mios'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></span>
            </button>
            <button
              @click="activeTab = 'estudiantes'"
              class="px-6 py-2 font-semibold transition-colors relative"
              :class="activeTab === 'estudiantes' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'"
            >
              Estudiantes
              <span v-if="activeTab === 'estudiantes'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></span>
            </button>
          </div>
          
          <div v-if="recursosFiltrados.length === 0" class="text-center py-4 text-gray-500">
            No hay recursos en esta categoría
          </div>
          <table v-else class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Recurso</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Herramientas</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Archivo</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="rec in recursosFiltrados" :key="rec.id_recurso" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <div class="font-bold text-gray-700">{{ rec.titulo }}</div>
                  <div class="text-xs text-gray-400">{{ rec.descripcion?.substring(0, 50) }}...</div>
                </td>
                <td class="px-4 py-3">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="h in rec.herramientas" :key="h.id" class="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                      {{ h.nombre }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <a v-if="rec.url_archivo" :href="getRecursoUrl(rec.url_archivo)" target="_blank" class="text-indigo-600 hover:text-indigo-800 text-sm">
                    Descargar
                  </a>
                  <span v-else class="text-gray-400 text-sm">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de Nuevo Recurso -->
    <div v-if="showModalRecurso" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-800">Nuevo Recurso para {{ cursoSeleccionado?.nombre_curso }}</h2>
          <button @click="closeModalRecurso" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <form @submit.prevent="handleCreateRecurso" class="p-6 space-y-4">
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600 ml-1">Título</label>
            <input v-model="formRecurso.titulo" type="text" required
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ej: Guía de laboratorio" />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600 ml-1">Descripción técnica</label>
            <textarea v-model="formRecurso.descripcion" rows="3" required
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="¿Qué contiene este recurso?"></textarea>
          </div>
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600 ml-1">Stack Tecnológico / Herramientas</label>
            <div class="flex flex-wrap gap-2 p-2.5 border border-gray-200 rounded-xl min-h-[50px] bg-white">
              <div v-for="(h, i) in formRecurso.herramientas" :key="i"
                class="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm">
                {{ h }}
                <button type="button" @click="removeTool(i)" class="hover:text-red-300 font-bold ml-1">×</button>
              </div>
              <input v-model="toolInput" @keydown.enter.prevent="addTool" placeholder="Escribe y presiona Enter"
                class="flex-1 outline-none text-sm min-w-[150px] py-1" />
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600 ml-1">Recursos adicionales (Texto libre)</label>
            <input v-model="formRecurso.herramientas_adicionales" type="text"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Hardware, sensores, libros, etc." />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600 ml-1">Archivo</label>
            <input type="file" @change="handleFileChange" accept=".txt,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp,.zip,.rar,.7z"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            <p v-if="formRecurso.url_archivo" class="text-xs text-gray-500">Archivo: {{ formRecurso.url_archivo }}</p>
          </div>
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600 ml-1">Etiquetas (Tags)</label>
            <div class="flex flex-wrap gap-2 p-2.5 border border-gray-200 rounded-xl bg-gray-50">
              <div v-for="(tag, i) in formRecurso.etiquetas" :key="i"
                class="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm border border-gray-300">
                #{{ tag }}
                <button type="button" @click="removeTag(i)" class="text-gray-400 hover:text-red-500 font-bold ml-1">×</button>
              </div>
              <input v-model="tagInput" @keydown.enter.prevent="addTag" placeholder="Añade tags..."
                class="bg-transparent outline-none text-sm flex-1 min-w-[100px] py-1" />
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button type="button" @click="closeModalRecurso"
              class="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all">
              Cancelar
            </button>
            <button type="submit" :disabled="loadingRecurso"
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-8 rounded-xl transition-all disabled:opacity-50">
              {{ loadingRecurso ? 'Creando...' : 'Crear Recurso' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";
import api from "../../services/api";
import { recursosService } from "../../services/recursos.services";

const loading = ref(true);
const misCursos = ref<any[]>([]);
const todosRecursos = ref<any[]>([]);
const cursoSeleccionado = ref<any | null>(null);
const currentUserId = ref<number | null>(null);
const activeTab = ref<"mios" | "estudiantes">("mios");

const showModalRecurso = ref(false);
const loadingRecurso = ref(false);
const toolInput = ref("");
const tagInput = ref("");
const selectedFile = ref<File | null>(null);

const formRecurso = reactive({
  titulo: "",
  descripcion: "",
  url_archivo: "",
  herramientas: [] as string[],
  herramientas_adicionales: "",
  etiquetas: [] as string[],
});

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const loadMisCursos = async () => {
  try {
    loading.value = true;
    const [userRes, cursosRes] = await Promise.all([
      api.get("/auth/me"),
      api.get("/usuarios/me/cursos"),
    ]);
    currentUserId.value = userRes.data.id_usuario;
    misCursos.value = cursosRes.data;
    
    if (misCursos.value.length > 0) {
      seleccionarCurso(misCursos.value[0]);
    }
  } catch (err) {
    console.error("Error al cargar cursos:", err);
  } finally {
    loading.value = false;
  }
};

const loadRecursos = async () => {
  try {
    const response = await api.get("/recursos");
    todosRecursos.value = response.data;
  } catch (err) {
    console.error("Error al cargar recursos:", err);
  }
};

const seleccionarCurso = (curso: any) => {
  cursoSeleccionado.value = curso;
};

const recursosFiltrados = computed(() => {
  if (!cursoSeleccionado.value || !currentUserId.value) return [];
  return todosRecursos.value.filter(r => {
    if (r.curso?.id_curso !== cursoSeleccionado.value.id_curso) return false;
    const esMio = r.usuario?.id_usuario === currentUserId.value;
    if (activeTab.value === 'mios') return esMio;
    return !esMio;
  });
});

const getRecursoUrl = (nombreArchivo: string) => {
  return `${apiUrl.replace("/api/v1", "")}/uploads/recursos/${nombreArchivo}`;
};

const openModalRecurso = () => {
  if (!cursoSeleccionado.value) {
    alert("Selecciona un curso primero");
    return;
  }
  formRecurso.titulo = "";
  formRecurso.descripcion = "";
  formRecurso.url_archivo = "";
  formRecurso.herramientas = [];
  formRecurso.herramientas_adicionales = "";
  formRecurso.etiquetas = [];
  toolInput.value = "";
  tagInput.value = "";
  selectedFile.value = null;
  showModalRecurso.value = true;
};

const closeModalRecurso = () => {
  showModalRecurso.value = false;
};

const addTool = () => {
  const val = toolInput.value.trim().toLowerCase();
  if (val && !formRecurso.herramientas.includes(val)) {
    formRecurso.herramientas.push(val);
    toolInput.value = "";
  }
};

const removeTool = (index: number) => {
  formRecurso.herramientas.splice(index, 1);
};

const addTag = () => {
  const val = tagInput.value.trim().toLowerCase().replace(/\s+/g, "-");
  if (val && !formRecurso.etiquetas.includes(val)) {
    formRecurso.etiquetas.push(val);
    tagInput.value = "";
  }
};

const removeTag = (index: number) => {
  formRecurso.etiquetas.splice(index, 1);
};

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const allowedTypes = ["txt", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "odt", "ods", "odp", "zip", "rar", "7z"];
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (!ext || !allowedTypes.includes(ext)) {
    alert("Tipo de archivo no permitido");
    input.value = "";
    return;
  }

  if (file.size > 50 * 1024 * 1024) {
    alert("El archivo no puede exceder 50MB");
    input.value = "";
    return;
  }

  try {
    loadingRecurso.value = true;
    const result = await recursosService.uploadArchivo(file);
    formRecurso.url_archivo = result.nombre_archivo;
    selectedFile.value = file;
  } catch (err) {
    console.error("Error al subir archivo:", err);
    alert("Error al subir archivo");
  } finally {
    loadingRecurso.value = false;
  }
};

const handleCreateRecurso = async () => {
  if (!formRecurso.titulo.trim() || !formRecurso.descripcion.trim() || formRecurso.herramientas.length === 0 || formRecurso.etiquetas.length === 0) {
    alert("Completa todos los campos obligatorios");
    return;
  }

  loadingRecurso.value = true;
  try {
    await recursosService.createRecurso({
      titulo: formRecurso.titulo,
      descripcion: formRecurso.descripcion,
      url_archivo: formRecurso.url_archivo,
      herramientas: formRecurso.herramientas,
      herramientas_adicionales: formRecurso.herramientas_adicionales,
      etiquetas: formRecurso.etiquetas,
      id_curso: cursoSeleccionado.value?.id_curso,
      es_destacado: false,
    });
    alert("Recurso creado correctamente");
    closeModalRecurso();
    loadRecursos();
  } catch (err) {
    console.error("Error al crear recurso:", err);
    alert("Error al crear el recurso");
  } finally {
    loadingRecurso.value = false;
  }
};

onMounted(() => {
  loadMisCursos();
  loadRecursos();
});
</script>