import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="app-navbar">
      <div class="container nav-inner">
        <div class="brand">
          <a [routerLink]="['/restaurants']" class="brand-link">RESERVAS DE RESTAURANTES</a>
        </div>
        <nav class="nav-links">
          <a [routerLink]="['/restaurants']" routerLinkActive="active">Restaurantes</a>
          <a [routerLink]="['/zones']" routerLinkActive="active">Zonas</a>
          <a [routerLink]="['/mesas']" routerLinkActive="active">Mesas</a>
          <a [routerLink]="['/reservations/new']" class="btn btn-sm btn-primary">Nueva Reserva</a>
          <a [routerLink]="['/reservations/list']" class="btn btn-sm" style="box-shadow:none;transform:none">Mis Reservas</a>
        </nav>
      </div>
    </header>

    <main>
      <div class="container main-container">
        <!-- content rendered by routes -->
        <router-outlet></router-outlet>
      </div>
    </main>
  `,
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('tp-reservas');
}
