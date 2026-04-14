<script setup lang="ts">
import CardPerfil from "../components/CardPerfil.vue";
</script>

<template>
  <div
    class="hidden md:block bg-white border border-gray-200 p-6 mb-2 rounded-2xl"
  >
    <CardPerfil />
  </div>
  <div
    class="md:hidden bg-white border border-gray-200 p-6 mb-2 rounded-2xl mt-18"
  >
    <CardPerfil />
  </div>
</template>
