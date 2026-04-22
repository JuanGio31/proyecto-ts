<template>
  <div class="bg-white border border-gray-200 p-4 rounded-xl mb-2">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 rounded-full overflow-hidden shrink-0">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          alt="avatar"
          class="w-full h-full object-cover"
          loading="lazy"
          @error="(e) => handleAvatarError(e)"
        />
        <div
          v-else
          class="w-full h-full bg-gray-200 flex items-center justify-center"
        >
          👤
        </div>
      </div>
      <div>
        <span class="font-bold text-gray-900">{{
          post?.autor?.nombre_completo
        }}</span>
        <span class="text-gray-500 text-sm ml-2"
          >@{{ post?.autor?.registro_academico }}</span
        >
        <span class="text-gray-400 text-xs ml-2">{{ fechaFormateada }}</span>
      </div>
    </div>

    <p class="text-gray-700 leading-relaxed text-sm mb-3 whitespace-pre-wrap">
      {{ post?.contenido }}
    </p>

    <div
      v-if="post?.imagenes && post.imagenes.length > 0"
      class="mb-3 rounded-xl overflow-hidden grid grid-cols-1 sm:grid-cols-2 gap-1"
    >
      <div
        v-for="(img, index) in post.imagenes"
        :key="img.id_imagen"
        class="relative aspect-square sm:aspect-video"
      >
        <img
          :src="getImagenUrl(img.nombre_archivo)"
          :alt="`Imagen ${index + 1}`"
          class="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 100vw, 50vw"
          @error="handleImageError"
        />
      </div>
    </div>

    <div class="flex gap-6 text-gray-400 text-lg pt-2 border-t border-gray-100">
      <button
        @click="handleLike"
        class="flex items-center gap-1"
        :class="[
          myReaction === 'like' ? 'text-blue-500' : 'hover:text-blue-500',
        ]"
      >
        <ArrowBigUp />
        <span class="text-sm">{{ likes }}</span>
      </button>
      <button
        @click="handleDislike"
        class="flex items-center gap-1"
        :class="[
          myReaction === 'dislike' ? 'text-red-500' : 'hover:text-red-500',
        ]"
      >
        <ArrowBigDown />
        <span class="text-sm">{{ dislikes }}</span>
      </button>
      <button
        @click="toggleComentarios"
        class="hover:text-amber-400 flex items-center gap-1"
      >
        <Message />
        <span class="text-sm">{{ comentariosCount }}</span>
      </button>
    </div>

    <div v-if="mostrarComentarios" class="mt-3 pt-3 border-t border-gray-100">
      <div v-if="comentarios.length > 0" class="space-y-3 mb-3">
        <div
          v-for="comentario in comentarios"
          :key="comentario.id_post"
          class="pl-3 border-l-2 border-gray-200"
        >
          <div class="flex items-center gap-2 mb-1">
            <span class="font-semibold text-sm text-gray-800">{{
              comentario.autor?.nombre_completo
            }}</span>
            <span class="text-gray-400 text-xs">{{
              formatFecha(comentario.fecha_publicacion)
            }}</span>
          </div>
          <p class="text-sm text-gray-700">{{ comentario.contenido }}</p>
        </div>
      </div>

      <div class="flex gap-2">
        <input
          v-model="nuevoComentario"
          type="text"
          placeholder="Escribe un comentario..."
          class="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          @keyup.enter="enviarComentario"
        />
        <button
          @click="enviarComentario"
          :disabled="!nuevoComentario.trim()"
          class="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
        >
          Enviar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Post } from "../services/posts.services";
import { ArrowBigDown, ArrowBigUp, Message } from "@boxicons/vue";
import { usePostsStore } from "../stores/posts";
import { postsService } from "../services/posts.services";

const props = defineProps<{
  post: Post;
}>();

const emit = defineEmits(["comentario-creado"]);

const postsStore = usePostsStore();

const mostrarComentarios = ref(false);
const comentarios = ref<Post[]>([]);
const nuevoComentario = ref("");

const reactions = computed(() => postsStore.getReactions(props.post.id_post));
const likes = computed(() => reactions.value.likes);
const dislikes = computed(() => reactions.value.dislikes);
const myReaction = computed(() => reactions.value.myReaction);
const comentariosCount = computed(() => props.post?.comentarios?.length || 0);

const toggleComentarios = async () => {
  if (!mostrarComentarios.value) {
    if (props.post.comentarios) {
      comentarios.value = props.post.comentarios;
    }
  }
  mostrarComentarios.value = !mostrarComentarios.value;
};

const enviarComentario = async () => {
  if (!nuevoComentario.value.trim()) return;

  try {
    const nuevo = await postsService.createComment(
      props.post.id_post,
      nuevoComentario.value,
    );
    comentarios.value.push(nuevo);
    nuevoComentario.value = "";
    emit("comentario-creado");
  } catch (error) {
    console.error("Error al crear comentario:", error);
  }
};

const formatFecha = (fecha: string) => {
  const d = new Date(fecha);
  return d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const handleLike = () => {
  postsStore.toggleLike(props.post.id_post);
};

const handleDislike = () => {
  postsStore.toggleDislike(props.post.id_post);
};

const avatarUrl = computed(() => {
  const foto = props.post?.autor?.foto_perfil;
  if (!foto) return null;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
  return `${apiUrl.replace("/api/v1", "")}/uploads/perfiles/${foto}`;
});

const getImagenUrl = (nombreArchivo: string) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
  return `${apiUrl.replace("/api/v1", "")}/uploads/posts/${nombreArchivo}`;
};

const fechaFormateada = computed(() => {
  if (!props.post?.fecha_publicacion) return "";
  const fecha = new Date(props.post.fecha_publicacion);
  return fecha.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
});

const handleAvatarError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.style.display = "none";
};

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.style.display = "none";
};
</script>
