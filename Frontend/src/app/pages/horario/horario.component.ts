import { Component, OnInit } from '@angular/core';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { HorarioItem, Horario } from 'src/app/models/Estudiante';

interface DiaHorario {
  key: string;
  nombre: string;
  actividades: HorarioItem[];
}

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.scss']
})
export class HorarioComponent implements OnInit {

  diasSemana: DiaHorario[] = [];
  showModal: boolean = false;
  isEditing: boolean = false;
  
  diaSeleccionado: string = '';
  actividadIndex: number = -1;
  
  nuevaActividad: HorarioItem = {
    titulo: '',
    hora: '',
    tipo: 'clase'
  };

  tiposActividad = [
    { value: 'clase', label: 'Clase', color: 'primary' },
    { value: 'estudio', label: 'Estudio', color: 'success' },
    { value: 'descanso', label: 'Descanso', color: 'warning' },
    { value: 'otro', label: 'Otro', color: 'info' }
  ];

  constructor(private estudianteService: EstudianteService) { }

  ngOnInit() {
    this.initDiasSemana();
    this.loadHorario();
  }

  private initDiasSemana() {
    this.diasSemana = [
      { key: 'lunes', nombre: 'Lunes', actividades: [] },
      { key: 'martes', nombre: 'Martes', actividades: [] },
      { key: 'miercoles', nombre: 'Miercoles', actividades: [] },
      { key: 'jueves', nombre: 'Jueves', actividades: [] },
      { key: 'viernes', nombre: 'Viernes', actividades: [] },
      { key: 'sabado', nombre: 'Sabado', actividades: [] },
      { key: 'domingo', nombre: 'Domingo', actividades: [] }
    ];
  }

  private loadHorario() {
    // Datos de ejemplo - en produccion vendria del backend
    const horarioEjemplo: Horario = {
      lunes: [
        { titulo: 'Calculo II', hora: '08:00', tipo: 'clase' },
        { titulo: 'Programacion', hora: '10:00', tipo: 'clase' },
        { titulo: 'Almuerzo', hora: '12:00', tipo: 'descanso' },
        { titulo: 'Estudio personal', hora: '14:00', tipo: 'estudio' }
      ],
      martes: [
        { titulo: 'Fisica', hora: '09:00', tipo: 'clase' },
        { titulo: 'Laboratorio', hora: '11:00', tipo: 'clase' },
        { titulo: 'Grupo de estudio', hora: '15:00', tipo: 'estudio' }
      ],
      miercoles: [
        { titulo: 'Calculo II', hora: '08:00', tipo: 'clase' },
        { titulo: 'Ingles', hora: '10:00', tipo: 'clase' },
        { titulo: 'Deporte', hora: '16:00', tipo: 'descanso' }
      ],
      jueves: [
        { titulo: 'Programacion', hora: '08:00', tipo: 'clase' },
        { titulo: 'Tutoria', hora: '14:00', tipo: 'otro' }
      ],
      viernes: [
        { titulo: 'Fisica', hora: '09:00', tipo: 'clase' },
        { titulo: 'Proyecto grupal', hora: '11:00', tipo: 'estudio' },
        { titulo: 'Tiempo libre', hora: '15:00', tipo: 'descanso' }
      ],
      sabado: [
        { titulo: 'Repaso semanal', hora: '10:00', tipo: 'estudio' }
      ],
      domingo: [
        { titulo: 'Descanso', hora: '10:00', tipo: 'descanso' }
      ]
    };

    // Asignar actividades a los dias
    this.diasSemana.forEach(dia => {
      const actividades = horarioEjemplo[dia.key as keyof Horario];
      if (actividades) {
        dia.actividades = [...actividades];
      }
    });
  }

  abrirModalAgregar(diaKey: string) {
    this.diaSeleccionado = diaKey;
    this.isEditing = false;
    this.actividadIndex = -1;
    this.nuevaActividad = { titulo: '', hora: '', tipo: 'clase' };
    this.showModal = true;
  }

  abrirModalEditar(diaKey: string, index: number, actividad: HorarioItem) {
    this.diaSeleccionado = diaKey;
    this.isEditing = true;
    this.actividadIndex = index;
    this.nuevaActividad = { ...actividad };
    this.showModal = true;
  }

  guardarActividad() {
    if (!this.nuevaActividad.titulo || !this.nuevaActividad.hora) return;

    const dia = this.diasSemana.find(d => d.key === this.diaSeleccionado);
    if (!dia) return;

    if (this.isEditing && this.actividadIndex >= 0) {
      dia.actividades[this.actividadIndex] = { ...this.nuevaActividad };
    } else {
      dia.actividades.push({ ...this.nuevaActividad });
      // Ordenar por hora
      dia.actividades.sort((a, b) => a.hora.localeCompare(b.hora));
    }

    this.cerrarModal();
    this.guardarEnBackend();
  }

  eliminarActividad(diaKey: string, index: number) {
    const dia = this.diasSemana.find(d => d.key === diaKey);
    if (dia) {
      dia.actividades.splice(index, 1);
      this.guardarEnBackend();
    }
  }

  cerrarModal() {
    this.showModal = false;
    this.diaSeleccionado = '';
    this.actividadIndex = -1;
    this.nuevaActividad = { titulo: '', hora: '', tipo: 'clase' };
  }

  private guardarEnBackend() {
    // Construir objeto horario para enviar al backend
    const horario: Horario = {};
    this.diasSemana.forEach(dia => {
      if (dia.actividades.length > 0) {
        horario[dia.key as keyof Horario] = dia.actividades;
      }
    });
    
    // En produccion, enviar al backend
    console.log('Horario a guardar:', horario);
  }

  getTipoColor(tipo: string): string {
    const tipoInfo = this.tiposActividad.find(t => t.value === tipo);
    return tipoInfo ? tipoInfo.color : 'info';
  }

  getDiaNombre(key: string): string {
    const dia = this.diasSemana.find(d => d.key === key);
    return dia ? dia.nombre : key;
  }

  isHoy(diaKey: string): boolean {
    const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const hoyIndex = new Date().getDay();
    return dias[hoyIndex] === diaKey;
  }
}
