/** Restaurante */
export interface Restaurant {
  id: string;
  nombre: string;
}

/** Zona o ambiente de un restaurante */
export interface Zone {
  id: string;
  nombre: string;
  restaurantId: string;
  horarios: string[]; // ej: ["11:00", "12:00", "13:00", "20:00", "21:00"]
}

/** Mesa de una zona */
export interface Mesa {
  id: string;
  numero: number;
  capacidad: number;
  zoneId: string;
}

/** Reserva de una mesa */
export interface Reservation {
  id: string;
  fecha: string;           // ej: "2025-11-20"
  // `hora` se mantiene por compatibilidad; preferir `horas` para reservas multi-hora
  hora?: string;           // ej: "20:00"
  horas?: string[];        // ej: ["20:00", "21:00"]
  cantidadPersonas: number;
  idMesaAsignada: string;
  nombre: string;
  apellido: string;
  telefono: string;
  restaurantId: string;
  zoneId: string;
}


