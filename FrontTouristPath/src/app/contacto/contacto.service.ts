import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FuncionesComunes } from '../common/funciones-comunes';
import { Contacto } from './models/contacto';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  urlEndPoint: string = environment.apiURL + 'api/contactos'
  urlEndPointReportes: string = environment.apiURL + 'api/reportes';

  constructor(private http: HttpClient) { }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/find/${id}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getList(filtros: any, page: number, items: number): Observable<any> {
    let url: string = `${this.urlEndPoint}/list?`;
    let urlFiltros: string = FuncionesComunes.filtrosToString(filtros);
    url += `${urlFiltros}page=${page}&pageSize=${items}&`;
    return this.http.get<any[]>(url).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  update(contacto: Contacto): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/update/${contacto.id}`, contacto).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  create(contacto: Contacto): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/create`, contacto).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getContactosByClienteId(clienteId: number): Observable<any>{
    return this.http.get<any>(`${this.urlEndPoint}/findContactosByClienteId/${clienteId}`).pipe(
      catchError(e => {
        return throwError(() => e)
      })      
    )
  }

  getContactosBySedeId(id: number): Observable<any>{
    return this.http.get<any>(`${this.urlEndPoint}/findContactosBySedeId/${id}`).pipe(
      catchError(e => {
        return throwError(() => e)
      })
    )
  }

  exportarListaContactos(filtros: any){
    let url: string = `${this.urlEndPointReportes}/exportar/lista-contactos/excel?`;
    let urlFiltros: string = FuncionesComunes.filtrosToString(filtros);
    url += `${urlFiltros}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  getContactosEquiposTicket(ticketId: number): Observable<any> {
    return this.http.get<any[]>(`${this.urlEndPoint}/contactos-relacionados-ticket/${ticketId}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

}
