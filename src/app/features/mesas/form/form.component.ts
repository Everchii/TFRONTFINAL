import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MesasService } from '../../../core/services/mesas.service';
import { ZonesService } from '../../../core/services/zones.service';
import { Zone } from '../../../core/models';

@Component({
  selector: 'app-mesa-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class MesaFormComponent implements OnInit {
  form: FormGroup;
  editingId: string | null = null;
  zoneId!: string;
  zonas: Zone[] = [];

  constructor(
    private fb: FormBuilder,
    private ms: MesasService,
    private zs: ZonesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      numero: [null, [Validators.required, Validators.min(1)]],
      capacidad: [null, [Validators.required, Validators.min(1)]],
      zoneId: [null, Validators.required] // <- corregido
    });
  }

  ngOnInit(): void {
    this.editingId = this.route.snapshot.paramMap.get('id');
    this.zoneId = this.route.snapshot.queryParamMap.get('zoneId') || '';

    if (this.zoneId) {
      // cargamos solo la zona seleccionada
      const zona = this.zs.get(this.zoneId);
      if (zona) this.zonas = [zona];
    }

    if (this.editingId) {
      const mesa = this.ms.get(this.editingId);
      if (mesa) {
        this.form.patchValue({
          numero: mesa.numero,
          capacidad: mesa.capacidad,
          zoneId: mesa.zoneId // <- corregido
        });
        this.zoneId = mesa.zoneId;
      }
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { numero, capacidad, zoneId } = this.form.value; // <- corregido

    if (this.editingId) {
      this.ms.update({ id: this.editingId, numero, capacidad, zoneId }); // <- corregido
    } else {
      this.ms.add(numero, capacidad, zoneId); // <- corregido
    }

    this.router.navigate(['/zones/edit', this.zoneId]);
  }

  cancel() {
    this.router.navigate(['/zones/edit', this.zoneId]);
  }
}
