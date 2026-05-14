import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/services/security.service';
import { SesionService } from 'src/app/services/sesion.service';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { PersonaService } from 'src/app/services/persona.service';
import { Sesion } from 'src/app/models/Sesion';
import { HorarioItem } from 'src/app/models/Estudiante';

interface DashboardStats {
  sesionesActivas: number;
  sesionesTotales: number;
  actividadesHoy: number;
  estadoAnimo: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  userName: string = 'Usuario';
  stats: DashboardStats = {
    sesionesActivas: 0,
    sesionesTotales: 0,
    actividadesHoy: 0,
    estadoAnimo: 'Bien'
  };
  
  proximasActividades: HorarioItem[] = [];
  sesionesRecientes: Sesion[] = [];
  
  tipDelDia: string = '';
  
  private tips: string[] = [
    'Recuerda tomar descansos regulares durante tus sesiones de estudio. La tecnica Pomodoro puede ayudarte.',
    'Dormir bien es fundamental para tu rendimiento academico. Intenta mantener un horario de sueno regular.',
    'La actividad fisica mejora la concentracion y reduce el estres. Intenta caminar al menos 30 minutos al dia.',
    'Hablar sobre tus preocupaciones puede aliviar la carga emocional. No dudes en buscar apoyo.',
    'Organiza tus tareas por prioridad. Comienza con las mas importantes cuando tengas mas energia.',
    'La meditacion y la respiracion consciente pueden ayudarte a manejar la ansiedad antes de examenes.',
    'Mantente hidratado. El agua es esencial para el funcionamiento optimo del cerebro.',
    'Celebra tus pequenos logros. Cada paso cuenta en tu camino academico.'
  ];

  constructor(
    private securityService: SecurityService,
    private sesionService: SesionService,
    private estudianteService: EstudianteService,
    private personaService: PersonaService
  ) { }

  ngOnInit() {
    this.loadUserInfo();
    this.loadTipDelDia();
    this.loadStats();
    this.loadSesionesRecientes();
    this.loadProximasActividades();
  }

  private loadUserInfo() {
    const user = this.securityService.activeUserSession;
    if (user && user.name) {
      this.userName = user.name.split(' ')[0]; // Solo el primer nombre
    }
  }

  private loadTipDelDia() {
    const today = new Date().getDate();
    const tipIndex = today % this.tips.length;
    this.tipDelDia = this.tips[tipIndex];
  }

  private loadStats() {
    // Por ahora usamos datos de ejemplo
    // En produccion, esto vendria del backend
    this.stats = {
      sesionesActivas: 1,
      sesionesTotales: 5,
      actividadesHoy: 3,
      estadoAnimo: 'Bien'
    };
  }

  private loadSesionesRecientes() {
    // Intentar cargar sesiones del backend
    // Por ahora mostramos datos de ejemplo
    this.sesionesRecientes = [
      {
        id: 1,
        tema: 'Manejo del estres',
        estado: 'activa',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        tema: 'Organizacion del tiempo',
        estado: 'cerrada',
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }

  private loadProximasActividades() {
    // Por ahora mostramos datos de ejemplo
    const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const hoyIndex = new Date().getDay();
    const hoy = diasSemana[hoyIndex];
    
    // Ejemplo de actividades
    this.proximasActividades = [
      { titulo: 'Calculo II', hora: '08:00', tipo: 'clase' },
      { titulo: 'Estudio grupal', hora: '14:00', tipo: 'estudio' },
      { titulo: 'Descanso', hora: '16:00', tipo: 'descanso' }
    ];
  }
}
