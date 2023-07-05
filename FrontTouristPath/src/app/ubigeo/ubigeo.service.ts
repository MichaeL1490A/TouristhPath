import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {

  private urlEndPoint: string = environment.apiURL + 'api/auxiliares'

  constructor(private http: HttpClient) { }

  getAllDepartamento(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlEndPoint}/departamento/all`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    )
  }

  getDepartamentoByProvincia(provinciaId: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/departamento/provincia/${provinciaId}`).pipe(
      catchError(e => {
        return throwError(() => e)
      })
    )
  }


  getProvinciaByDepartamento(departamentoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlEndPoint}/provincia/departamento/${departamentoId}`).pipe(
      catchError(e => {
        return throwError(() => e)
      })
    )
  }

  getProvinciaByDistrito(distritoId: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/provincia/lista/${distritoId}`).pipe(
      catchError(e => {
        return throwError(() => e)
      })
    )
  }

  getDistritoByDistrito(distritoId: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/distrito/lista/${distritoId}`).pipe(
      catchError(e => {
        return throwError(() => e)
      })
    )
  }

  getDistritoByProvincia(provinciaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlEndPoint}/distrito/provincia/${provinciaId}`).pipe(
      catchError(e => {
        return throwError(() => e)
      })
    )
  }

  getGrafosDepartamento(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlEndPoint}/departamento/grafos`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    )
  }
}
