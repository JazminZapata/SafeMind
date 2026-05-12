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

    // Datos de ejemplo
    this.sesiones = [
      {
        id: 1,
        tema: 'Manejo del estres academico',
        estado: 'activa',
        created_at: new Date().toISOString(),
        profesional: {
          id: 1,
          especialidad: 'Psicologia Clinica',
          persona: {
            nombre: 'Dra. Maria Garcia'
          }
        }
      },
      {
        id: 2,
        tema: 'Organizacion del tiempo',
        estado: 'cerrada',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        profesional: {
          id: 2,
          especialidad: 'Coaching Academico',
          persona: {
            nombre: 'Dr. Carlos Lopez'
          }
        }
      },
      {
        id: 3,
        tema: 'Ansiedad por examenes',
        estado: 'cerrada',
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        profesional: {
          id: 1,
          especialidad: 'Psicologia Clinica',
          persona: {
            nombre: 'Dra. Maria Garcia'
          }
        }
      },
      {
        id: 4,
        tema: 'Orientacion de carrera',
        estado: 'cerrada',
        created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
        profesional: {
          id: 3,
          especialidad: 'Orientacion Vocacional',
          persona: {
            nombre: 'Lic. Ana Martinez'
          }
        }
      },
      {
        id: 5,
        tema: 'Tecnicas de estudio',
        estado: 'activa',
        created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        profesional: {
          id: 2,
          especialidad: 'Coaching Academico',
          persona: {
            nombre: 'Dr. Carlos Lopez'
          }
        }
      }
    ];

    this.isLoading = false;
  }

  get sesionesFiltradas(): Sesion[] {
    if (!this.filtroEstado) {
      return this.sesiones;
    }
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
