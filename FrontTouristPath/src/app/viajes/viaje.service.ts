import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Viaje } from './models/viaje';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {

  urlEndPoint: string =  environment.apiURL + 'api/touristpath';

  constructor(
    private http: HttpClient
  ) { }

  create(viaje: Viaje): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/viaje/create`, viaje).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getById(viajeId: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/viaje/find/${viajeId}`).pipe(
      map((res: Viaje) => {
        return res;
      }),
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  update(viaje: Viaje): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/update/${viaje.id}`, viaje).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }


}
