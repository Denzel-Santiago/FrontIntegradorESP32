// temperature.interface.ts
export interface Temperature {
  /**
   * Valor numérico de la temperatura
   * @example 30.8
   */
  value: number;
  
  /**
   * Unidad de medida de la temperatura
   * @example "C" (para Celsius)
   */
  unit: 'C' | 'F' | 'K'; // Tipado literal para las unidades posibles
  
  /**
   * Identificador único del dispositivo ESP32
   * @example "ESP32Publisher-08A6F746C874"
   */
  device_id: string;
  
  /**
   * Marca de tiempo UNIX de la medición (en milisegundos)
   * @example 6929185
   */
  timestamp: number;
  
  /**
   * Modelo/type del sensor utilizado
   * @example "DHT11_Temperature"
   */
  sensor_type: string;
  
  /**
   * Fecha de creación en formato ISO string (opcional - puedes generarla en el frontend si no viene del backend)
   */
  created_at?: string;
}

/**
 * Tipo para eventos de error de temperatura
 */
export interface TemperatureError {
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
export interface TemperatureConnectionStatus {
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
  error?: TemperatureError | null;
}