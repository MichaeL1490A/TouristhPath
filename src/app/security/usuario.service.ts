import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, catchError, map, throwError } from 'rxjs';
import { FuncionesComunes } from '../common/funciones-comunes';
import { ChangedPassword } from './models/changed-password';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlEndPoint: string = environment.apiURL + 'api/usuarios';

  constructor(
    private http: HttpClient
  ) { }

  getUsernameById(id: number): Observable<any>{
    return this.http.get<any>(this.urlEndPoint + `/mi-perfil/datos/${id}`).pipe(
      catchError(e =>{
        return throwError(() => e)
      })
    )
  }

  recoverUsuario(correo: string): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/resetPassword`, correo).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getList(filtros: any, page: number, pageSize: number): Observable<any>{
    let url: string = `${this.urlEndPoint}/filtro?`;
    let urlFiltros: string = FuncionesComunes.filtrosToString(filtros);
    url += `${urlFiltros}page=${page}&pageSize=${pageSize}&`;
    //if (filtros.sortField) url += `sortField=${filtros.sortField}&`
    //url += `sortOrder=${filtros.sortOrder}`
    return this.http.get<any[]>(url).pipe(
      map((res: any) => {
        return res
      }),
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
  
  update(usuario: any): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${usuario.id}`, usuario).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  create(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/usuario`, usuario).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  enviarCorreo(usuario: any): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/correo`, usuario).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  activarUsuario(changedPassword: ChangedPassword): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/changedPassword/${changedPassword.token}/${changedPassword.password}`, changedPassword).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
}
