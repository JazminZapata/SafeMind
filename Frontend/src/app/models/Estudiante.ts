import { Persona } from './Persona';

export interface HorarioItem {
  titulo: string;
  hora: string;
  tipo?: 'clase' | 'estudio' | 'descanso' | 'otro';
}

export interface Horario {
  lunes?: HorarioItem[];
  martes?: HorarioItem[];
  miercoles?: HorarioItem[];
  jueves?: HorarioItem[];
  viernes?: HorarioItem[];
  sabado?: HorarioItem[];
  domingo?: HorarioItem[];
}

export class Estudiante {
  id?: number;
  persona_id?: number;
  institucion?: string;
  carrera?: string;
  horario?: Horario;
  persona?: Persona;
}
