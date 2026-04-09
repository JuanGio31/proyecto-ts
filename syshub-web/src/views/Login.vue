<template>
    <section class="min-h-screen flex items-center justify-center">
        <!-- login container -->
        <div class="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
            <!-- form -->
            <div class="md:w-1/2 px-8 md:px-16">
                <h2 class="font-bold text-2xl text-[#002D74]">
                    Iniciar Sesion en Syshub
                </h2>

                <form @submit.prevent="handleSumbit" class="flex flex-col gap-4">
                    <input v-model="email" class="p-2 mt-8 rounded-xl border" type="email" name="email"
                        placeholder="Correo" />
                    <div class="relative">
                        <input v-model="password" class="p-2 rounded-xl border w-full" type="password" name="password"
                            placeholder="Contraseña" />
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray"
                            class="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2" viewBox="0 0 16 16">
                            <path
                                d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                            <path
                                d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                        </svg>
                    </div>
                    <button type="submit" class="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300">
                        Iniciar Sesión
                    </button>
                </form>

                <div class="mt-5 text-xs border-b border-[#002D74] py-4 text-[#002D74]">
                    <a href="#">Has olvidado tu contraseña?</a>
                </div>

                <div class="mt-3 text-xs flex justify-between items-center text-[#002D74]">
                    <p>No tienes una cuenta?</p>
                    <RouterLink to="/registro">
                        <button class="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300">
                            Registrar
                        </button>
                    </RouterLink>
                </div>
            </div>

            <div class="md:block hidden relative w-2xl h-96">
                <div class="absolute inset-0 rounded-2xl bg-gray-700"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-2xl px-6 py-3 font-semibold text-white">
                        <span>syshu</span>
                        <span class="text-pink-500">b</span>
                    </span>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { ref } from 'vue';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref('');

async function handleSumbit() {
    error.value = '';
    const success = await authStore.login({ email: email.value, password: password.value });
    if (success) {
        router.push('/');
    }else{
        error.value = 'Credenciales incorrectas';
    }
}

</script>

<style scoped>
section {
    background-image: url("../assets/fondo.jpeg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
</style>
