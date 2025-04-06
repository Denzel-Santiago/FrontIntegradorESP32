// luz.interface.ts
export interface Luz {
  /**
   * Valor de resistencia en Ohmios
   * @example 4869.28
   */
  value: number;
  
  /**
   * Unidad de medida (Ohm para Ohmios)
   * @example "Ohm"
   */
  unit: 'Ohm';
  
  /**
   * Identificador único del dispositivo ESP32
   * @example "ESP32Publisher-08A6F746C874"
   */
  device_id: string;
  
  /**
   * Marca de tiempo UNIX de la medición
   * @example 301329
   */
  timestamp: number;
  
  /**
   * Tipo de sensor utilizado
   * @example "LDR" (Light Dependent Resistor)
   */
  sensor_type: string;
  
  /**
   * Fecha de creación en formato ISO string (opcional - puede generarse en frontend)
   */
  created_at?: string;
}

/**
 * Tipo para eventos de error de luz
 */
export interface LuzError {
  /**
   * Marca de tiempo cuando ocurrió el error
   */
  timestamp: Date;
  
  /**
   * Mensaje descriptivo del error
   */
  message: string;
  
  /**
   * Código de error numérico (opcional)
   */
  code?: number;
  
  /**
   * Datos originales que causaron el error (opcional)
   */
  originalData?: any;
}

/**
 * Tipo para el estado de conexión del WebSocket
 */
export interface LuzConnectionStatus {
  /**
   * Indica si la conexión está activa
   */
  connected: boolean;
  
  /**
   * Última actualización recibida (opcional)
   */
  lastUpdate?: Date;
  
  /**
   * Número de intentos de reconexión (opcional)
   */
  retryCount?: number;
  
  /**
   * Información de error si lo hubiera (opcional)
   */
  error?: LuzError | null;
}