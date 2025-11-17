import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MesasService } from '../../../core/services/mesas.service';
import { RestaurantsService } from '../../../core/services/restaurants.service';
import { ZonesService } from '../../../core/services/zones.service';
import { Mesa, Restaurant, Zone } from '../../../core/models';

@Component({
  selector: 'app-mesas-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class MesasListComponent implements OnInit {
  @Input() zoneId?: string; // opcional - si viene por zona específica

  mesas: Mesa[] = [];
  restaurants: Restaurant[] = [];
  zones: Zone[] = [];
  selectedRestaurant: string = '';
  selectedZone: string = '';

  constructor(
    private ms: MesasService,
    private rs: RestaurantsService,
    private zs: ZonesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();
    this.loadMesas();
  }

  loadRestaurants(): void {
    this.restaurants = this.rs.list();
  }

  loadZones(): void {
    if (this.selectedRestaurant) {
      this.zones = this.zs.list(this.selectedRestaurant);
      this.selectedZone = ''; // reset zona
    } else {
      this.zones = [];
      this.selectedZone = '';
    }
  }

  loadMesas(): void {
    let allMesas: Mesa[] = [];

    // Primero, obtenemos las mesas según el filtro de zona
    if (this.zoneId) {
      // Si viene con zoneId desde Input, mostrar solo mesas de esa zona
      allMesas = this.ms.list(this.zoneId);
    } else if (this.selectedZone) {
      // Si está filtrado por zona desde el dropdown
      allMesas = this.ms.list(this.selectedZone);
    } else {
      // Si no hay filtro de zona, obtener todas las mesas
      allMesas = this.ms.listGlobal();
    }

    // Luego, si hay un restaurante seleccionado, filtramos por restaurante
    if (this.selectedRestaurant && !this.zoneId) {
      const zonesDeRestaurante = this.zs.list(this.selectedRestaurant);
      const idsZonasDeRestaurante = zonesDeRestaurante.map(z => z.id);
      allMesas = allMesas.filter(m => idsZonasDeRestaurante.includes(m.zoneId));
    }

    this.mesas = allMesas;
  }

  onRestaurantChange(): void {
    this.loadZones();
    this.loadMesas();
  }

  onZoneChange(): void {
    this.loadMesas();
  }

  edit(id: string): void {
    if (this.zoneId) {
      this.router.navigate(['/mesas/edit', id], { queryParams: { zoneId: this.zoneId } });
    } else {
      this.router.navigate(['/mesas/edit', id]);
    }
  }

  createNew(): void {
    if (this.zoneId) {
      this.router.navigate(['/mesas/new'], { queryParams: { zoneId: this.zoneId } });
    } else if (this.selectedZone) {
      this.router.navigate(['/mesas/new'], { queryParams: { zoneId: this.selectedZone } });
    } else {
      this.router.navigate(['/mesas/new-global']);
    }
  }

  remove(id: string): void {
    // Eliminada confirmación modal nativa por petición del usuario
    this.ms.remove(id);
    this.loadMesas();
  }
}
