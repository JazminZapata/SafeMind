import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profesional, Disponibilidad } from '../models/Profesional';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalService {

  constructor(private http: HttpClient) { }

  list(): Observable<Profesional[]> {
    return this.http.get<Profesional[]>(`${environment.url_backend}/profesionales`);
  }

  view(id: number): Observable<Profesional> {
    return this.http.get<Profesional>(`${environment.url_backend}/profesionales/${id}`);
  }

  update(id: number, profesional: Profesional): Observable<Profesional> {
    return this.http.put<Profesional>(`${environment.url_backend}/profesionales/${id}`, profesional);
  }

  updateDisponibilidad(id: number, disponibilidad: Disponibilidad): Observable<Profesional> {
    return this.http.put<Profesional>(`${environment.url_backend}/profesionales/${id}/disponibilidad`, { disponibilidad });
  }
}
