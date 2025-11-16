import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Zone } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ZonesService {
  private key = 'zones';

  constructor(private storage: StorageService) {}

  // Listar todas las zonas, opcionalmente filtradas por restaurante
  list(restaurantId?: string): Zone[] {
    const all = this.storage.get<Zone[]>(this.key) || [];
    if (restaurantId) {
      return all.filter(z => z.restaurantId === restaurantId);
    }
    return all;
  }

  get(id: string): Zone | undefined {
    return this.list().find(z => z.id === id);
  }

  add(nombre: string, restaurantId: string): Zone {
    const zones = this.list();
    const newZone: Zone = {
      id: Date.now().toString(),
      nombre: nombre.trim(),
      restaurantId,
      horarios: [] // inicializamos como vacío para que TypeScript no se queje
    };
    zones.push(newZone);
    this.storage.set(this.key, zones);
    return newZone;
  }

  update(updated: Zone): boolean {
    const zones = this.list();
    const idx = zones.findIndex(z => z.id === updated.id);
    if (idx === -1) return false;
    zones[idx] = { ...updated, nombre: updated.nombre.trim() };
    this.storage.set(this.key, zones);
    return true;
  }

  remove(id: string): void {
    const zones = this.list().filter(z => z.id !== id);
    this.storage.set(this.key, zones);
  }
}
