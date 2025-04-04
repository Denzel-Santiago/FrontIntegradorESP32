//humedad.interface.ts
export interface Humedad {
  /**
   * Valor de humedad porcentual
   */
  humedad: number;
  
  /**
   * Unidad de medida (normalmente "%")
   */
  unit: string;
  
  /**
   * Identificador del dispositivo ESP32
   */
  device: string;
  
  /**
   * Timestamp de la medición en segundos/milisegundos
   */
  ts: number;
  
  /**
   * Fecha de creación en formato ISO string
   */
  created_at: string;
  
  /**
   * Tipo de sensor (opcional)
   */
  sensor_type?: string;
  
  /**
   * Indica si la lectura es válida (opcional)
   */
  valid?: boolean;
  
  /**
   * Nivel de batería si está disponible (opcional)
   */
  battery_level?: number;
}

/**
* Tipo para eventos de error de humedad
*/
export interface HumedadError {
  timestamp: Date;
  message: string;
  code?: number;
  originalData?: any;
}

/**
* Tipo para el estado de conexión del WebSocket
*/
export interface ConnectionStatus {
  connected: boolean;
  lastUpdate?: Date;
  retryCount?: number;
  error?: HumedadError | null;
}