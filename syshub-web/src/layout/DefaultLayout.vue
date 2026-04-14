<!-- layouts/DefaultLayout.vue -->
<script setup lang="ts">
import Sidebar from "../components/Sidebar.vue";
</script>

<template>
  <div class="flex min-h-screen bg-gray-100 p-4 gap-8 justify-center">
    <Sidebar />
    <main class="w-lvh">
      <RouterView />
    </main>
  </div>
</template>
