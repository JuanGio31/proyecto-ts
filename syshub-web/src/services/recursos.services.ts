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
    const response = await api.get<Curso[]>("/usuarios/me/cursos");
    return response.data;
  },

  async createRecurso(data: Recurso): Promise<any> {
    const response = await api.post("/recursos", data);
    return response.data;
  },

  async getAll(filtros?: {
    busqueda?: string;
    etiqueta?: string;
    herramienta?: string;
    es_destacado?: boolean;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filtros?.busqueda) params.append("busqueda", filtros.busqueda);
    if (filtros?.etiqueta) params.append("etiqueta", filtros.etiqueta);
    if (filtros?.herramienta) params.append("herramienta", filtros.herramienta);
    if (filtros?.es_destacado !== undefined) params.append("es_destacado", String(filtros.es_destacado));
    
    const queryString = params.toString();
    const url = queryString ? `/recursos?${queryString}` : "/recursos";
    const response = await api.get(url);
    return response.data;
  },

  async toggleDestacado(id: number): Promise<any> {
    const response = await api.patch(`/recursos/${id}/destacado`);
    return response.data;
  },

  async getMyRecursos(): Promise<any[]> {
    const response = await api.get("/recursos/me");
    return response.data;
  },
};