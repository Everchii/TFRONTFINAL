import { Routes } from '@angular/router';
import { RestaurantsListComponent } from './features/restaurants/list/list.component';
import { RestaurantFormComponent } from './features/restaurants/form/form.component';
import { ZoneFormComponent } from './features/zones/form/form.component';
import { MesasListComponent } from './features/mesas/list/list.component';
import { MesaFormComponent } from './features/mesas/form/form.component';
import { MesaFormGlobalComponent } from './features/mesas/form-global/form-global.component';

export const routes: Routes = [
  { path: '', redirectTo: 'restaurants', pathMatch: 'full' },
  { path: 'restaurants', loadComponent: () => RestaurantsListComponent },
  { path: 'restaurants/new', loadComponent: () => RestaurantFormComponent },
  { path: 'restaurants/edit/:id', loadComponent: () => RestaurantFormComponent },
  { path: 'zones/new', loadComponent: () => ZoneFormComponent },       // <-- asegurate de importar
  { path: 'zones/edit/:id', loadComponent: () => ZoneFormComponent },  // <-- editar zona
  { path: 'mesas/new', loadComponent: () => MesaFormComponent },
  { path: 'mesas/edit/:id', loadComponent: () => MesaFormComponent },
  { path: 'mesas/new-global', loadComponent: () => MesaFormGlobalComponent },
];
