import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ZonesService } from '../../../core/services/zones.service';
import { RestaurantsService } from '../../../core/services/restaurants.service';
import { Zone, Restaurant } from '../../../core/models';

@Component({
  selector: 'app-zones-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ZonesListComponent implements OnInit {
  @Input() restaurantId?: string; // opcional

  zones: Zone[] = [];
  restaurants: Restaurant[] = [];
  selectedRestaurant: string = '';

  constructor(
    private zs: ZonesService,
    private rs: RestaurantsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();
    if (this.restaurantId) {
      this.selectedRestaurant = this.restaurantId;
    }
    this.loadZones();
  }

  loadRestaurants(): void {
    this.restaurants = this.rs.list();
  }

  loadZones(): void {
    if (this.restaurantId) {
      // Si viene con restaurantId desde Input, mostrar solo zonas de ese restaurante
      this.zones = this.zs.list(this.restaurantId);
    } else if (this.selectedRestaurant) {
      // Si está filtrado por restaurante desde el dropdown
      this.zones = this.zs.list(this.selectedRestaurant);
    } else {
      // Si no hay filtro, mostrar todas las zonas
      this.zones = this.zs.list();
    }
  }

  onRestaurantChange(): void {
    this.loadZones();
  }

  edit(id: string): void {
    this.router.navigate(['/zones/edit', id]);
  }

  createNew(): void {
    if (this.restaurantId) {
      // Si viene con restaurantId desde Input, usar ese
      this.router.navigate(['/zones/new'], { queryParams: { restaurantId: this.restaurantId } });
    } else if (this.selectedRestaurant) {
      // Si está filtrado por restaurante desde el dropdown, usar ese
      this.router.navigate(['/zones/new'], { queryParams: { restaurantId: this.selectedRestaurant } });
    } else {
      // Si no hay selección, navegar al formulario sin preseleccionar
      // El formulario permitirá seleccionar el restaurante
      this.router.navigate(['/zones/new']);
    }
  }

  remove(id: string): void {
    // Eliminada confirmación modal nativa por petición del usuario
    this.zs.remove(id);
    this.loadZones();
  }

  configHorarios(id: string): void {
    this.router.navigate(['/zones/horarios', id]);
  }
}
