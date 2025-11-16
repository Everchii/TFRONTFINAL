export interface Restaurant {
  id: string;
  nombre: string;
}

export interface Zone {
  id: string;
  nombre: string;
  restaurantId: string;
  horarios: string[];
}

export interface Table {
  id: string;
  numero: number;
  capacidad: number;
  zoneId: string;
  restaurantId: string;
}

export interface Reservation {
  id: string;
  fecha: string;   
  hora: string;    
  cantidadPersonas: number;
  idMesaAsignada: string;
  nombre: string;
  apellido: string;
  telefono: string;
  restaurantId: string;
  zoneId: string;
}

// este ya es para las zonas
export interface Zone {
  id: string;
  nombre: string;
  restaurantId: string; // para saber a qué restaurante pertenece
}

// para las mesas
export interface Mesa {
  id: string;
  numero: number;
  capacidad: number;
  zoneId: string; // La zona a la que pertenece
}


