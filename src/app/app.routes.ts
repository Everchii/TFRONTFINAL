import { Routes } from '@angular/router';
import { RestaurantsListComponent } from './features/restaurants/list/list.component';
import { RestaurantFormComponent } from './features/restaurants/form/form.component';
import { ZoneFormComponent } from './features/zones/form/form.component';
import { ZonesListComponent } from './features/zones/list/list.component';
import { MesasListComponent } from './features/mesas/list/list.component';
import { MesaFormComponent } from './features/mesas/form/form.component';
import { MesaFormGlobalComponent } from './features/mesas/form-global/form-global.component';
import { HorariosConfigComponent } from './features/horarios/config/horarios-config.component';
import { ReservationsRegistroComponent } from './features/reservations/registro/registro.component';
import { ReservationsListadoComponent } from './features/reservations/listado/listado.component';

export const routes: Routes = [
  { path: '', redirectTo: 'restaurants', pathMatch: 'full' },
  
  // Restaurantes
  { path: 'restaurants', loadComponent: () => RestaurantsListComponent },
  { path: 'restaurants/new', loadComponent: () => RestaurantFormComponent },
  { path: 'restaurants/edit/:id', loadComponent: () => RestaurantFormComponent },
  
  // Zonas
  { path: 'zones', loadComponent: () => ZonesListComponent },
  { path: 'zones/new', loadComponent: () => ZoneFormComponent },
  { path: 'zones/edit/:id', loadComponent: () => ZoneFormComponent },
  { path: 'zones/horarios/:zoneId', loadComponent: () => HorariosConfigComponent },
  
  // Mesas
  { path: 'mesas', loadComponent: () => MesasListComponent },
  { path: 'mesas/new', loadComponent: () => MesaFormComponent },
  { path: 'mesas/edit/:id', loadComponent: () => MesaFormComponent },
  { path: 'mesas/new-global', loadComponent: () => MesaFormGlobalComponent },
  
  // Reservas
  { path: 'reservations/new', loadComponent: () => ReservationsRegistroComponent },
  { path: 'reservations/list', loadComponent: () => ReservationsListadoComponent },
];
