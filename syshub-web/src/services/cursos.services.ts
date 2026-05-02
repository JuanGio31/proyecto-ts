import api from "./api";

export interface Curso {
  id_curso: number;
  codigo_curso: string;
  nombre_curso: string;
  semestre?: number;
  carrera?: {
    id_carrera: number;
    nombre_carrera: string;
  };
  usuarios?: {
    id_usuario: number;
    nombre_completo: string;
    email: string;
  }[];
}

export interface CreateCursoDto {
  nombre_curso: string;
  codigo_curso: string;
  semestre: number;
  id_carrera: number;
}

export const cursosService = {
  async getAll(): Promise<Curso[]> {
    const response = await api.get<Curso[]>("/cursos");
    return response.data;
  },

  async getById(id: number): Promise<Curso> {
    const response = await api.get<Curso>(`/cursos/${id}`);
    return response.data;
  },

  async create(data: CreateCursoDto): Promise<Curso> {
    const response = await api.post<Curso>("/cursos", data);
    return response.data;
  },

  async update(id: number, data: Partial<CreateCursoDto>): Promise<Curso> {
    const response = await api.patch<Curso>(`/cursos/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/cursos/${id}`);
  },

  async asignarAuxiliar(
    cursoId: number,
    idAuxiliar: number,
  ): Promise<Curso> {
    const response = await api.post<Curso>(`/cursos/${cursoId}/auxiliar`, {
      id_auxiliar: idAuxiliar,
    });
    return response.data;
  },

  async getAuxiliares(cursoId: number): Promise<any[]> {
    const response = await api.get(`/cursos/${cursoId}/auxiliares`);
    return response.data;
  },

  async getCursos(): Promise<Curso[]> {
    return this.getAll();
  },
};