import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sesion } from '../models/Sesion';
import { environment } from 'src/environments/environment';

export interface CreateSesionRequest {
  estudiante_id: number;
  profesional_id: number;
  tema?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  constructor(private http: HttpClient) { }

  list(): Observable<Sesion[]> {
    return this.http.get<Sesion[]>(`${environment.url_backend}/sesiones`);
  }

  view(id: number): Observable<Sesion> {
    return this.http.get<Sesion>(`${environment.url_backend}/sesiones/${id}`);
  }

  getByEstudiante(estudianteId: number): Observable<Sesion[]> {
    return this.http.get<Sesion[]>(`${environment.url_backend}/sesiones/estudiante/${estudianteId}`);
  }

  getByProfesional(profesionalId: number): Observable<Sesion[]> {
    return this.http.get<Sesion[]>(`${environment.url_backend}/sesiones/profesional/${profesionalId}`);
  }

  create(data: CreateSesionRequest): Observable<Sesion> {
    return this.http.post<Sesion>(`${environment.url_backend}/sesiones`, data);
  }

  cerrar(id: number): Observable<Sesion> {
    return this.http.put<Sesion>(`${environment.url_backend}/sesiones/${id}/cerrar`, {});
  }
}
