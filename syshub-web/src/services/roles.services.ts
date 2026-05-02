import api from "./api";

export interface Rol {
  id_rol: number;
  nombre_rol: string;
  descripcion_rol?: string;
}

export interface CreateRolDto {
  nombre_rol: string;
  descripcion_rol?: string;
}

export const rolesService = {
  async getAll(): Promise<Rol[]> {
    const response = await api.get<Rol[]>("/roles");
    return response.data;
  },

  async getById(id: number): Promise<Rol> {
    const response = await api.get<Rol>(`/roles/${id}`);
    return response.data;
  },

  async create(data: CreateRolDto): Promise<Rol> {
    const response = await api.post<Rol>("/roles", data);
    return response.data;
  },

  async update(id: number, data: Partial<CreateRolDto>): Promise<Rol> {
    const response = await api.patch<Rol>(`/roles/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/roles/${id}`);
  },
};
