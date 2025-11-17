import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Restaurant } from '../models';
import { ZonesService } from './zones.service';
import { MesasService } from './mesas.service';
import { ReservationsService } from './reservations.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {
  private key = 'restaurants';

  constructor(
    private storage: StorageService,
    private zonesService: ZonesService,
    private mesasService: MesasService,
    private reservationsService: ReservationsService
  ) {}

  // Devuelve todos los restaurantes
  list(): Restaurant[] {
    return this.storage.get<Restaurant[]>(this.key) || [];
  }

  // Devuelve un restaurante por id
  get(id: string): Restaurant | undefined {
    return this.list().find(r => r.id === id);
  }

  // Agrega un restaurante nuevo
  add(nombre: string): Restaurant {
    const items = this.list();
    const newItem: Restaurant = {
      id: Date.now().toString(), // id único simple
      nombre: nombre.trim()
    };
    items.push(newItem);
    this.storage.set(this.key, items);
    return newItem;
  }

  // Actualiza un restaurante existente
  update(updated: Restaurant): boolean {
    const items = this.list();
    const idx = items.findIndex(i => i.id === updated.id);
    if (idx === -1) return false;
    items[idx] = { ...updated, nombre: updated.nombre.trim() };
    this.storage.set(this.key, items);
    return true;
  }

  // Elimina un restaurante por id y TODO lo relacionado
  remove(id: string): void {
    // 1) Obtener todas las zonas del restaurante
    const zones = this.zonesService.list(id);

    // 2) Por cada zona, eliminar mesas y reservas asociadas, y luego la zona
    zones.forEach(zone => {
      // Eliminar mesas de la zona
      const mesas = this.mesasService.list(zone.id);
      mesas.forEach(m => this.mesasService.remove(m.id));

      // Eliminar reservas de esa zona (para ese restaurante)
      const reservasZona = this.reservationsService.filter(id, zone.id);
      reservasZona.forEach(r => this.reservationsService.remove(r.id));

      // Eliminar la zona
      this.zonesService.remove(zone.id);
    });

    // 3) Por seguridad extra, eliminar cualquier reserva que quede ligada al restaurante
    const reservasRestaurante = this.reservationsService.filter(id);
    reservasRestaurante.forEach(r => this.reservationsService.remove(r.id));

    // 4) Finalmente, eliminar el restaurante
    const items = this.list().filter(i => i.id !== id);
    this.storage.set(this.key, items);
  }
}