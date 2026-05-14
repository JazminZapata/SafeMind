import { Estudiante } from './Estudiante';
import { Profesional } from './Profesional';

export type EstadoSesion = 'activa' | 'cerrada';

export class Sesion {
  id?: number;
  estudiante_id?: number;
  profesional_id?: number;
  tema?: string;
  estado?: EstadoSesion;
  created_at?: string;
  estudiante?: Estudiante;
  profesional?: Profesional;
}
