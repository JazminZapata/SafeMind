import { Persona } from './Persona';

export interface Disponibilidad {
  lunes?: string;
  martes?: string;
  miercoles?: string;
  jueves?: string;
  viernes?: string;
  sabado?: string;
  domingo?: string;
}

export class Profesional {
  id?: number;
  persona_id?: number;
  especialidad?: string;
  disponibilidad?: Disponibilidad;
  persona?: Persona;
}
