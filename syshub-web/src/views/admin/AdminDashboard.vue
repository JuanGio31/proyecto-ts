<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-indigo-600">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Dashboard del Administrador</h1>
        <p class="text-gray-500 text-sm">Resumen general del sistema</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-indigo-100 rounded-lg">
            <User size="24" fill="#4f46e5" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Usuarios</p>
            <p class="text-2xl font-bold text-gray-800">{{ stats.totalUsuarios }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-100 rounded-lg">
            <Book size="24" fill="#2563eb" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Cursos</p>
            <p class="text-2xl font-bold text-gray-800">{{ stats.totalCursos }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-green-100 rounded-lg">
            <File size="24" fill="#16a34a" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Carreras</p>
            <p class="text-2xl font-bold text-gray-800">{{ stats.totalCarreras }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-amber-100 rounded-lg">
            <Clipboard size="24" fill="#d97706" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Solicitudes Pendientes</p>
            <p class="text-2xl font-bold text-gray-800">{{ stats.solicitudesPendientes }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Accesos Rápidos</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <router-link
          to="/gestion-usuarios"
          class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition"
        >
          <div class="p-2 bg-indigo-100 rounded-lg">
            <Group size="20" fill="#4f46e5" />
          </div>
          <div>
            <p class="font-medium text-gray-800">Usuarios</p>
          </div>
        </router-link>

        <router-link
          to="/gestion-academica"
          class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition"
        >
          <div class="p-2 bg-blue-100 rounded-lg">
            <Book size="20" fill="#2563eb" />
          </div>
          <div>
            <p class="font-medium text-gray-800">Gestión Académica</p>
          </div>
        </router-link>

        <router-link
          to="/roles"
          class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition"
        >
          <div class="p-2 bg-purple-100 rounded-lg">
            <Shield size="20" fill="#9333ea" />
          </div>
          <div>
            <p class="font-medium text-gray-800">Roles</p>
          </div>
        </router-link>

        <router-link
          to="/me"
          class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition"
        >
          <div class="p-2 bg-amber-100 rounded-lg">
            <User size="20" fill="#d97706" />
          </div>
          <div>
            <p class="font-medium text-gray-800">Mi Perfil</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Section: Solicitudes de Artículos -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-4 border-b border-gray-100 bg-gray-50">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-700">
            Solicitudes de Artículos
            <span
              v-if="solicitudesPendientes.length > 0"
              class="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
            >
              {{ solicitudesPendientes.length }}
            </span>
          </h2>
          <button
            @click="cargarSolicitudes"
            class="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Actualizar
          </button>
        </div>
      </div>

      <div v-if="loading" class="p-8 text-center text-gray-500">
        Cargando solicitudes...
      </div>

      <div v-else-if="solicitudesPendientes.length === 0" class="p-8 text-center text-gray-500">
        No hay solicitudes pendientes
      </div>

      <table v-else class="w-full text-left">
        <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
          <tr>
            <th class="px-6 py-3">Estudiante</th>
            <th class="px-6 py-3">Email</th>
            <th class="px-6 py-3">Registro Académico</th>
            <th class="px-6 py-3">Fecha Solicitud</th>
            <th class="px-6 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="solicitud in solicitudesPendientes"
            :key="solicitud.id_solicitud"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4">
              <div class="font-medium text-gray-800">
                {{ solicitud.usuario?.nombre_completo }}
              </div>
            </td>
            <td class="px-6 py-4 text-gray-600 text-sm">
              {{ solicitud.usuario?.email }}
            </td>
            <td class="px-6 py-4 text-gray-600 text-sm">
              {{ solicitud.usuario?.registro_academico || 'N/A' }}
            </td>
            <td class="px-6 py-4 text-gray-500 text-sm">
              {{ formatFecha(solicitud.fecha_solicitud) }}
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-center gap-2">
                <button
                  @click="aprobarSolicitud(solicitud.id_solicitud)"
                  :disabled="procesando"
                  class="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition disabled:opacity-50"
                >
                  Aprobar
                </button>
                <button
                  @click="rechazarSolicitud(solicitud.id_solicitud)"
                  :disabled="procesando"
                  class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition disabled:opacity-50"
                >
                  Rechazar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Historial de Solicitudes -->
    <div v-if="todasSolicitudes.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-4 border-b border-gray-100 bg-gray-50">
        <h2 class="text-lg font-semibold text-gray-700">Historial de Solicitudes</h2>
      </div>
      <table class="w-full text-left">
        <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
          <tr>
            <th class="px-6 py-3">Estudiante</th>
            <th class="px-6 py-3">Estado</th>
            <th class="px-6 py-3">Fecha Solicitud</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="solicitud in todasSolicitudes"
            :key="solicitud.id_solicitud"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4">
              <div class="font-medium text-gray-800">
                {{ solicitud.usuario?.nombre_completo }}
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  solicitud.estado === 'aprobada' ? 'bg-green-100 text-green-700' :
                  solicitud.estado === 'rechazada' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                ]"
              >
                {{ solicitud.estado }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-500 text-sm">
              {{ formatFecha(solicitud.fecha_solicitud) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { User, Book, File, Clipboard, Group, Shield } from "@boxicons/vue";
import { solicitudesArticulosService, type SolicitudArticulo } from "../../services/usuarios.services";
import api from "../../services/api";

const loading = ref(true);
const procesando = ref(false);

const solicitudesPendientes = ref<SolicitudArticulo[]>([]);
const todasSolicitudes = ref<SolicitudArticulo[]>([]);

const stats = ref({
  totalUsuarios: 0,
  totalCursos: 0,
  totalCarreras: 0,
  solicitudesPendientes: 0,
});

const loadData = async () => {
  try {
    loading.value = true;
    const [usuariosRes, cursosRes, carrerasRes, solicitudesRes] = await Promise.all([
      api.get("/usuarios"),
      api.get("/cursos"),
      api.get("/carreras"),
      solicitudesArticulosService.getPendientes(),
    ]);
    stats.value.totalUsuarios = usuariosRes.data.length;
    stats.value.totalCursos = cursosRes.data.length;
    stats.value.totalCarreras = carrerasRes.data.length;
    stats.value.solicitudesPendientes = solicitudesRes.length;
    solicitudesPendientes.value = solicitudesRes;
  } catch (error) {
    console.error("Error al cargar datos:", error);
  } finally {
    loading.value = false;
  }
};

const cargarSolicitudes = async () => {
  loading.value = true;
  try {
    const pendientes = await solicitudesArticulosService.getPendientes();
    solicitudesPendientes.value = pendientes;
    stats.value.solicitudesPendientes = pendientes.length;
  } catch (error) {
    console.error("Error al cargar solicitudes:", error);
  } finally {
    loading.value = false;
  }
};

const aprobarSolicitud = async (id: number) => {
  if (!confirm("¿Aprobar esta solicitud? El estudiante podrá crear artículos.")) return;
  
  procesando.value = true;
  try {
    await solicitudesArticulosService.aprobar(id);
    alert("Solicitud aprobada");
    await cargarSolicitudes();
  } catch (error) {
    console.error("Error al aprobar:", error);
    alert("Error al aprobar solicitud");
  } finally {
    procesando.value = false;
  }
};

const rechazarSolicitud = async (id: number) => {
  if (!confirm("¿Rechazar esta solicitud?")) return;
  
  procesando.value = true;
  try {
    await solicitudesArticulosService.rechazar(id);
    alert("Solicitud rechazada");
    await cargarSolicitudes();
  } catch (error) {
    console.error("Error al rechazar:", error);
    alert("Error al rechazar solicitud");
  } finally {
    procesando.value = false;
  }
};

const formatFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  loadData();
});
</script>