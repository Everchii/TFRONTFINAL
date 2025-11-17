import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RestaurantsService } from '../../../core/services/restaurants.service';
import { ZonesService } from '../../../core/services/zones.service';
import { ReservationsService } from '../../../core/services/reservations.service';
import { MesasService } from '../../../core/services/mesas.service';
import { Restaurant, Zone, Reservation, Mesa } from '../../../core/models';

@Component({
  selector: 'app-reservations-listado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ReservationsListadoComponent implements OnInit {
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  restaurants: Restaurant[] = [];
  zones: Zone[] = [];

  // Filtros
  filterRestaurantId: string = '';
  filterZoneId: string = '';
  filterFecha: string = '';

  constructor(
    private rs: RestaurantsService,
    private zs: ZonesService,
    private reservaService: ReservationsService,
    private mesasService: MesasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
    this.restaurants = this.rs.list();
    // cargar todas las zonas inicialmente para permitir filtrado por zona sin seleccionar restaurante
    this.zones = this.zs.list();
  }

  load(): void {
    this.reservations = this.reservaService.list();
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredReservations = this.reservaService.filter(
      this.filterRestaurantId || undefined,
      this.filterZoneId || undefined,
      this.filterFecha || undefined
    );
  }

  onRestaurantChange(): void {
    // Al cambiar restaurante, vaciar zona y cargar zonas apropiadas (todas si no hay restaurante seleccionado)
    this.filterZoneId = '';
    this.zones = this.filterRestaurantId ? this.zs.list(this.filterRestaurantId) : this.zs.list();
    this.applyFilters();
  }

  onZoneChange(): void {
    this.applyFilters();
  }

  onFechaChange(): void {
    this.applyFilters();
  }

  getRestaurantName(id: string): string {
    return this.rs.get(id)?.nombre || 'Desconocido';
  }

  getZoneName(id: string): string {
    return this.zs.get(id)?.nombre || 'Desconocida';
  }

  getMesaNumber(mesaId: string): string {
    const mesa = this.mesasService.get(mesaId);
    return mesa ? `Mesa ${mesa.numero}` : 'N/A';
  }

  deleteReservation(id: string): void {
    // Eliminada confirmación modal nativa por petición del usuario
    this.reservaService.remove(id);
    this.load();
  }

  newReservation(): void {
    this.router.navigate(['/reservations/new']);
  }

  back(): void {
    this.router.navigate(['/restaurants']);
  }
}
