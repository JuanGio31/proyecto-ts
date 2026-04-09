<template>
  <section class="min-h-screen flex items-center justify-center">
    <div
      class="bg-gray-100 flex rounded-2xl shadow-lg max-w-6xl w-full p-5 items-stretch"
    >
      <!-- imagen -->
      <div class="hidden md:block md:w-1/2 relative max-w-[600] w-[600]">
        <!-- div con imagen de fondo, redondeado y cover -->
        <div
          class="rounded-2xl w-full h-full min-h-[420] bg-center bg-cover overflow-hidden"
          style="background-image: url(&quot;../assets/fondo.jpeg&quot;)"
        ></div>

        <!-- overlay oscuro sobre la imagen -->
        <div
          class="absolute inset-0 rounded-2xl bg-black/30 pointer-events-none"
        ></div>

        <!-- texto centrado con backdrop blur -->
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-2xl px-6 py-3 rounded bg-black/30 backdrop-blur-sm">
            <span class="text-cyan-400">syshu</span
            ><span class="text-pink-500">b</span>
          </span>
        </div>
      </div>

      <!-- form  -->
      <div class="w-full md:w-1/2 px-8 py-6">
        <h2 class="font-bold text-2xl text-[#002D74] mb-4">
          Registro en Syshub
        </h2>
        <form @submit.prevent="handleSumbit" class="flex flex-col gap-4">
          <input
            v-model="dataRegistro.nombre_completo"
            class="p-2 rounded-xl border"
            type="text"
            name="nombre_completo"
            placeholder="Nombre del estudiante"
          />
          <input
            v-model="dataRegistro.registro"
            class="p-2 rounded-xl border"
            type="text"
            name="carnet"
            placeholder="Registro Académico"
          />
          <input
            v-model="dataRegistro.email"
            class="p-2 rounded-xl border"
            type="email"
            name="email"
            placeholder="Correo"
          />
          <select
            v-model="dataRegistro.carrera"
            name="carrera"
            class="p-2 rounded-xl border w-full"
            required
          >
          <option value="" disabled>Seleccione una carrera</option>
            <option v-for="carrera in carreras" :key="carrera.id_carrera" :value="carrera.id_carrera">
              {{ carrera.nombre_carrera }}
            </option>
          </select>
          <div class="relative">
            <label class="text-xs text-[#002D74]">Fecha de Nacimiento</label>
            <input
              v-model="dataRegistro.fecha_nacimiento"
              class="p-2 mt-1 rounded-xl border w-full"
              type="date"
              name="date"
            />
          </div>
          <div class="relative">
            <input
              v-model="dataRegistro.password"
              class="p-2 rounded-xl border w-full"
              type="password"
              name="password"
              placeholder="Contraseña"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="gray"
              class="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2"
              viewBox="0 0 16 16"
            >
              <path
                d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"
              />
              <path
                d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"
              />
            </svg>
          </div>

          <button
            class="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300"
          >
            Crear Cuenta
          </button>
        </form>

        <div
          class="mt-3 text-xs flex justify-between items-center text-[#002D74]"
        >
          <p>¿Ya tienes una cuenta?</p>
          <RouterLink to="/login">
            <button
              class="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300"
            >
              Inicia sesion
            </button>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { ref, onMounted } from "vue";
import { carrerasService, type Carrera } from "../services/carreras.services";

const authStore = useAuthStore();
const router = useRouter();
const error = ref("");
const carreras = ref<Carrera[]>([]);
const dataRegistro = ref({
  nombre_completo:"",
  email: "",
  registro: "",
  carrera: "",
  fecha_nacimiento: "",
  password: "",
});

onMounted(async () => {
  try {
    carreras.value = await carrerasService.getAll();
  } catch (err) {
    console.error("Error al cargar carreras:", err);
  }
});

async function handleSumbit() {
  error.value = "";
  const success = await authStore.signup({
    nombre_completo: dataRegistro.value.nombre_completo,
    email: dataRegistro.value.email,
    registro: dataRegistro.value.registro,
    carrera: dataRegistro.value.carrera,
    fecha_nacimiento: dataRegistro.value.fecha_nacimiento,
    password: dataRegistro.value.password,
  });

  if (success) {
    router.push("/");
  } else {
    error.value = "Error en el registro";
  }
}
</script>

<style scoped>
/* Ajuste opcional para asegurar borde redondeado en algunos navegadores
.md\\:block .rounded-2xl {
    border-radius: 1rem;
} */
section {
  background-image: url("../assets/fondo.jpeg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
