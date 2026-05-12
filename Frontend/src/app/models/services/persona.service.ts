import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona } from '../models/Persona';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(private http: HttpClient) { }

  list(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${environment.url_backend}/personas`);
  }

  view(id: number): Observable<Persona> {
    return this.http.get<Persona>(`${environment.url_backend}/personas/${id}`);
  }

  getByFirebaseUid(uid: string): Observable<Persona> {
    return this.http.get<Persona>(`${environment.url_backend}/personas/uid/${uid}`);
  }

  update(id: number, persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(`${environment.url_backend}/personas/${id}`, persona);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.url_backend}/personas/${id}`);
  }
}
