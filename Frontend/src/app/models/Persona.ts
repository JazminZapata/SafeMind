export class Persona {
  id?: number;
  firebase_uid?: string;
  nombre?: string;
  correo?: string;
  telefono?: string;
  foto_url?: string;
  rol?: 'estudiante' | 'profesional';
  created_at?: string;
}
