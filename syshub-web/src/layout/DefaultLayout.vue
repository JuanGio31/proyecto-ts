<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <main class="max-w-11/12 mx-auto pt-20 lg:pt-4 lg:pl-72 px-4 lg:px-0">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "../components/Sidebar.vue";
</script>
