import api from "./api";

export interface Articulo {
  id_articulo: number;
  titulo: string;
  contenido: string;
  fecha_publicacion: string;
  autor: {
    id_usuario: number;
    nombre_completo: string;
    registro_academico?: string;
    carrera?: {
      id_carrera: number;
      nombre_carrera: string;
    };
  };
  etiquetas: {
    id_etiqueta: number;
    nombre_etiqueta: string;
  }[];
  likes: {
    id_usuario: number;
    tipo: 'like' | 'dislike';
  }[];
  comentarios: ArticuloComentario[];
}

export interface ArticuloComentario {
  id_comentario: number;
  contenido: string;
  fecha_creacion: string;
  autor: {
    id_usuario: number;
    nombre_completo: string;
  };
}

export interface CreateArticuloDto {
  titulo: string;
  contenido: string;
  ids_etiquetas?: number[];
}

export interface ReactionResponse {
  reaction: string;
  likes: number;
  dislikes: number;
}

export const articulosService = {
  async getAll(): Promise<Articulo[]> {
    const response = await api.get<Articulo[]>("/articulos");
    return response.data;
  },

  async getMyArticles(): Promise<Articulo[]> {
    const response = await api.get<Articulo[]>("/articulos/mios");
    return response.data;
  },

  async getById(id: number): Promise<Articulo> {
    const response = await api.get<Articulo>(`/articulos/${id}`);
    return response.data;
  },

  async create(data: CreateArticuloDto): Promise<Articulo> {
    const response = await api.post<Articulo>("/articulos", data);
    return response.data;
  },

  async update(id: number, data: Partial<CreateArticuloDto>): Promise<Articulo> {
    const response = await api.patch<Articulo>(`/articulos/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/articulos/${id}`);
    return response.data;
  },

  async toggleLike(id: number): Promise<ReactionResponse> {
    const response = await api.post<ReactionResponse>(`/articulos/${id}/like`);
    return response.data;
  },

  async toggleDislike(id: number): Promise<ReactionResponse> {
    const response = await api.post<ReactionResponse>(`/articulos/${id}/dislike`);
    return response.data;
  },

  async removeReaction(id: number): Promise<ReactionResponse> {
    const response = await api.delete<ReactionResponse>(`/articulos/${id}/reaction`);
    return response.data;
  },

  async getReactions(id: number): Promise<{ likes: number; dislikes: number }> {
    const response = await api.get<{ likes: number; dislikes: number }>(`/articulos/${id}/reactions`);
    return response.data;
  },

  async getMyReaction(id: number): Promise<{ reaction: 'like' | 'dislike' | null }> {
    const response = await api.get<{ reaction: 'like' | 'dislike' | null }>(`/articulos/${id}/reactions/me`);
    return response.data;
  },

  async getComentarios(id: number): Promise<ArticuloComentario[]> {
    const response = await api.get<ArticuloComentario[]>(`/articulos/${id}/comentarios`);
    return response.data;
  },

  async addComentario(id: number, contenido: string): Promise<ArticuloComentario> {
    const response = await api.post<ArticuloComentario>(`/articulos/${id}/comentarios`, { contenido });
    return response.data;
  },

  async getMyLikes(): Promise<Articulo[]> {
    const response = await api.get<Articulo[]>("/articulos/me/likes");
    return response.data;
  },

  async getMyComments(): Promise<ArticuloComentario[]> {
    const response = await api.get<ArticuloComentario[]>("/articulos/me/comentarios");
    return response.data;
  },
};