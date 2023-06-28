import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { FuncionesComunes } from '../common/funciones-comunes';
import { Notificacion } from './models/notificacion';


@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  urlEndPoint: string =  environment.apiURL + 'api/websocket-server';
  constructor(
    private http: HttpClient
  ) { }

  getList(): Observable<Notificacion[]>{
    return this.http.get<Notificacion[]>(`${this.urlEndPoint}/list`).pipe(
      catchError( e => {
        return throwError(() => e);
      })
    )    
  }
  updateEstado(id: number, estado: number): Observable<any> {
    return this.http.put<Notificacion>(`${this.urlEndPoint}/update-estado?id=${id}&estadoId=${estado}`, null).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
  updateVisto(): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/update-visto`, null).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
}
