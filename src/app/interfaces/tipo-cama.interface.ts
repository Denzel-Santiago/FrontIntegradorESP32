// cama.interface.ts
export interface TipoCama {
    id: number;
    nombre: string;
    clima: string;
  }
  
  export interface TipoCamaCreate {
    nombre: string;
    clima: string;
  }
  
  export interface TipoCamaUpdate extends Partial<TipoCamaCreate> {
    id: number;
  }