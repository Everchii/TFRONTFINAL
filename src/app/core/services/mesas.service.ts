import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Mesa, Reservation } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MesasService {
  private key = 'mesas';

  constructor(private storage: StorageService) {}

  // Lista mesas de una zona
  list(zoneId: string): Mesa[] {
    const all = this.storage.get<Mesa[]>(this.key) || [];
    return all.filter(m => m.zoneId === zoneId);
  }

  // NUEVO: lista todas las mesas
  listGlobal(): Mesa[] {
    return this.storage.get<Mesa[]>(this.key) || [];
  }

  get(id: string): Mesa | undefined {
    const all = this.storage.get<Mesa[]>(this.key) || [];
    return all.find(m => m.id === id);
  }

  add(numero: number, capacidad: number, zoneId: string): Mesa {
    const all = this.storage.get<Mesa[]>(this.key) || [];
    const newMesa: Mesa = { id: Date.now().toString(), numero, capacidad, zoneId };
    all.push(newMesa);
    this.storage.set(this.key, all);
    return newMesa;
  }

  update(updated: Mesa): boolean {
    const all = this.storage.get<Mesa[]>(this.key) || [];
    const idx = all.findIndex(m => m.id === updated.id);
    if (idx === -1) return false;
    all[idx] = { ...updated };
    this.storage.set(this.key, all);
    return true;
  }

  remove(id: string): void {
    let all = this.storage.get<Mesa[]>(this.key) || [];
    all = all.filter(m => m.id !== id);
    this.storage.set(this.key, all);

    const reservations = this.storage.get<Reservation[]>('reservations') || [];
    const reservationsFiltered = reservations.filter(r => r.idMesaAsignada !== id);
    this.storage.set('reservations', reservationsFiltered);
  }
}
