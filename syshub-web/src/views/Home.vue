<script setup lang="ts">
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const handleClick = () => {
    authStore.logout();
}

</script>

<template>
    <div class="flex flex-col gap-4 justify-center items-center">
        <div class="container border-2 rounder">
            <h1 class="text-2xl font-bold">Informacion Usuario</h1>
            <p>Nombre: {{ authStore.user?.nombre_completo }}</p>
            <p>Correo: {{ authStore.user?.email }}</p>
            <p>Registro: {{ authStore.user?.registro_academico }}</p>
            <p>Carrera: {{ authStore.user?.carrera?.nombre }}</p>
            <p>Fecha de Cumpleaños: {{ authStore.user?.fecha_cumpleanios }}</p>
        </div>
        <button @click="handleClick" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Salir
        </button>
    </div>
</template>