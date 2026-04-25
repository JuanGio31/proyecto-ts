<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white shadow-lg rounded-xl p-6">
    <!-- Encabezado con Estilo -->
    <div class="flex flex-col sm:flex-row items-center gap-6 mb-8">
      <div
        class="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-inner"
      >
        🚀
      </div>
      <div class="text-center sm:text-left">
        <h1 class="text-2xl font-bold text-gray-800">
          Nuevo Hallazgo o Proyecto
        </h1>
        <p class="text-gray-500 text-sm">
          Registra herramientas y etiquetas para que otros puedan encontrarlo.
        </p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Fila de Título y Curso -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-1">
          <label class="text-sm font-semibold text-gray-600 ml-1">Título</label>
          <input
            v-model="form.titulo"
            type="text"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="Ej: Automatización de reportes"
          />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-semibold text-gray-600 ml-1"
            >Contexto (Curso)</label
          >
          <select
            v-model="form.id_curso"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
          >
            <option :value="null">Aporte Libre (Hallazgo)</option>
            <option v-for="curso in cursos" :key="curso.id_curso" :value="curso.id_curso">
              {{ curso.nombre_curso }}
            </option>
          </select>
        </div>
      </div>

      <!-- Descripción -->
      <div class="space-y-1">
        <label class="text-sm font-semibold text-gray-600 ml-1"
          >Descripción técnica</label
        >
        <textarea
          v-model="form.descripcion"
          rows="3"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="¿Cómo lo lograste?"
        ></textarea>
      </div>

      <!-- Herramientas Normalizadas -->
      <div class="space-y-1">
        <label class="text-sm font-semibold text-gray-600 ml-1"
          >Stack Tecnológico / Herramientas</label
        >
        <div
          class="flex flex-wrap gap-2 p-2.5 border border-gray-200 rounded-xl min-h-[50px] bg-white"
        >
          <div
            v-for="(h, i) in form.herramientas"
            :key="i"
            class="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm"
          >
            {{ h }}
            <button
              @click="removeTool(i)"
              type="button"
              class="hover:text-red-300 font-bold ml-1"
            >
              ×
            </button>
          </div>
          <input
            v-model="toolInput"
            @keydown.enter.prevent="addTool"
            placeholder="Escribe y presiona Enter"
            class="flex-1 outline-none text-sm min-w-[150px] py-1"
          />
        </div>
      </div>

      <!-- Herramientas Adicionales -->
      <div class="space-y-1">
        <label class="text-sm font-semibold text-gray-600 ml-1"
          >Recursos adicionales (Texto libre)</label
        >
        <input
          v-model="form.herramientas_adicionales"
          type="text"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="Hardware, sensores, libros, etc."
        />
      </div>

      <!-- Archivo -->
      <div class="space-y-1">
        <label class="text-sm font-semibold text-gray-600 ml-1">Archivo</label>
        <input
          type="file"
          @change="handleFileChange"
          accept=".txt,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp,.zip,.rar,.7z"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <p v-if="form.url_archivo" class="text-xs text-gray-500">
          Archivo: {{ form.url_archivo }}
        </p>
      </div>

      <!-- Etiquetas -->
      <div class="space-y-1">
        <label class="text-sm font-semibold text-gray-600 ml-1"
          >Etiquetas (Tags)</label
        >
        <div
          class="flex flex-wrap gap-2 p-2.5 border border-gray-200 rounded-xl bg-gray-50"
        >
          <div
            v-for="(tag, i) in form.etiquetas"
            :key="i"
            class="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm border border-gray-300"
          >
            #{{ tag }}
            <button
              @click="removeTag(i)"
              type="button"
              class="text-gray-400 hover:text-red-500 font-bold ml-1"
            >
              ×
            </button>
          </div>
          <input
            v-model="tagInput"
            @keydown.enter.prevent="addTag"
            placeholder="Añade tags..."
            class="bg-transparent outline-none text-sm flex-1 min-w-[100px] py-1"
          />
        </div>
      </div>

      <!-- Botón Publicar -->
      <div class="flex justify-end pt-2">
        <button
          type="submit"
          :disabled="loading"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-10 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? "Publicando..." : "Publicar Repositorio" }}
        </button>
      </div>
    </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { recursosService, type Recurso } from "../services/recursos.services";

interface RecursoForm {
  titulo: string;
  descripcion: string;
  id_curso: number | null;
  url_archivo: string;
  herramientas: string[];
  herramientas_adicionales: string;
  etiquetas: string[];
  es_destacado: boolean;
}

const toolInput = ref<string>("");
const tagInput = ref<string>("");
const cursos = ref<{ id_curso: number; nombre_curso: string }[]>([]);
const loading = ref(false);
const selectedFile = ref<File | null>(null);

const form = reactive<RecursoForm>({
  titulo: "",
  descripcion: "",
  id_curso: null,
  url_archivo: "",
  herramientas: [],
  herramientas_adicionales: "",
  etiquetas: [],
  es_destacado: false,
});

const loadCursos = async () => {
  try {
    cursos.value = await recursosService.getCursos();
  } catch (err) {
    console.error("Error al cargar cursos:", err);
  }
};

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const allowedTypes = [
    "txt", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
    "odt", "ods", "odp", "zip", "rar", "7z"
  ];
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
    loading.value = true;
    const result = await recursosService.uploadArchivo(file);
    form.url_archivo = result.nombre_archivo;
    selectedFile.value = file;
  } catch (err) {
    console.error("Error al subir archivo:", err);
    alert("Error al subir archivo");
  } finally {
    loading.value = false;
  }
};

const addTool = (): void => {
  const val = toolInput.value.trim().toLowerCase();
  if (val && !form.herramientas.includes(val)) {
    form.herramientas.push(val);
    toolInput.value = "";
  }
};

const addTag = (): void => {
  const val = tagInput.value.trim().toLowerCase().replace(/\s+/g, "-");
  if (val && !form.etiquetas.includes(val)) {
    form.etiquetas.push(val);
    tagInput.value = "";
  }
};

const removeTool = (index: number): void => {
  form.herramientas.splice(index, 1);
};
const removeTag = (index: number): void => {
  form.etiquetas.splice(index, 1);
};

const handleSubmit = async (): Promise<void> => {
  if (!form.titulo.trim() || !form.descripcion.trim()) {
    alert("Por favor completa el título y la descripción");
    return;
  }

  loading.value = true;
  try {
    const payload = {
      ...form,
      id_curso: form.id_curso || undefined,
    };
    await recursosService.createRecurso(payload);
    alert("Repositorio publicado correctamente");
    Object.assign(form, {
      titulo: "",
      descripcion: "",
      id_curso: null,
      url_archivo: "",
      herramientas: [],
      herramientas_adicionales: "",
      etiquetas: [],
      es_destacado: false,
    });
    selectedFile.value = null;
  } catch (err) {
    console.error("Error al publicar:", err);
    alert("Error al publicar el repositorio");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadCursos();
});
</script>

<style scoped></style>
