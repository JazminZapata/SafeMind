import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfesionalService } from 'src/app/services/profesional.service';
import { Profesional } from 'src/app/models/Profesional';

@Component({
  selector: 'app-profesionales',
  templateUrl: './profesionales.component.html',
  styleUrls: ['./profesionales.component.scss']
})
export class ProfesionalesComponent implements OnInit {

  profesionales: Profesional[] = [];
  filtroEspecialidad: string = '';
  isLoading: boolean = false;

  especialidades: string[] = [
    'Psicologia Clinica',
    'Coaching Academico',
    'Orientacion Vocacional',
    'Terapia Cognitivo-Conductual',
    'Psicopedagogia'
  ];

  constructor(
    private profesionalService: ProfesionalService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadProfesionales();
  }

  loadProfesionales() {
    this.isLoading = true;
    
    // Datos de ejemplo
    this.profesionales = [
      {
        id: 1,
        especialidad: 'Psicologia Clinica',
        disponibilidad: {
          lunes: '8:00 - 12:00',
          miercoles: '14:00 - 18:00',
          viernes: '9:00 - 13:00'
        },
        persona: {
          id: 1,
          nombre: 'Dra. Maria Garcia',
          correo: 'maria.garcia@safemind.com',
          telefono: '+57 300 123 4567',
          foto_url: ''
        }
      },
      {
        id: 2,
        especialidad: 'Coaching Academico',
        disponibilidad: {
          martes: '9:00 - 13:00',
          jueves: '15:00 - 19:00'
        },
        persona: {
          id: 2,
          nombre: 'Dr. Carlos Lopez',
          correo: 'carlos.lopez@safemind.com',
          telefono: '+57 301 234 5678',
          foto_url: ''
        }
      },
      {
        id: 3,
        especialidad: 'Orientacion Vocacional',
        disponibilidad: {
          lunes: '14:00 - 18:00',
          viernes: '8:00 - 12:00'
        },
        persona: {
          id: 3,
          nombre: 'Lic. Ana Martinez',
          correo: 'ana.martinez@safemind.com',
          telefono: '+57 302 345 6789',
          foto_url: ''
        }
      },
      {
        id: 4,
        especialidad: 'Terapia Cognitivo-Conductual',
        disponibilidad: {
          martes: '8:00 - 12:00',
          miercoles: '8:00 - 12:00',
          jueves: '8:00 - 12:00'
        },
        persona: {
          id: 4,
          nombre: 'Dr. Roberto Sanchez',
          correo: 'roberto.sanchez@safemind.com',
          telefono: '+57 303 456 7890',
          foto_url: ''
        }
      },
      {
        id: 5,
        especialidad: 'Psicopedagogia',
        disponibilidad: {
          lunes: '9:00 - 13:00',
          miercoles: '9:00 - 13:00'
        },
        persona: {
          id: 5,
          nombre: 'Lic. Laura Ramirez',
          correo: 'laura.ramirez@safemind.com',
          telefono: '+57 304 567 8901',
          foto_url: ''
        }
      }
    ];

    this.isLoading = false;
  }

  get profesionalesFiltrados(): Profesional[] {
    if (!this.filtroEspecialidad) {
      return this.profesionales;
    }
    return this.profesionales.filter(p => 
      p.especialidad?.toLowerCase().includes(this.filtroEspecialidad.toLowerCase())
    );
  }

  getDisponibilidadArray(profesional: Profesional): { dia: string; horario: string }[] {
    if (!profesional.disponibilidad) return [];
    
    const dias: { [key: string]: string } = {
      lunes: 'Lunes',
      martes: 'Martes',
      miercoles: 'Miercoles',
      jueves: 'Jueves',
      viernes: 'Viernes',
      sabado: 'Sabado',
      domingo: 'Domingo'
    };

    return Object.entries(profesional.disponibilidad)
      .filter(([_, horario]) => horario)
      .map(([dia, horario]) => ({
        dia: dias[dia] || dia,
        horario: horario as string
      }));
  }

  iniciarChat(profesional: Profesional) {
    // Navegar al chat con el profesional seleccionado
    this.router.navigate(['/chat'], { 
      queryParams: { profesional: profesional.id } 
    });
  }
}
