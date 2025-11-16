import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantsService } from '../../../core/services/restaurants.service';
import { ZonesListComponent } from '../../zones/list/list.component'; // <-- importamos el componente de Zonas

@Component({
  selector: 'app-restaurant-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZonesListComponent], // <-- agregamos ZonesListComponent
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class RestaurantFormComponent implements OnInit {
  form: FormGroup;
  editingId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private rs: RestaurantsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    // Revisar si hay un id en la URL para edición
    this.editingId = this.route.snapshot.paramMap.get('id');
    if (this.editingId) {
      const restaurant = this.rs.get(this.editingId);
      if (restaurant) {
        this.form.patchValue({ nombre: restaurant.nombre });
      }
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const nombre = this.form.value.nombre;

    if (this.editingId) {
      this.rs.update({ id: this.editingId, nombre });
    } else {
      const newRestaurant = this.rs.add(nombre);
      this.editingId = newRestaurant.id; // actualizar editingId para poder crear zonas después
    }

    this.router.navigate(['/restaurants']);
  }

  cancel() {
    this.router.navigate(['/restaurants']);
  }

  // --- NUEVO MÉTODO PARA CREAR ZONA ---
  createNewZone() {
    if (!this.editingId) return;
    this.router.navigate(['/zones/new'], { queryParams: { restaurantId: this.editingId } });
  }
}
