import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ZonesService } from '../../../core/services/zones.service';
import { Zone } from '../../../core/models';

@Component({
  selector: 'app-zones-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ZonesListComponent implements OnInit {
  @Input() restaurantId!: string;

  zones: Zone[] = [];

  constructor(private zs: ZonesService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.zones = this.zs.list(this.restaurantId);
  }

  edit(id: string) {
    this.router.navigate(['/zones/edit', id]);
  }

  createNew() {
    this.router.navigate(['/zones/new', { restaurantId: this.restaurantId }]);
  }

  remove(id: string) {
    if (!confirm('¿Confirmás eliminar esta zona?')) return;
    this.zs.remove(id);
    this.load();
  }
}
