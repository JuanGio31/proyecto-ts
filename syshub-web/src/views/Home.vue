<template>
  <div>
    <CajaPublicacion @publicado="cargarPosts" />
    <PostCard v-for="post in postsStore.posts" :key="post.id_post" :post="post" />
    <div
      v-if="postsStore.posts.length === 0"
      class="bg-gray-50 border border-gray-200 p-6 rounded-xl text-center text-gray-500"
    >
      No hay publicaciones aún. ¡Sé el primero en publicar!
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import CajaPublicacion from "../components/CajaPublicacion.vue";
import PostCard from "../components/PostCard.vue";
import { usePostsStore } from "../stores/posts";

const postsStore = usePostsStore();

const cargarPosts = async () => {
  await postsStore.fetchPosts();
};

onMounted(() => {
  cargarPosts();
});
</script>
