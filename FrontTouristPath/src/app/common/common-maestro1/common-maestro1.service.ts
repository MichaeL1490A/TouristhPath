import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FuncionesComunes } from '../funciones-comunes';

@Injectable({
  providedIn: 'root'
})
export class CommonMaestro1Service<T> {

  protected urlEndPoint: string =  environment.apiURL + 'api';

  constructor(protected http: HttpClient) { }

  getById(id: number, ...adicional: any): Observable<T> {
    return this.http.get<T>(`${this.urlEndPoint}/get/${id}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getList(): Observable<T[]> {
    return this.http.get<T[]>(this.urlEndPoint + '/list').pipe(
      catchError(e => {
        return throwError(() => e);
      })
    )
  }

  getAllPage(filtros: any, columnSort: string, orderSort: number,items: number, page: number):Observable<any>{
    let url: string = `${this.urlEndPoint}/page?`;
    let urlFiltros: string = FuncionesComunes.filtrosToString(filtros);
    url += `${urlFiltros}columnSort=${columnSort}&orderSort=${orderSort}&items=${items}&page=${page}`;
    return this.http.get<any>(url).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    )
  }

  create(t: T, ...adicional: any): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/create`, t).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    )
  }

  update(t: T, ...adicional: any): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/update/${t['id']}`, t).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    )
  }
}
