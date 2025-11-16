import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private prefix = 'rm_'; // rm = reservas-mesas

  constructor() {}

  get<T>(key: string): T | null {
    const raw = localStorage.getItem(this.prefix + key);
    return raw ? JSON.parse(raw) as T : null;
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(this.prefix + key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }
}
