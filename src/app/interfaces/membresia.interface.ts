//membresia.interface.ts
export interface Membresia {
  id: number;
  usuarioId: number;
  fechaInicio: string;
  fechaFin: string;
  estado: number;
}

export interface MembresiaCreate {
  usuarioId: number;
  fechaInicio: string;
  fechaFin: string;
  estado: number;
}

export interface MembresiaUpdate {
  usuarioId?: number;
  fechaInicio?: string;
  fechaFin?: string;
  estado?: number;
}

export interface RenovacionMembresia {
  nuevaFechaFin: string;
}

export interface MembresiaUsuario extends Membresia {
  usuario: {
    name: string;
    lastname: string;
    email: string;
    isPremium: boolean;
  };
}