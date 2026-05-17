import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estudiante, Horario } from '../models/Estudiante';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  constructor(private http: HttpClient) { }

  list(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${environment.url_backend}/estudiantes`);
  }

  view(id: number): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${environment.url_backend}/estudiantes/${id}`);
  }

  /** Obtiene el estudiante usando el id de la tabla personas */
  getByPersonaId(personaId: number): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${environment.url_backend}/estudiantes/persona/${personaId}`);
  }

  update(id: number, estudiante: Estudiante): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${environment.url_backend}/estudiantes/${id}`, estudiante);
  }

  updateHorario(id: number, horario: Horario): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${environment.url_backend}/estudiantes/${id}/horario`, { horario });
  }
}