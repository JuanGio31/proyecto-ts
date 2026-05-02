import api from "./api";

export interface Usuario {
  id_usuario: number;
  nombre_completo: string;
  email: string;
  registro_academico: string;
  username: string;
  foto_perfil?: string;
  esta_suspendido?: boolean;
  puede_crear_articulos?: boolean;
  rol: {
    id_rol: number;
    nombre_rol: string;
  };
  carrera?: {
    id_carrera: number;
    nombre_carrera: string;
  };
}

export interface CreateUsuarioDto {
  nombre_completo: string;
  email: string;
  registro_academico: string;
  password: string;
  id_rol: number;
  id_carrera?: number;
  fecha_nacimiento?: string;
}

export interface UpdateUsuarioDto {
  nombre_completo?: string;
  email?: string;
  id_rol?: number;
  id_carrera?: number;
}

export const usuariosService = {
  async getAll(): Promise<Usuario[]> {
    const response = await api.get<Usuario[]>("/usuarios");
    return response.data;
  },

  async getById(id: number): Promise<Usuario> {
    const response = await api.get<Usuario>(`/usuarios/${id}`);
    return response.data;
  },

  async create(data: CreateUsuarioDto): Promise<Usuario> {
    console.log(data)
    const response = await api.post<Usuario>("/usuarios", data);
    return response.data;
  },

  async update(id: number, data: UpdateUsuarioDto): Promise<Usuario> {
    const response = await api.patch<Usuario>(`/usuarios/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },

  async suspender(id: number): Promise<Usuario> {
    const response = await api.patch<Usuario>(`/usuarios/${id}/suspender`);
    return response.data;
  },

  async activar(id: number): Promise<Usuario> {
    const response = await api.patch<Usuario>(`/usuarios/${id}/activar`);
    return response.data;
  },

  async solicitarPermisoArticulos(): Promise<any> {
    const response = await api.post("/solicitudes-articulos");
    return response.data;
  },

  async getMiSolicitud(): Promise<any> {
    const response = await api.get("/solicitudes-articulos/mi-solicitud");
    return response.data;
  },
};

export interface SolicitudArticulo {
  id_solicitud: number;
  usuario: {
    id_usuario: number;
    nombre_completo: string;
    email: string;
    registro_academico: string;
  };
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  fecha_solicitud: string;
}

export const solicitudesArticulosService = {
  async getPendientes(): Promise<SolicitudArticulo[]> {
    const response = await api.get<SolicitudArticulo[]>("/solicitudes-articulos/pendientes");
    return response.data;
  },

  async aprobar(id: number): Promise<any> {
    const response = await api.patch(`/solicitudes-articulos/${id}/aprobar`);
    return response.data;
  },

  async rechazar(id: number): Promise<any> {
    const response = await api.patch(`/solicitudes-articulos/${id}/rechazar`);
    return response.data;
  },
};

export interface Rol {
  id_rol: number;
  nombre_rol: string;
  descripcion_rol?: string;
}

export const rolesService = {
  async getAll(): Promise<Rol[]> {
    const response = await api.get<Rol[]>("/roles");
    return response.data;
  },
};