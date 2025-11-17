import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ZonesService } from '../../../core/services/zones.service';
import { RestaurantsService } from '../../../core/services/restaurants.service';
import { Zone, Restaurant } from '../../../core/models';
import { MesasListComponent } from '../../mesas/list/list.component';

@Component({
  selector: 'app-zone-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MesasListComponent],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class ZoneFormComponent implements OnInit {
  form: FormGroup;
  editingId: string | null = null;
  restaurants: Restaurant[] = [];

  constructor(
    private fb: FormBuilder,
    private zs: ZonesService,
    private rs: RestaurantsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      restaurantId: [null, Validators.required],
      nombre: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    this.loadRestaurants();
    this.editingId = this.route.snapshot.paramMap.get('id');
    
    // Obtener restaurantId desde queryParams si viene al crear
    const queryRestaurantId = this.route.snapshot.queryParams['restaurantId'];
    if (queryRestaurantId) {
      this.form.get('restaurantId')?.setValue(queryRestaurantId);
    }

    if (this.editingId) {
      const zone = this.zs.get(this.editingId);
      if (zone) {
        this.form.patchValue({
          restaurantId: zone.restaurantId,
          nombre: zone.nombre
        });
      }
    }
  }

  loadRestaurants(): void {
    this.restaurants = this.rs.list();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { restaurantId, nombre } = this.form.value;

    if (this.editingId) {
      const existing = this.zs.get(this.editingId);
      if (existing) {
        this.zs.update({
          id: this.editingId,
          nombre,
          restaurantId,
          horarios: existing.horarios || []
        });
      }
    } else {
      this.zs.add(nombre, restaurantId);
    }

    // Mensaje nativo eliminado por petición del usuario
    this.router.navigate(['/zones']);
  }

  cancel(): void {
    this.router.navigate(['/zones']);
  }
}
