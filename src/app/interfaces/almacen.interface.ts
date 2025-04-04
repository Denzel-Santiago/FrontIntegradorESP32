// almacen.interface.ts
export interface Almacen {
  id: number;
  tipo_cama_id: number;
  cantidad: number;
  tipo_cama?: TipoCama; // Relación opcional
}

export interface AlmacenCreate {
  tipo_cama_id: number;
  cantidad: number;
}

export interface AlmacenUpdate extends Partial<AlmacenCreate> {
  id: number;
}

export interface IncrementarCantidad {
  cantidad: number;
}

export interface TipoCama {
  id: number;
  nombre: string;
  clima: string;
}