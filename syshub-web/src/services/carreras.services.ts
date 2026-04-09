import api from "./api";

export interface Carrera {
  id_carrera: number | string;
  nombre_carrera: string;
}

export const carrerasService = {
  async getAll(): Promise<Carrera[]> {
    const response = await api.get<Carrera[]>("/carreras");
    return response.data;
  },
};
