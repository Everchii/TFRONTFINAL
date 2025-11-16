import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Restaurant } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {
  private key = 'restaurants';

  constructor(private storage: StorageService) {}

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

  // Elimina un restaurante por id
  remove(id: string): void {
    const items = this.list().filter(i => i.id !== id);
    this.storage.set(this.key, items);
  }
}
