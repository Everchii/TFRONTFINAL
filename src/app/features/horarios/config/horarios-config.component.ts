import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ZonesService } from '../../../core/services/zones.service';
import { Zone } from '../../../core/models';

@Component({
  selector: 'app-horarios-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horarios-config.component.html',
  styleUrls: ['./horarios-config.component.scss']
})
export class HorariosConfigComponent implements OnInit {
  zone: Zone | null = null;
  nuevoHorario: string = '';
  errorMsg: string = '';

  constructor(
    private zs: ZonesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const zoneId = this.route.snapshot.paramMap.get('zoneId');
    if (zoneId) {
      this.zone = this.zs.get(zoneId) || null;
    }
  }

  addHorario(): void {
    if (!this.zone || !this.nuevoHorario.trim()) {
      this.errorMsg = 'Por favor ingresa un horario válido';
      return;
    }

    const horario = this.nuevoHorario.trim();

    // Validar formato HH:MM
    if (!/^\d{2}:\d{2}$/.test(horario)) {
      this.errorMsg = 'Formato debe ser HH:MM (ej: 20:00)';
      return;
    }

    if (this.zone.horarios.includes(horario)) {
      this.errorMsg = 'Este horario ya existe';
      return;
    }

    this.zs.addHorario(this.zone.id, horario);
    this.refreshZone();
    this.nuevoHorario = '';
    this.errorMsg = '';
  }

  removeHorario(horario: string): void {
    if (this.zone) {
      this.zs.removeHorario(this.zone.id, horario);
      this.refreshZone();
    }
  }
  private refreshZone() {
    if (this.zone) {
      this.zone = this.zs.get(this.zone.id) || null;
    }
  }

  back(): void {
    if (this.zone) {
      this.router.navigate(['/restaurants/edit', this.zone.restaurantId]);
    } else {
      this.router.navigate(['/restaurants']);
    }
  }
}
