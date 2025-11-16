import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ZonesService } from '../../../core/services/zones.service';
import { Zone } from '../../../core/models';
import { MesasListComponent } from '../../mesas/list/list.component'; // <-- importamos mesas

@Component({
  selector: 'app-zone-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MesasListComponent], // <-- agregamos mesas
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class ZoneFormComponent implements OnInit {
  form: FormGroup;
  editingId: string | null = null;
  restaurantId!: string;

  constructor(
    private fb: FormBuilder,
    private zs: ZonesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    this.editingId = this.route.snapshot.paramMap.get('id');
    this.restaurantId = this.route.snapshot.params['restaurantId'];

    if (this.editingId) {
      const zone = this.zs.get(this.editingId);
      if (zone) {
        this.restaurantId = zone.restaurantId;
        this.form.patchValue({ nombre: zone.nombre });
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
      const existing = this.zs.get(this.editingId);
      if (existing) {
        this.zs.update({ 
          id: this.editingId, 
          nombre, 
          restaurantId: this.restaurantId, 
          horarios: existing.horarios || []
        });
      }
    } else {
      this.zs.add(nombre, this.restaurantId);
    }

    this.router.navigate(['/restaurants/edit', this.restaurantId]);
  }

  cancel() {
    this.router.navigate(['/restaurants/edit', this.restaurantId]);
  }
}
