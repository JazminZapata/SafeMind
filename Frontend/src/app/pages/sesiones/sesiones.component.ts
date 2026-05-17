import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SesionService } from 'src/app/services/sesion.service';
import { Sesion } from 'src/app/models/Sesion';

@Component({
  selector: 'app-sesiones',
  templateUrl: './sesiones.component.html',
  styleUrls: ['./sesiones.component.scss']
})
export class SesionesComponent implements OnInit {

  sesiones: Sesion[] = [];
  filtroEstado: string = '';
  isLoading: boolean = false;

  constructor(
    private sesionService: SesionService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadSesiones();
  }

  loadSesiones() {
    this.isLoading = true;
    this.sesionService.list().subscribe({
      next: (sesiones) => {
        this.sesiones = sesiones;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando sesiones:', err);
        this.isLoading = false;
      }
    });
  }

  get sesionesFiltradas(): Sesion[] {
    if (!this.filtroEstado) return this.sesiones;
    return this.sesiones.filter(s => s.estado === this.filtroEstado);
  }

  get sesionesActivas(): number {
    return this.sesiones.filter(s => s.estado === 'activa').length;
  }

  get sesionesCerradas(): number {
    return this.sesiones.filter(s => s.estado === 'cerrada').length;
  }

  abrirChat(sesion: Sesion) {
    this.router.navigate(['/chat'], { queryParams: { sesion: sesion.id } });
  }

  nuevaSesion() {
    this.router.navigate(['/profesionales']);
  }
}