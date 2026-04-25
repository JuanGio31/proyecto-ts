<template>
  <div class="max-w-6xl mx-auto">
    <div class="bg-white shadow-lg rounded-xl p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <button
          @click="abrirModalCrear"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Nuevo Usuario
        </button>
      </div>

      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-500">Cargando usuarios...</p>
      </div>

      <div v-else-if="usuarios.length === 0" class="text-center py-8">
        <p class="text-gray-500">No hay usuarios registrados</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Usuario</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Registro</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rol</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="usuario in usuarios" :key="usuario.id_usuario" class="hover:bg-gray-50">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
                    {{ usuario.nombre_completo?.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">{{ usuario.nombre_completo }}</p>
                    <p class="text-xs text-gray-500">@{{ usuario.username }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-gray-600">{{ usuario.email }}</td>
              <td class="px-4 py-3 text-gray-600">{{ usuario.registro_academico }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-1 text-xs rounded-full font-medium"
                  :class="getRolColor(usuario.rol?.nombre_rol)"
                >
                  {{ usuario.rol?.nombre_rol }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button
                    @click="abrirModalEditar(usuario)"
                    class="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Editar
                  </button>
                  <button
                    @click="eliminarUsuario(usuario.id_usuario)"
                    class="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showModal = false">
      <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 class="text-xl font-bold text-gray-800 mb-4">
          {{ modoEdicion ? 'Editar Usuario' : 'Nuevo Usuario' }}
        </h2>

        <form @submit.prevent="guardarUsuario" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Nombre Completo</label>
            <input
              v-model="form.nombre_completo"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              :disabled="modoEdicion"
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
            />
          </div>

          <div v-if="!modoEdicion">
            <label class="block text-sm font-medium text-gray-600 mb-1">
              Registro Académico
              <span v-if="!requiereRegistroAcademico" class="text-gray-400 text-xs">(opcional para admin/auxiliar)</span>
            </label>
            <input
              v-model="form.registro_academico"
              type="text"
              :required="requiereRegistroAcademico"
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div v-if="!modoEdicion">
            <label class="block text-sm font-medium text-gray-600 mb-1">Contraseña</label>
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">
              Fecha de Nacimiento
              <span class="text-gray-400 text-xs">(opcional)</span>
            </label>
            <input
              v-model="form.fecha_nacimiento"
              type="date"
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Rol</label>
            <select
              v-model="form.id_rol"
              required
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option v-for="rol in roles" :key="rol.id_rol" :value="rol.id_rol">
                {{ rol.nombre_rol }}
              </option>
            </select>
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
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { usuariosService, rolesService, type Usuario, type Rol } from "../services/usuarios.services";

const usuarios = ref<Usuario[]>([]);
const roles = ref<Rol[]>([]);
const loading = ref(true);
const saving = ref(false);
const showModal = ref(false);
const modoEdicion = ref(false);
const selectedId = ref<number | null>(null);

const form = reactive({
  nombre_completo: "",
  email: "",
  registro_academico: "",
  password: "",
  id_rol: 0,
  fecha_nacimiento: "",
});

const rolSeleccionado = computed(() => {
  const rol = roles.value.find(r => r.id_rol === form.id_rol);
  return rol?.nombre_rol?.toLowerCase() || "";
});

const requiereRegistroAcademico = computed(() => {
  return rolSeleccionado.value === "estudiante";
});

const loadData = async () => {
  try {
    loading.value = true;
    const [usuariosData, rolesData] = await Promise.all([
      usuariosService.getAll(),
      rolesService.getAll(),
    ]);
    usuarios.value = usuariosData;
    roles.value = rolesData;
  } catch (err) {
    console.error("Error al cargar datos:", err);
  } finally {
    loading.value = false;
  }
};

const getRolColor = (nombreRol?: string) => {
  switch (nombreRol) {
    case "admin":
      return "bg-purple-100 text-purple-700";
    case "docente":
      return "bg-blue-100 text-blue-700";
    case "estudiante":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const abrirModalCrear = () => {
  modoEdicion.value = false;
  selectedId.value = null;
  Object.assign(form, {
    nombre_completo: "",
    email: "",
    registro_academico: "",
    password: "",
    id_rol: roles.value[0]?.id_rol || 1,
  });
  showModal.value = true;
};

const abrirModalEditar = (usuario: Usuario) => {
  modoEdicion.value = true;
  selectedId.value = usuario.id_usuario;
  Object.assign(form, {
    nombre_completo: usuario.nombre_completo,
    email: usuario.email,
    registro_academico: usuario.registro_academico,
    password: "",
    id_rol: usuario.rol?.id_rol || 1,
  });
  showModal.value = true;
};

const guardarUsuario = async () => {
  saving.value = true;
  try {
    if (modoEdicion.value && selectedId.value) {
      await usuariosService.update(selectedId.value, {
        nombre_completo: form.nombre_completo,
        id_rol: form.id_rol,
      });
    } else {
      await usuariosService.create({
        nombre_completo: form.nombre_completo,
        email: form.email,
        registro_academico: form.registro_academico,
        password: form.password,
        id_rol: form.id_rol,
        fecha_nacimiento: form.fecha_nacimiento || undefined,
      });
    }
    showModal.value = false;
    await loadData();
  } catch (err) {
    console.error("Error al guardar:", err);
    alert("Error al guardar usuario");
  } finally {
    saving.value = false;
  }
};

const eliminarUsuario = async (id: number) => {
  if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

  try {
    await usuariosService.delete(id);
    await loadData();
  } catch (err) {
    console.error("Error al eliminar:", err);
    alert("Error al eliminar usuario");
  }
};

onMounted(() => {
  loadData();
});
</script>
