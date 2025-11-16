import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MesasService } from '../../../core/services/mesas.service';
import { Mesa } from '../../../core/models';

@Component({
  selector: 'app-mesas-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class MesasListComponent implements OnInit {
  @Input() zoneId!: string; // ahora obligatorio

  mesas: Mesa[] = [];

  constructor(private ms: MesasService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.mesas = this.ms.list(this.zoneId); // solo mesas de la zona
  }

  edit(id: string) {
    this.router.navigate(['/mesas/edit', id], { queryParams: { zoneId: this.zoneId } });
  }

  createNew() {
    this.router.navigate(['/mesas/new'], { queryParams: { zoneId: this.zoneId } });
  }

  remove(id: string) {
    if (!confirm('¿Confirmás eliminar esta mesa?')) return;
    this.ms.remove(id);
    this.load();
  }
}
