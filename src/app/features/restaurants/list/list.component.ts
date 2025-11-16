import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RestaurantsService } from '../../../core/services/restaurants.service';
import { Restaurant } from '../../../core/models';

@Component({
  selector: 'app-restaurants-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class RestaurantsListComponent implements OnInit {
  restaurants: Restaurant[] = [];

  constructor(private rs: RestaurantsService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.restaurants = this.rs.list();
  }

  edit(id: string) {
    this.router.navigate(['/restaurants/edit', id]);
  }

  createNew() {
    this.router.navigate(['/restaurants/new']);
  }

  remove(id: string) {
    if (!confirm('¿Confirmás eliminar este restaurante?')) return;
    this.rs.remove(id);
    this.load();
  }

  // --- NUEVO MÉTODO PARA CREAR ZONA ---
  createNewZone(restaurantId: string) {
    this.router.navigate(['/zones/new'], { queryParams: { restaurantId } });
  }

  // --- NUEVO MÉTODO PARA CREAR MESA GLOBAL ---
  createNewMesaGlobal() {
    this.router.navigate(['/mesas/new-global']);
  }
}
