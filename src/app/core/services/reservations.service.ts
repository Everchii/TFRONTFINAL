import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Reservation, Mesa } from '../models';
import { MesasService } from './mesas.service';
import { ZonesService } from './zones.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  private key = 'reservations';

  constructor(
    private storage: StorageService,
    private mesasService: MesasService,
    private zonesService: ZonesService
  ) {}

  // Obtener todas las reservas
  list(): Reservation[] {
    return this.storage.get<Reservation[]>(this.key) || [];
  }

  // Filtrar reservas por restaurante, zona y/o fecha
  filter(restaurantId?: string, zoneId?: string, fecha?: string): Reservation[] {
    let result = this.list();

    if (restaurantId) {
      result = result.filter(r => r.restaurantId === restaurantId);
    }
    if (zoneId) {
      result = result.filter(r => r.zoneId === zoneId);
    }
    if (fecha) {
      result = result.filter(r => r.fecha === fecha);
    }

    return result;
  }

  // Obtener una reserva por ID
  get(id: string): Reservation | undefined {
    return this.list().find(r => r.id === id);
  }

  /**
   * Encontrar mesas disponibles para una zona, fecha, hora y cantidad de personas.
   * Retorna la mesa más adecuada (capacidad exacta o mínima suficiente).
   */
  findAvailableMesa(
    zoneId: string,
    fecha: string,
    hora: string,
    cantidadPersonas: number
  ): Mesa | null {
    // Obtener todas las mesas de la zona
    const allMesas = this.mesasService.listGlobal().filter(m => m.zoneId === zoneId);

    if (allMesas.length === 0) return null;

    // Obtener reservas en conflicto (misma zona, fecha, hora)
    const reservadasEnMomento = this.list().filter(
      r => r.zoneId === zoneId && r.fecha === fecha && r.hora === hora
    );

    const mesasReservadas = new Set(reservadasEnMomento.map(r => r.idMesaAsignada));

    // Filtrar mesas disponibles con capacidad suficiente
    const mesasDisponibles = allMesas.filter(
      m => !mesasReservadas.has(m.id) && m.capacidad >= cantidadPersonas
    );

    if (mesasDisponibles.length === 0) return null;

    // Elegir la mesa con menor capacidad (mejor ajuste)
    mesasDisponibles.sort((a, b) => a.capacidad - b.capacidad);
    return mesasDisponibles[0];
  }

  // Agregar una nueva reserva
  add(
    fecha: string,
    hora: string,
    cantidadPersonas: number,
    nombre: string,
    apellido: string,
    telefono: string,
    restaurantId: string,
    zoneId: string
  ): Reservation | null {
    // Buscar mesa disponible
    const mesaDisponible = this.findAvailableMesa(zoneId, fecha, hora, cantidadPersonas);
    if (!mesaDisponible) {
      console.warn(
        `No hay mesas disponibles en zona ${zoneId} para ${fecha} ${hora} con ${cantidadPersonas} personas`
      );
      return null;
    }

    const reservas = this.list();
    const newReserva: Reservation = {
      id: Date.now().toString(),
      fecha: fecha.trim(),
      hora: hora.trim(),
      cantidadPersonas,
      idMesaAsignada: mesaDisponible.id,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      telefono: telefono.trim(),
      restaurantId,
      zoneId
    };

    reservas.push(newReserva);
    this.storage.set(this.key, reservas);
    return newReserva;
  }

  // Actualizar una reserva existente
  update(updated: Reservation): boolean {
    const reservas = this.list();
    const idx = reservas.findIndex(r => r.id === updated.id);
    if (idx === -1) return false;

    reservas[idx] = {
      ...updated,
      nombre: updated.nombre.trim(),
      apellido: updated.apellido.trim(),
      telefono: updated.telefono.trim()
    };

    this.storage.set(this.key, reservas);
    return true;
  }

  // Eliminar una reserva
  remove(id: string): void {
    const reservas = this.list().filter(r => r.id !== id);
    this.storage.set(this.key, reservas);
  }
}
