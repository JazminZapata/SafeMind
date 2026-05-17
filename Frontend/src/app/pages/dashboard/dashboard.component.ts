import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/services/security.service';
import { SesionService } from 'src/app/services/sesion.service';
import { EstudianteService } from 'src/app/services/estudiante.service';
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
    private estudianteService: EstudianteService
  ) { }

  ngOnInit() {
    this.loadUserInfo();
    this.loadTipDelDia();
    this.loadSesiones();
    this.loadHorarioHoy();
  }

  private loadUserInfo() {
    const user = this.securityService.activeUserSession;
    if (user && user.name) {
      this.userName = user.name.split(' ')[0];
    }
  }

  private loadTipDelDia() {
    const today = new Date().getDate();
    this.tipDelDia = this.tips[today % this.tips.length];
  }

  private loadSesiones() {
    this.sesionService.list().subscribe({
      next: (sesiones) => {
        this.sesionesRecientes = sesiones.slice(0, 5); // últimas 5
        this.stats.sesionesTotales = sesiones.length;
        this.stats.sesionesActivas = sesiones.filter(s => s.estado === 'activa').length;
      },
      error: (err) => console.error('Error cargando sesiones:', err)
    });
  }

  private loadHorarioHoy() {
    const user = this.securityService.activeUserSession;
    if (!user?.id) return;

    this.estudianteService.list().subscribe({
      next: (estudiantes) => {
        const estudiante = estudiantes.find(e => e.persona_id === user.id);
        if (!estudiante?.horario) return;

        const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        const hoy = dias[new Date().getDay()];
        const actividadesHoy = estudiante.horario[hoy as keyof typeof estudiante.horario] || [];

        this.proximasActividades = actividadesHoy as HorarioItem[];
        this.stats.actividadesHoy = actividadesHoy.length;
      },
      error: (err) => console.error('Error cargando horario:', err)
    });
  }
}