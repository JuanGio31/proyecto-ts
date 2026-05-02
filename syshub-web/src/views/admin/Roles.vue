<template>
  <div class="max-w-6xl mx-auto">
    <div class="bg-white shadow-lg rounded-xl p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Roles</h1>
      </div>

      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-500">Cargando roles...</p>
      </div>

      <div v-else-if="roles.length === 0" class="text-center py-8">
        <p class="text-gray-500">No hay roles registrados</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase"
              >
                ID
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase"
              >
                Nombre
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase"
              >
                Descripción
              </th>
              <th
                v-if="isAdmin"
                class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="rol in roles" :key="rol.id_rol" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-gray-600 font-mono">
                {{ rol.id_rol }}
              </td>
              <td class="px-4 py-3 font-medium text-gray-800">
                {{ rol.nombre_rol }}
              </td>
              <td class="px-4 py-3 text-gray-600">
                {{ rol.descripcion_rol || "Sin descripción" }}
              </td>
              <td v-if="isAdmin" class="px-4 py-3">
                <button
                  @click="abrirModalEditar(rol)"
                  class="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Editar Rol -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showModal = false"
    >
      <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Editar Rol</h2>
        <form @submit.prevent="guardarRol" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1"
              >Nombre del Rol</label
            >
            <input
              v-model="form.nombre_rol"
              type="text"
              disabled
              class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1"
              >Descripción</label
            >
            <textarea
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              v-model="form.descripcion_rol"
              rows="3"
              placeholder="Ingresar descripción del rol"
            ></textarea>
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              {{ saving ? "Guardando..." : "Guardar" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { rolesService, type Rol } from "../../services/roles.services";
import { useAuthStore } from "../../stores/auth";

const authStore = useAuthStore();
const isAdmin = computed(
  () => authStore.user?.rol?.nombre_rol === "administrador",
);

const roles = ref<Rol[]>([]);
const loading = ref(true);
const saving = ref(false);
const showModal = ref(false);
const selectedId = ref<number | null>(null);

const form = reactive({
  nombre_rol: "",
  descripcion_rol: "",
});

const loadData = async () => {
  try {
    loading.value = true;
    const [rolesData] = await Promise.all([rolesService.getAll()]);
    roles.value = rolesData;
  } catch (err) {
    console.error("Error al cargar datos:", err);
  } finally {
    loading.value = false;
  }
};

const abrirModalEditar = (rol: Rol) => {
  selectedId.value = rol.id_rol;
  form.nombre_rol = rol.nombre_rol;
  form.descripcion_rol = rol.descripcion_rol || "";
  showModal.value = true;
};

const guardarRol = async () => {
  if (!selectedId.value) return;
  
  saving.value = true;
  try {
    await rolesService.update(selectedId.value, {
      descripcion_rol: form.descripcion_rol,
    });
    showModal.value = false;
    await loadData();
  } catch (err) {
    console.error("Error al guardar rol:", err);
    alert("Error al guardar rol");
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>
