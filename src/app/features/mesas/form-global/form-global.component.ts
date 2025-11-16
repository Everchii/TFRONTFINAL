import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestaurantsService } from '../../../core/services/restaurants.service';
import { ZonesService } from '../../../core/services/zones.service';
import { MesasService } from '../../../core/services/mesas.service';
import { Restaurant, Zone } from '../../../core/models';

@Component({
  selector: 'app-mesa-form-global',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-global.component.html',
  styleUrls: ['./form-global.component.scss']
})
export class MesaFormGlobalComponent implements OnInit {
  form: FormGroup;
  restaurants: Restaurant[] = [];
  zones: Zone[] = [];

  constructor(
    private fb: FormBuilder,
    private rs: RestaurantsService,
    private zs: ZonesService,
    private ms: MesasService,
    private router: Router
  ) {
    this.form = this.fb.group({
      restaurantId: [null, Validators.required],
      zoneId: [null, Validators.required],
      numero: [null, [Validators.required, Validators.min(1)]],
      capacidad: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.restaurants = this.rs.list();

    // Detectamos cambio de restaurante para cargar zonas
    this.form.get('restaurantId')?.valueChanges.subscribe(restaurantId => {
      if (restaurantId) {
        this.zones = this.zs.list(restaurantId);
        this.form.get('zoneId')?.setValue(null); // reset zona seleccionada
      } else {
        this.zones = [];
      }
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { restaurantId, zoneId, numero, capacidad } = this.form.value;

    this.ms.add(numero, capacidad, zoneId);

    alert('Mesa creada con éxito!');
    this.router.navigate(['/mesas']);
  }

  cancel() {
    this.router.navigate(['/mesas']);
  }
}
