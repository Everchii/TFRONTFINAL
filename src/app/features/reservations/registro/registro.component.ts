import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestaurantsService } from '../../../core/services/restaurants.service';
import { ZonesService } from '../../../core/services/zones.service';
import { ReservationsService } from '../../../core/services/reservations.service';
import { Restaurant, Zone } from '../../../core/models';

@Component({
  selector: 'app-reservations-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class ReservationsRegistroComponent implements OnInit {
  form: FormGroup;
  restaurants: Restaurant[] = [];
  zones: Zone[] = [];
  horarios: string[] = [];
  horariosDisponibles: string[] = [];
  selectedHoras: string[] = [];
  currentStep: 'restaurant' | 'zone' | 'date-time' | 'people' | 'customer' | 'review' = 'restaurant';
  selectedRestaurant: Restaurant | null = null;
  selectedZone: Zone | null = null;
  selectedFecha: string = '';
  selectedHora: string = '';
  selectedCantidadPersonas: number = 0;
  errorMsg: string = '';
  successMsg: string = '';
  mesasDisponibles: number = 0;

  constructor(
    private fb: FormBuilder,
    private rs: RestaurantsService,
    private zs: ZonesService,
    private reservaService: ReservationsService,
    private router: Router
  ) {
    this.form = this.fb.group({
      restaurantId: ['', Validators.required],
      zoneId: ['', Validators.required],
      fecha: ['', Validators.required],
      // `hora` queda opcional; se usa `horas` para reservas multi-hora
      hora: [''],
      horas: [[], Validators.nullValidator],
      cantidadPersonas: [0, [Validators.required, Validators.min(1), Validators.max(50)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.required, Validators.minLength(7)]]
    });
  }

  ngOnInit(): void {
    this.restaurants = this.rs.list();
  }

  // --- Paso 1: Seleccionar Restaurante ---
  selectRestaurant(restaurantId: string): void {
    this.selectedRestaurant = this.rs.get(restaurantId) || null;
    if (this.selectedRestaurant) {
      this.form.patchValue({ restaurantId: this.selectedRestaurant.id });
      this.zones = this.zs.list(this.selectedRestaurant.id);
      this.currentStep = 'zone';
      this.errorMsg = '';
    }
  }

  // --- Paso 2: Seleccionar Zona ---
  selectZone(zoneId: string): void {
    this.selectedZone = this.zs.get(zoneId) || null;
    if (this.selectedZone) {
      this.form.patchValue({ zoneId: this.selectedZone.id });
      this.horarios = this.selectedZone.horarios;

      if (this.horarios.length === 0) {
        this.errorMsg = 'Esta zona no tiene horarios configurados';
        return;
      }

      this.currentStep = 'date-time';
      this.errorMsg = '';
    }
  }

  // --- Filtrar horarios disponibles según la fecha ---
  onFechaChange(fecha: string): void {
    this.selectedFecha = fecha;
    this.form.patchValue({ fecha });
    
    // Filtrar horarios que tengan mesas disponibles en esa fecha
    if (this.selectedZone && fecha) {
      this.horariosDisponibles = this.horarios.filter(horario => {
        const mesaDisponible = this.reservaService['findAvailableMesa'](
          this.selectedZone!.id,
          fecha,
          horario,
          1 // Verificar al menos para 1 persona
        );
        return mesaDisponible !== null;
      });
      
      if (this.horariosDisponibles.length === 0) {
        this.errorMsg = `No hay horarios disponibles para la fecha ${fecha}`;
      } else {
        this.errorMsg = '';
      }
    } else {
      this.horariosDisponibles = [];
    }
  }

  // --- Paso 3: Seleccionar Fecha y Hora ---
  // --- Paso 3: Seleccionar Fecha y Horas (múltiple) ---
  toggleHora(hora: string): void {
    const idx = this.selectedHoras.indexOf(hora);
    if (idx >= 0) {
      this.selectedHoras.splice(idx, 1);
    } else {
      this.selectedHoras.push(hora);
    }
    this.form.patchValue({ horas: this.selectedHoras });
    this.errorMsg = '';
  }

  goToPeopleFromDatetime(): void {
    if (!this.selectedFecha || this.selectedHoras.length === 0) {
      this.errorMsg = 'Seleccioná al menos una hora antes de continuar';
      return;
    }
    this.form.patchValue({ fecha: this.selectedFecha, horas: this.selectedHoras });
    this.currentStep = 'people';
    this.errorMsg = '';
  }

  // --- Paso 4: Cantidad de Personas ---
  setCantidad(cantidad: number): void {
    if (cantidad < 1 || cantidad > 50) {
      this.errorMsg = 'Cantidad de personas debe ser entre 1 y 50';
      return;
    }

    // Validar disponibilidad de mesas para esa cantidad
    if (this.selectedZone && this.selectedFecha && (this.selectedHoras.length > 0 || this.selectedHora)) {
      const horasToCheck = this.selectedHoras.length > 0 ? this.selectedHoras : [this.selectedHora];

      const mesaDisponible = this.reservaService.findAvailableMesaForHours(
        this.selectedZone.id,
        this.selectedFecha,
        horasToCheck,
        cantidad
      );

      if (!mesaDisponible) {
        this.errorMsg = `No hay mesas disponibles para ${cantidad} personas en las horas seleccionadas`;
        this.mesasDisponibles = 0;
        return;
      }

      this.mesasDisponibles = 1; // Hay al menos una mesa disponible
      this.selectedCantidadPersonas = cantidad;
      this.form.patchValue({ cantidadPersonas: cantidad });
      this.currentStep = 'customer';
      this.errorMsg = '';
    }
  }

  // --- Paso 5: Datos del Cliente ---
  goToReview(): void {
    const customerGroup = this.form.get('nombre')?.valid &&
                          this.form.get('apellido')?.valid &&
                          this.form.get('telefono')?.valid;

    if (!customerGroup) {
      this.form.markAllAsTouched();
      this.errorMsg = 'Por favor completa todos los campos requeridos';
      return;
    }

    this.currentStep = 'review';
    this.errorMsg = '';
  }

  // --- Paso 6: Confirmar Reserva ---
  confirmReservation(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMsg = 'Por favor verifica todos los datos';
      return;
    }

    const { nombre, apellido, telefono } = this.form.value;

    if (!this.selectedRestaurant || !this.selectedZone) {
      this.errorMsg = 'Datos incompletos';
      return;
    }
    // Intentar crear la reserva(s)
    if (this.selectedHoras.length > 0) {
      const reservas = this.reservaService.addMultiple(
        this.selectedFecha,
        this.selectedHoras,
        this.selectedCantidadPersonas,
        nombre,
        apellido,
        telefono,
        this.selectedRestaurant.id,
        this.selectedZone.id
      );

      if (reservas && reservas.length > 0) {
        this.successMsg = `¡Reserva confirmada! IDs: ${reservas.map(r => r.id).join(', ')}`;
      } else {
        this.errorMsg = 'No hay mesas disponibles en las horas seleccionadas. Por favor intenta con otra opción.';
        return;
      }
    } else {
      // reserva de una sola hora (compatibilidad)
      const reserva = this.reservaService.add(
        this.selectedFecha,
        this.selectedHora,
        this.selectedCantidadPersonas,
        nombre,
        apellido,
        telefono,
        this.selectedRestaurant.id,
        this.selectedZone.id
      );

      if (reserva) {
        this.successMsg = `¡Reserva confirmada! ID: ${reserva.id}`;
      } else {
        this.errorMsg = 'No hay mesas disponibles en ese horario. Por favor intenta con otra opción.';
        return;
      }
    }

    this.form.reset();
    this.currentStep = 'restaurant';
    this.selectedRestaurant = null;
    this.selectedZone = null;
    this.selectedHoras = [];
    setTimeout(() => {
      this.router.navigate(['/reservations/list']);
    }, 2000);
  }

  // Navegar entre pasos
  goBack(): void {
    if (this.currentStep === 'zone') {
      this.currentStep = 'restaurant';
      this.selectedRestaurant = null;
      this.zones = [];
      this.form.patchValue({ restaurantId: '', zoneId: '' });
    } else if (this.currentStep === 'date-time') {
      this.currentStep = 'zone';
      this.selectedZone = null;
      this.horarios = [];
      this.horariosDisponibles = [];
      this.selectedHoras = [];
      this.form.patchValue({ zoneId: '', fecha: '', hora: '', horas: [] });
    } else if (this.currentStep === 'people') {
      this.currentStep = 'date-time';
      this.selectedCantidadPersonas = 0;
      this.form.patchValue({ cantidadPersonas: 0 });
    } else if (this.currentStep === 'customer') {
      this.currentStep = 'people';
    } else if (this.currentStep === 'review') {
      this.currentStep = 'customer';
    }
    this.errorMsg = '';
  }

  cancel(): void {
    this.router.navigate(['/restaurants']);
  }
}
