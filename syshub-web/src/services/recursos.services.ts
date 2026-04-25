import api from "./api";

export interface Curso {
  id_curso: number;
  nombre_curso: string;
}

export interface Recurso {
  titulo: string;
  descripcion: string;
  id_curso?: number;
  url_archivo: string;
  herramientas: string[];
  herramientas_adicionales?: string;
  etiquetas: string[];
  es_destacado: boolean;
}

export const recursosService = {
  async uploadArchivo(archivo: File): Promise<{ nombre_archivo: string }> {
    const formData = new FormData();
    formData.append("archivo", archivo);

    const response = await api.post("/recursos/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async getCursos(): Promise<Curso[]> {
    const response = await api.get<Curso[]>("/cursos");
    return response.data;
  },

  async createRecurso(data: Recurso): Promise<any> {
    const response = await api.post("/recursos", data);
    return response.data;
  },

  async getAll(): Promise<any[]> {
    const response = await api.get("/recursos");
    return response.data;
  },
};