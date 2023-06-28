import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { FuncionesComunes } from '../common/funciones-comunes';
import { Personal } from './models/personal';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  urlEndPoint: string =  environment.apiURL + 'api/personal';

  constructor(
    private http: HttpClient
  ) { }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/find/${id}`).pipe(
      map((res: Personal) => {

        if (res.permisos?.length > 0) {
          let i: number = 0;
          res.permisos.forEach(p => {
            if (new Date(p.fechaInicio) >= new Date()) {
              p.blnHabilitado = true;
            } else {
              p.blnHabilitado = false;
            }
          });
          res.permisos.sort((a, b) => b.id - a.id);
        }
        return res;
      }),
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getList(filtros: any): Observable<any[]> {
    let url: string = `${this.urlEndPoint}/list?`;
    let urlFiltros: string = FuncionesComunes.filtrosToString(filtros);
    url += `${urlFiltros}sortField=${filtros.sortField}&sortOrder=${filtros.sortOrder}`;
    return this.http.get<any[]>(url).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  create(personal: Personal): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/create`, personal).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  update(personal: Personal): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/update/${personal.id}`, personal).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  disablePersonalMasivo(ids: string): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/inactivar?ids=${ids}`, {}).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  descargarArchivo(variables: any):Observable<HttpResponse<Blob>>{
    let archivo = variables.archivo;
    let numeroRuta = variables.numeroRuta;
    let url = `${this.urlEndPoint}/file/descargar/${archivo}/${numeroRuta}`;
    return this.http.get(url, {  observe: 'response', responseType: 'blob' }).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    ); 
  }

  actualizarArchivos(archivos, descripcion): Observable<any>{
    let formData = new FormData();
    for(let i=0; i<archivos.length; i++){
      formData.append('archivos', archivos[i]);
    }

    formData.append("descripcion", JSON.stringify(descripcion));
    const req = new HttpRequest('POST', `${this.urlEndPoint}/actualizar-archivos`, formData, { reportProgress: true });
    return this.http.request(req);
  }

  getAutocomplete(term: string): Observable<any[]>{
    let url: string = this.urlEndPoint + `/autocomplete?term=${term}`;
    return this.http.get<any[]>(url).pipe(
      catchError(e =>{
        return throwError(() => e)
      })
    )
  }

  getFechasTicketsAsignadosPersonal(personalId: number, fechaInicial: string): Observable<any[]>{
    let url: string =  this.urlEndPoint + `/fechas-tickets-asignados/${personalId}?fechaInicial=${fechaInicial}`
    return this.http.get<any[]>(url).pipe(
      catchError(e =>{
        return throwError(() => e)
      })
    )
  }

}
