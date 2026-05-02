<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white shadow-lg rounded-xl p-6">
      <!-- Selector de Curso Principal -->
      <div class="mb-6">
        <label class="text-sm font-semibold text-gray-600 ml-1 mb-2 block">Ver recursos del curso:</label>
        <select
          v-model="cursoSeleccionadoId"
          @change="onCursoChange"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
        >
          <option :value="null">-- Selecciona un curso --</option>
          <option
            v-for="curso in cursos"
            :key="curso.id_curso"
            :value="curso.id_curso"
          >
            {{ curso.nombre_curso }}
          </option>
        </select>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-200 mb-6">
        <button
          @click="activeTab = 'material'"
          class="px-6 py-3 font-semibold transition-colors relative"
          :class="activeTab === 'material' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'"
        >
          Material de Clase
          <span v-if="activeTab === 'material'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></span>
        </button>
        <button
          @click="activeTab = 'mis-subidas'"
          class="px-6 py-3 font-semibold transition-colors relative"
          :class="activeTab === 'mis-subidas' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'"
        >
          Mis Subidas
          <span v-if="activeTab === 'mis-subidas'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></span>
        </button>
      </div>

      <!-- Tab: Material de Clase -->
      <div v-if="activeTab === 'material'">
        <div v-if="!cursoSeleccionadoId" class="text-center py-8 text-gray-500">
          Selecciona un curso para ver el material de clase
        </div>
        <div v-else-if="loadingMaterial" class="text-center py-8 text-gray-500">
          Cargando material...
        </div>
        <div v-else-if="recursosDelCurso.length === 0" class="text-center py-8 text-gray-500">
          No hay materiales o proyectos destacados para este curso
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="rec in recursosDelCurso"
            :key="rec.id_recurso"
            class="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-bold text-gray-800">{{ rec.titulo }}</h3>
                  <span v-if="rec.es_destacado" class="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded font-medium">
                    ⭐ Destacado
                  </span>
                  <span v-if="rec.usuario?.rol?.nombre_rol === 'auxiliar'" class="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded font-medium">
                    📚 Auxiliar
                  </span>
                </div>
                <p class="text-sm text-gray-500 mt-1">{{ rec.descripcion }}</p>
                <div class="flex flex-wrap gap-1 mt-2">
                  <span v-for="h in rec.herramientas" :key="h.id_herramienta || h"
                    class="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                    {{ typeof h === 'string' ? h : h.nombre }}
                  </span>
                </div>
                <div class="flex gap-1 mt-2">
                  <span v-for="tag in rec.etiquetas" :key="tag.id_etiqueta || tag"
                    class="text-xs text-indigo-500">#{{ typeof tag === 'string' ? tag : tag.nombre }}</span>
                </div>
              </div>
              <div class="flex flex-col items-end gap-2 ml-4">
                <span class="text-xs text-gray-400">{{ formatDate(rec.fecha_publicacion) }}</span>
                <a v-if="rec.url_archivo" :href="getRecursoUrl(rec.url_archivo)" target="_blank"
                  class="text-indigo-600 hover:text-indigo-800 text-sm">
                  Descargar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Mis Subidas -->
      <div v-if="activeTab === 'mis-subidas'">
        <div class="flex justify-end mb-4">
          <button
            v-if="cursoSeleccionadoId"
            @click="openModalAporte"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-xl transition-all flex items-center gap-2"
          >
            <span class="text-lg">+</span> Aporte de Clase
          </button>
        </div>
        <div v-if="!cursoSeleccionadoId" class="text-center py-8 text-gray-500">
          Selecciona un curso para ver tus contribuciones
        </div>
        <div v-else-if="misRecursosFiltrados.length === 0" class="text-center py-8 text-gray-500">
          No has subido recursos a este curso
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="rec in misRecursosFiltrados"
            :key="rec.id_recurso"
            class="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-bold text-gray-800">{{ rec.titulo }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ rec.descripcion }}</p>
                <div class="flex flex-wrap gap-1 mt-2">
                  <span v-for="h in rec.herramientas" :key="h.id_herramienta || h"
                    class="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                    {{ typeof h === 'string' ? h : h.nombre }}
                  </span>
                </div>
                <div class="flex gap-1 mt-2">
                  <span v-for="tag in rec.etiquetas" :key="tag.id_etiqueta || tag"
                    class="text-xs text-indigo-500">#{{ typeof tag === 'string' ? tag : tag.nombre }}</span>
                </div>
              </div>
              <div class="flex flex-col items-end gap-2">
                <span class="text-xs text-gray-400">{{ formatDate(rec.fecha_publicacion) }}</span>
                <a v-if="rec.url_archivo" :href="getRecursoUrl(rec.url_archivo)" target="_blank"
                  class="text-indigo-600 hover:text-indigo-800 text-sm">
                  Descargar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón Flotante para Hallazgos (siempre visible) -->
    <div class="fixed bottom-6 right-6 z-40">
      <button
        @click="openModalHallazgo"
        class="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-5 rounded-full shadow-lg transition-all flex items-center gap-2 hover:scale-105"
      >
        <span class="text-xl">+</span> Nuevo Hallazgo
      </button>
    </div>

    <!-- Modal de Aporte de Clase -->
    <div v-if="showModalAporte" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-800">Aporte de Clase - {{ cursoSeleccionadoNombre }}</h2>
          <button @click="closeModalAporte" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <form @submit.prevent="handleCreateAporte" class="p-6 space-y-4">
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600 ml-1">Título</label>
            <input v-model="formAporte.titulo" type="text" required
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ej: Proyecto final - Calculadora" />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600 ml-1">Descripción técnica</label>
            <textarea v-model="formAporte.descripcion" rows="3" required
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Describe tu proyecto o trabajo"></textarea>
          </div>
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600 ml-1">Stack Tecnológico / Herramientas</label>
            <div class="flex flex-wrap gap-2 p-2.5 border border-gray-200 rounded-xl min-h-[50px] bg-white">
              <div v-for="(h, i) in formAporte.herramientas" :key="i"
                class="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm">
                {{ h }}
                <button type="button" @click="removeToolAporte(i)" class="hover:text-red-300 font-bold ml-1">×</button>
              </div>
              <input v-model="toolInputAporte" @keydown.enter.prevent="addToolAporte" placeholder="Escribe y presiona Enter"
                class="flex-1 outline-none text-sm min-w-[150px] py-1" />
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600 ml-1">Recursos adicionales</label>
            <input v-model="formAporte.herramientas_adicionales" type="text"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Hardware, sensores, libros, etc." />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600 ml-1">Archivo</label>
            <input type="file" @change="handleFileChangeAporte" accept=".txt,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp,.zip,.rar,.7z"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            <p v-if="formAporte.url_archivo" class="text-xs text-gray-500">Archivo: {{ formAporte.url_archivo }}</p>
          </div>
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600 ml-1">Etiquetas (Tags)</label>
            <div class="flex flex-wrap gap-2 p-2.5 border border-gray-200 rounded-xl bg-gray-50">
              <div v-for="(tag, i) in formAporte.etiquetas" :key="i"
                class="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm border border-gray-300">
                #{{ tag }}
                <button type="button" @click="removeTagAporte(i)" class="text-gray-400 hover:text-red-500 font-bold ml-1">×</button>
              </div>
              <input v-model="tagInputAporte" @keydown.enter.prevent="addTagAporte" placeholder="Añade tags..."
                class="bg-transparent outline-none text-sm flex-1 min-w-[100px] py-1" />
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button type="button" @click="closeModalAporte"
              class="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all">
              Cancelar
            </button>
            <button type="submit" :disabled="loadingAporte"
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-8 rounded-xl transition-all disabled:opacity-50">
              {{ loadingAporte ? 'Subiendo...' : 'Subir Aporte' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Nuevo Hallazgo -->
    <div v-if="showModalHallazgo" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-800">Nuevo Hallazgo (Aporte Libre)</h2>
          <button @click="closeModalHallazgo" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <form @submit.prevent="handleCreateHallazgo" class="p-6 space-y-4">
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600 ml-1">Título</label>
            <input v-model="formHallazgo.titulo" type="text" required
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ej: Automatización de reportes" />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600 ml-1">Descripción técnica</label>
            <textarea v-model="formHallazgo.descripcion" rows="3" required
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="¿Cómo lo lograste?"></textarea>
          </div>
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600 ml-1">Stack Tecnológico / Herramientas</label>
            <div class="flex flex-wrap gap-2 p-2.5 border border-gray-200 rounded-xl min-h-[50px] bg-white">
              <div v-for="(h, i) in formHallazgo.herramientas" :key="i"
                class="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm">
                {{ h }}
                <button type="button" @click="removeToolHallazgo(i)" class="hover:text-red-300 font-bold ml-1">×</button>
              </div>
              <input v-model="toolInputHallazgo" @keydown.enter.prevent="addToolHallazgo" placeholder="Escribe y presiona Enter"
                class="flex-1 outline-none text-sm min-w-[150px] py-1" />
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600 ml-1">Recursos adicionales</label>
            <input v-model="formHallazgo.herramientas_adicionales" type="text"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Hardware, sensores, libros, etc." />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600 ml-1">Archivo</label>
            <input type="file" @change="handleFileChangeHallazgo" accept=".txt,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp,.zip,.rar,.7z"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            <p v-if="formHallazgo.url_archivo" class="text-xs text-gray-500">Archivo: {{ formHallazgo.url_archivo }}</p>
          </div>
          <div class="space-y-1">
            <label class="text-sm font-semibold text-gray-600 ml-1">Etiquetas (Tags)</label>
            <div class="flex flex-wrap gap-2 p-2.5 border border-gray-200 rounded-xl bg-gray-50">
              <div v-for="(tag, i) in formHallazgo.etiquetas" :key="i"
                class="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm border border-gray-300">
                #{{ tag }}
                <button type="button" @click="removeTagHallazgo(i)" class="text-gray-400 hover:text-red-500 font-bold ml-1">×</button>
              </div>
              <input v-model="tagInputHallazgo" @keydown.enter.prevent="addTagHallazgo" placeholder="Añade tags..."
                class="bg-transparent outline-none text-sm flex-1 min-w-[100px] py-1" />
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button type="button" @click="closeModalHallazgo"
              class="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all">
              Cancelar
            </button>
            <button type="submit" :disabled="loadingHallazgo"
              class="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-8 rounded-xl transition-all disabled:opacity-50">
              {{ loadingHallazgo ? 'Publicando...' : 'Publicar Hallazgo' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { recursosService } from "../../services/recursos.services";
import api from "../../services/api";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const toolInputAporte = ref("");
const tagInputAporte = ref("");
const toolInputHallazgo = ref("");
const tagInputHallazgo = ref("");
const cursos = ref<{ id_curso: number; nombre_curso: string }[]>([]);
const selectedFileAporte = ref<File | null>(null);
const selectedFileHallazgo = ref<File | null>(null);

const cursoSeleccionadoId = ref<number | null>(null);
const activeTab = ref<"material" | "mis-subidas">("material");

const recursosDelCurso = ref<any[]>([]);
const misRecursos = ref<any[]>([]);
const loadingMaterial = ref(false);

const showModalAporte = ref(false);
const loadingAporte = ref(false);
const formAporte = reactive({
  titulo: "",
  descripcion: "",
  url_archivo: "",
  herramientas: [] as string[],
  herramientas_adicionales: "",
  etiquetas: [] as string[],
});

const showModalHallazgo = ref(false);
const loadingHallazgo = ref(false);
const formHallazgo = reactive({
  titulo: "",
  descripcion: "",
  url_archivo: "",
  herramientas: [] as string[],
  herramientas_adicionales: "",
  etiquetas: [] as string[],
});

const cursoSeleccionadoNombre = computed(() => {
  const curso = cursos.value.find(c => c.id_curso === cursoSeleccionadoId.value);
  return curso?.nombre_curso || "";
});

const loadCursos = async () => {
  try {
    cursos.value = await recursosService.getCursos();
  } catch (err) {
    console.error("Error al cargar cursos:", err);
  }
};

const loadMaterialDelCurso = async () => {
  if (!cursoSeleccionadoId.value) {
    recursosDelCurso.value = [];
    return;
  }
  try {
    loadingMaterial.value = true;
    const response = await api.get(`/recursos/curso/${cursoSeleccionadoId.value}`);
    recursosDelCurso.value = response.data;
  } catch (err) {
    console.error("Error al cargar material:", err);
    recursosDelCurso.value = [];
  } finally {
    loadingMaterial.value = false;
  }
};

const loadMisRecursos = async () => {
  try {
    misRecursos.value = await recursosService.getMyRecursos();
  } catch (err) {
    console.error("Error al cargar mis recursos:", err);
  }
};

const onCursoChange = () => {
  activeTab.value = "material";
  loadMaterialDelCurso();
};

const misRecursosFiltrados = computed(() => {
  if (!cursoSeleccionadoId.value) return [];
  return misRecursos.value.filter(r => 
    r.curso && r.curso.id_curso === cursoSeleccionadoId.value
  );
});

const getRecursoUrl = (nombreArchivo: string) => {
  return `${apiUrl.replace("/api/v1", "")}/uploads/recursos/${nombreArchivo}`;
};

const formatDate = (date: string | Date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("es-GT", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Modal Aporte de Clase
const openModalAporte = () => {
  formAporte.titulo = "";
  formAporte.descripcion = "";
  formAporte.url_archivo = "";
  formAporte.herramientas = [];
  formAporte.herramientas_adicionales = "";
  formAporte.etiquetas = [];
  toolInputAporte.value = "";
  tagInputAporte.value = "";
  selectedFileAporte.value = null;
  showModalAporte.value = true;
};

const closeModalAporte = () => {
  showModalAporte.value = false;
};

const addToolAporte = () => {
  const val = toolInputAporte.value.trim().toLowerCase();
  if (val && !formAporte.herramientas.includes(val)) {
    formAporte.herramientas.push(val);
    toolInputAporte.value = "";
  }
};

const removeToolAporte = (index: number) => {
  formAporte.herramientas.splice(index, 1);
};

const addTagAporte = () => {
  const val = tagInputAporte.value.trim().toLowerCase().replace(/\s+/g, "-");
  if (val && !formAporte.etiquetas.includes(val)) {
    formAporte.etiquetas.push(val);
    tagInputAporte.value = "";
  }
};

const removeTagAporte = (index: number) => {
  formAporte.etiquetas.splice(index, 1);
};

const handleFileChangeAporte = async (event: Event) => {
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
    loadingAporte.value = true;
    const result = await recursosService.uploadArchivo(file);
    formAporte.url_archivo = result.nombre_archivo;
    selectedFileAporte.value = file;
  } catch (err) {
    console.error("Error al subir archivo:", err);
    alert("Error al subir archivo");
  } finally {
    loadingAporte.value = false;
  }
};

const handleCreateAporte = async () => {
  if (!formAporte.titulo.trim() || !formAporte.descripcion.trim() || formAporte.herramientas.length === 0 || formAporte.etiquetas.length === 0) {
    alert("Completa todos los campos obligatorios");
    return;
  }

  loadingAporte.value = true;
  try {
    await recursosService.createRecurso({
      titulo: formAporte.titulo,
      descripcion: formAporte.descripcion,
      url_archivo: formAporte.url_archivo,
      herramientas: formAporte.herramientas,
      herramientas_adicionales: formAporte.herramientas_adicionales,
      etiquetas: formAporte.etiquetas,
      id_curso: cursoSeleccionadoId.value ?? undefined,
      es_destacado: false,
    });
    alert("Aporte de clase publicado correctamente");
    closeModalAporte();
    loadMisRecursos();
  } catch (err) {
    console.error("Error al crear aporte:", err);
    alert("Error al publicar el aporte");
  } finally {
    loadingAporte.value = false;
  }
};

// Modal Hallazgo
const openModalHallazgo = () => {
  formHallazgo.titulo = "";
  formHallazgo.descripcion = "";
  formHallazgo.url_archivo = "";
  formHallazgo.herramientas = [];
  formHallazgo.herramientas_adicionales = "";
  formHallazgo.etiquetas = [];
  toolInputHallazgo.value = "";
  tagInputHallazgo.value = "";
  selectedFileHallazgo.value = null;
  showModalHallazgo.value = true;
};

const closeModalHallazgo = () => {
  showModalHallazgo.value = false;
};

const addToolHallazgo = () => {
  const val = toolInputHallazgo.value.trim().toLowerCase();
  if (val && !formHallazgo.herramientas.includes(val)) {
    formHallazgo.herramientas.push(val);
    toolInputHallazgo.value = "";
  }
};

const removeToolHallazgo = (index: number) => {
  formHallazgo.herramientas.splice(index, 1);
};

const addTagHallazgo = () => {
  const val = tagInputHallazgo.value.trim().toLowerCase().replace(/\s+/g, "-");
  if (val && !formHallazgo.etiquetas.includes(val)) {
    formHallazgo.etiquetas.push(val);
    tagInputHallazgo.value = "";
  }
};

const removeTagHallazgo = (index: number) => {
  formHallazgo.etiquetas.splice(index, 1);
};

const handleFileChangeHallazgo = async (event: Event) => {
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
    loadingHallazgo.value = true;
    const result = await recursosService.uploadArchivo(file);
    formHallazgo.url_archivo = result.nombre_archivo;
    selectedFileHallazgo.value = file;
  } catch (err) {
    console.error("Error al subir archivo:", err);
    alert("Error al subir archivo");
  } finally {
    loadingHallazgo.value = false;
  }
};

const handleCreateHallazgo = async () => {
  if (!formHallazgo.titulo.trim() || !formHallazgo.descripcion.trim() || formHallazgo.herramientas.length === 0 || formHallazgo.etiquetas.length === 0) {
    alert("Completa todos los campos obligatorios");
    return;
  }

  loadingHallazgo.value = true;
  try {
    await recursosService.createRecurso({
      titulo: formHallazgo.titulo,
      descripcion: formHallazgo.descripcion,
      url_archivo: formHallazgo.url_archivo,
      herramientas: formHallazgo.herramientas,
      herramientas_adicionales: formHallazgo.herramientas_adicionales,
      etiquetas: formHallazgo.etiquetas,
      id_curso: undefined,
      es_destacado: false,
    });
    alert("Hallazgo publicado correctamente");
    closeModalHallazgo();
    loadMisRecursos();
  } catch (err) {
    console.error("Error al crear hallazgo:", err);
    alert("Error al publicar el hallazgo");
  } finally {
    loadingHallazgo.value = false;
  }
};

onMounted(() => {
  loadCursos();
  loadMisRecursos();
});
</script>

<style scoped></style>