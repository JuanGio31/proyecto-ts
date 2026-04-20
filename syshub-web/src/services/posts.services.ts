import api from "./api";

export type ReactionType = "like" | "dislike";

export interface PostReactions {
  likes: number;
  dislikes: number;
}

export interface Post {
  id_post: number;
  contenido: string;
  fecha_publicacion: string;
  autor: {
    id_usuario: number;
    nombre_completo: string;
    registro_academico: string;
    foto_perfil?: string;
    carrera?: {
      nombre_carrera: string;
    };
  };
  imagenes: {
    id_imagen: number;
    nombre_archivo: string;
  }[];
}

export const postsService = {
  async createPost(contenido: string, archivos: File[]): Promise<Post> {
    let nombresArchivos: string[] = [];

    if (archivos.length > 0) {
      const formData = new FormData();
      archivos.forEach((file) => {
        formData.append("imagenes", file);
      });

      const uploadResponse = await api.post("/posts/imagenes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      nombresArchivos = uploadResponse.data.nombres_archivos || [];
    }

    const response = await api.post("/posts", {
      contenido,
      nombres_imagenes: nombresArchivos,
    });
    return response.data;
  },

  async getPosts(): Promise<Post[]> {
    const response = await api.get("/posts");
    return response.data;
  },

  async toggleReaction(
    postId: number,
    type: ReactionType,
  ): Promise<PostReactions> {
    const response = await api.post(`/posts/${postId}/reactions/${type}`);
    return response.data;
  },

  async getReactions(postId: number): Promise<PostReactions> {
    const response = await api.get(`/posts/${postId}/reactions`);
    return response.data;
  },

  async getMyReaction(postId: number): Promise<{ reaction: ReactionType | null }> {
    const response = await api.get(`/posts/${postId}/reactions/me`);
    return response.data;
  },

  async removeReaction(postId: number): Promise<PostReactions> {
    const response = await api.delete(`/posts/${postId}/reactions`);
    return response.data;
  },
};