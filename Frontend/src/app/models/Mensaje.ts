import { Persona } from './Persona';

export class Mensaje {
  id?: number;
  sesion_id?: number;
  remitente_id?: number;
  contenido?: string;
  created_at?: string;
  remitente?: Persona;
}
