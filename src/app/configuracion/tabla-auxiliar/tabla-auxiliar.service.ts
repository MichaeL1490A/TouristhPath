import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { TablaAuxiliarDetalle } from '../models/tabla-auxiliar-detalle';
import { TablaAuxiliar } from '../models/tabla-auxiliar';
import { FuncionesComunes } from 'src/app/common/funciones-comunes';

@Injectable({
  providedIn: 'root'
})
export class TablaAuxiliarService {

  urlEndPoint: string =  environment.apiURL + 'api/auxiliares';

  constructor(
    private http: HttpClient
  ) { }

  getListByCodigo(codTablaAuxiliar: string): Observable<TablaAuxiliarDetalle[]> {
    return this.http.get<TablaAuxiliarDetalle[]>(`${this.urlEndPoint}/tabla-auxiliar-detalle/lista/${codTablaAuxiliar}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getListAuxiliares(): Observable<TablaAuxiliar[]>{
    return this.http.get<TablaAuxiliar[]>(`${this.urlEndPoint}/tablaAuxiliar/list`).pipe(
      catchError( e => {
        return throwError(() => e);
      })
    )
  }

  getListaAuxiliarByNombre(nombre: string){
    return this.http.get<TablaAuxiliar[]>(`${this.urlEndPoint}/tablaAuxiliar/filtro?nombre=${nombre}`).pipe(
      catchError( e => {
        return throwError( () => e)
      })
    )

  }

  getAllPageTablaAuxiliar(nombre:any, items: number, page: number):Observable<any>{
    let urlFiltros: string = FuncionesComunes.filtrosToString(nombre);
    let url: string = `${this.urlEndPoint}/tablaAuxiliar/page?${urlFiltros}items=${items}&page=${page}`;
    return this.http.get<any>(url).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    )
  }

  updateDetalle(tablaAuxiliarDetalle: TablaAuxiliarDetalle, cod_tabla: string, id: number): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/tabla-auxiliar-detalle/update/${cod_tabla}/${id}`, tablaAuxiliarDetalle).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  create(tablaAuxiliarDetalle: TablaAuxiliarDetalle): Observable<TablaAuxiliarDetalle> {
    return this.http.post(`${this.urlEndPoint}/tabla-auxiliar-detalle` , tablaAuxiliarDetalle).pipe(
      map((response: any) => response.tablaAuxiliarDetalle as TablaAuxiliarDetalle),
      catchError(e => {
        return throwError(() => e);
      })
    )
  }
}