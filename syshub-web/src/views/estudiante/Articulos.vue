<template>
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Panel Izquierdo: Lista de Artículos -->
      <div class="lg:col-span-1 bg-white shadow-lg rounded-xl p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-gray-800">Mis Artículos</h2>
          <button
            v-if="puedeCrear"
            @click="nuevoArticulo"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm transition"
          >
            + Nuevo
          </button>
          <button
            v-else
            @click="solicitarPermiso"
            :disabled="enviandoSolicitud || solicitudActual?.estado === 'pendiente'"
            class="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ solicitudActual?.estado === 'pendiente' ? 'Solicitud Pendiente' : 'Solicitar Permiso' }}
          </button>
        </div>

        <div v-if="loading" class="text-center py-4 text-gray-500">
          Cargando...
        </div>

        <div v-else-if="articulos.length === 0" class="text-center py-4 text-gray-500 text-sm">
          No hay artículos aún
        </div>

        <div v-else class="space-y-2 max-h-[500px] overflow-y-auto">
          <div
            v-for="articulo in articulos"
            :key="articulo.id_articulo"
            @click="seleccionarArticulo(articulo)"
            :class="[
              'p-3 rounded-lg cursor-pointer transition border',
              articuloSeleccionado?.id_articulo === articulo.id_articulo
                ? 'bg-indigo-50 border-indigo-200'
                : 'hover:bg-gray-50 border-transparent'
            ]"
          >
            <h3 class="font-medium text-gray-800 text-sm line-clamp-1">
              {{ articulo.titulo || 'Sin título' }}
            </h3>
            <p class="text-xs text-gray-500 mt-1">
              {{ formatFecha(articulo.fecha_publicacion) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Panel Derecho: Editor de Artículos -->
      <div class="lg:col-span-2 bg-white shadow-lg rounded-xl p-6">
        <div v-if="!articuloSeleccionado && !editando" class="text-center py-12">
          <div class="flex justify-center mb-4">
            <Edit class="text-5xl text-gray-300" />
          </div>
          <h3 class="text-lg font-medium text-gray-600">Selecciona un artículo o crea uno nuevo</h3>
          <p class="text-sm text-gray-400 mt-2">Usa el panel izquierdo para gestionar tus artículos</p>
        </div>

        <div v-else>
          <!-- Título del Artículo -->
          <div class="mb-4">
            <input
              v-model="form.titulo"
              type="text"
              placeholder="Título del artículo..."
              class="w-full text-2xl font-bold text-gray-800 border-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-2 py-1 outline-none"
            />
          </div>

          <!-- Editor Quill -->
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <QuillEditor
              v-model:content="form.contenido"
              contentType="html"
              :options="quillOptions"
              class="min-h-[400px]"
              @ready="onQuillReady"
            />
          </div>

          <!-- Acciones -->
          <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
            <div class="flex gap-2">
              <button
                v-if="articuloSeleccionado"
                @click="eliminarArticulo"
                class="text-red-600 hover:text-red-800 text-sm font-medium transition"
              >
                Eliminar
              </button>
            </div>
            <div class="flex gap-2">
              <button
                @click="cancelarEdicion"
                class="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                Cancelar
              </button>
              <button
                @click="guardarArticulo"
                :disabled="guardando"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {{ guardando ? 'Guardando...' : 'Publicar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { Edit } from "@boxicons/vue";
import { useAuthStore } from "../../stores/auth";
import { articulosService } from "../../services/articulos.services";
import { usuariosService } from "../../services/usuarios.services";

interface Articulo {
  id_articulo?: number;
  titulo: string;
  contenido: string;
  fecha_publicacion?: string;
  id_autor?: number;
}

const authStore = useAuthStore();
const puedeCrear = computed(() => authStore.user?.puede_crear_articulos === true);

const articulos = ref<Articulo[]>([]);
const articuloSeleccionado = ref<Articulo | null>(null);
const editando = ref(false);
const loading = ref(false);
const guardando = ref(false);
const solicitudActual = ref<any>(null);
const enviandoSolicitud = ref(false);

const form = ref({
  titulo: "",
  contenido: "",
});

let quillInstance: any = null;

const quillOptions = {
  modules: {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ font: ["Arial", "Times New Roman", "Courier New"] }],
        [{ size: ["12px", "14px", "18px", "24px", "32px"] }],
        [{ color: [] }, { background: [] }],
        [{ align: ["", "center", "right", "justify"] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ],
      handlers: {
        image: () => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.click();

          input.onchange = () => {
            const file = input.files?.[0];
            if (!file) return;

            const MAX_SIZE = 250 * 1024;
            if (file.size > MAX_SIZE) {
              alert('La imagen no puede exceder 250KB');
              return;
            }

            const reader = new FileReader();
            reader.onload = () => {
              if (quillInstance) {
                const range = quillInstance.getSelection(true);
                quillInstance.insertEmbed(range.index, 'image', reader.result as string);
              }
            };
            reader.readAsDataURL(file);
          };
        },
      },
    },
  },
  placeholder: "Escribe tu artículo aquí...",
  theme: "snow",
};

const loadArticulos = async () => {
  loading.value = true;
  try {
    articulos.value = await articulosService.getMyArticles();
  } catch (error) {
    console.error("Error al cargar artículos:", error);
  } finally {
    loading.value = false;
  }
};

const loadSolicitud = async () => {
  if (!puedeCrear.value) {
    try {
      solicitudActual.value = await usuariosService.getMiSolicitud();
    } catch (error) {
      console.error("Error al cargar solicitud:", error);
    }
  }
};

const solicitarPermiso = async () => {
  if (solicitudActual.value?.estado === 'pendiente') {
    alert("Ya tienes una solicitud pendiente de aprobación");
    return;
  }
  if (solicitudActual.value?.estado === 'aprobada') {
    window.location.reload();
    return;
  }
  
  enviandoSolicitud.value = true;
  try {
    await usuariosService.solicitarPermisoArticulos();
    alert("Solicitud enviada correctamente");
    await loadSolicitud();
  } catch (error: any) {
    alert(error.response?.data?.message || "Error al enviar solicitud");
  } finally {
    enviandoSolicitud.value = false;
  }
};

const nuevoArticulo = () => {
  articuloSeleccionado.value = null;
  form.value = { titulo: "", contenido: "" };
  editando.value = true;
};

const seleccionarArticulo = (articulo: Articulo) => {
  articuloSeleccionado.value = articulo;
  form.value = { titulo: articulo.titulo, contenido: articulo.contenido };
  editando.value = true;
};

const guardarArticulo = async () => {
  if (!form.value.titulo.trim()) {
    alert("El título es obligatorio");
    return;
  }
  
  guardando.value = true;
  try {
    if (articuloSeleccionado.value?.id_articulo) {
      await articulosService.update(articuloSeleccionado.value.id_articulo, {
        titulo: form.value.titulo,
        contenido: form.value.contenido,
      });
    } else {
      await articulosService.create({
        titulo: form.value.titulo,
        contenido: form.value.contenido,
      });
    }
    await loadArticulos();
    articuloSeleccionado.value = null;
    form.value = { titulo: "", contenido: "" };
    editando.value = false;
    alert("Artículo guardado correctamente");
  } catch (error: any) {
    console.error("Error al guardar:", error);
    alert(error.response?.data?.message || "Error al guardar el artículo");
  } finally {
    guardando.value = false;
  }
};

const eliminarArticulo = async () => {
  if (!articuloSeleccionado.value?.id_articulo) return;
  
  if (confirm("¿Estás seguro de eliminar este artículo?")) {
    try {
      await articulosService.delete(articuloSeleccionado.value.id_articulo);
      await loadArticulos();
      articuloSeleccionado.value = null;
      form.value = { titulo: "", contenido: "" };
      editando.value = false;
      alert("Artículo eliminado");
    } catch (error: any) {
      console.error("Error al eliminar:", error);
      alert(error.response?.data?.message || "Error al eliminar el artículo");
    }
  }
};

const cancelarEdicion = () => {
  articuloSeleccionado.value = null;
  form.value = { titulo: "", contenido: "" };
  editando.value = false;
};

const formatFecha = (fecha?: string) => {
  if (!fecha) return "";
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const onQuillReady = (editor: any) => {
  quillInstance = editor;
};

onMounted(async () => {
  await loadArticulos();
  await loadSolicitud();
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:deep(.ql-toolbar) {
  border: none;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

:deep(.ql-container) {
  border: none;
  font-family: Arial, sans-serif;
  font-size: 14px;
}

:deep(.ql-editor) {
  min-height: 400px;
}

:deep(.ql-editor h1) {
  font-size: 2em;
  font-weight: bold;
}

:deep(.ql-editor h2) {
  font-size: 1.5em;
  font-weight: bold;
}

:deep(.ql-editor h3) {
  font-size: 1.17em;
  font-weight: bold;
}

:deep(.ql-editor img) {
  max-width: 100%;
  height: auto;
}

:deep(.ql-editor a) {
  color: #4f46e5;
  text-decoration: underline;
}
</style>