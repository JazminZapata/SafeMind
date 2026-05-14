import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mensaje } from '../models/Mensaje';
import { environment } from 'src/environments/environment';

export interface CreateMensajeRequest {
  sesion_id: number;
  remitente_id: number;
  contenido: string;
}

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  constructor(private http: HttpClient) { }

  getBySesion(sesionId: number): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${environment.url_backend}/sesiones/${sesionId}/mensajes`);
  }

  create(data: CreateMensajeRequest): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${environment.url_backend}/mensajes`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.url_backend}/mensajes/${id}`);
  }
}
