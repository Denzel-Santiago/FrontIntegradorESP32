// cama.interface.ts
import { TipoCama } from './tipo-cama.interface';
import { Usuario } from './usuario.interface';


export interface Cama {
    id: number;
    modelo: string;
    tipo_id: number;
    usuario_id: number | null;
    tipo?: TipoCama;       // Relación opcional con TipoCama
    usuario?: Usuario;     // Relación opcional con Usuario (asumiendo que existe la interfaz Usuario)
  }
  
  export interface CamaCreate {
    modelo: string;
    tipo_id: number;
    usuario_id?: number | null;
  }
  
  export interface CamaUpdate extends Partial<CamaCreate> {
    id: number;
  }
  
  export interface CamaAfricana {
    id: number;
    cama_id: number;
    usuario_id: number | null;
    cama?: Cama;          // Relación opcional con Cama
    usuario?: Usuario;    // Relación opcional con Usuario
  }