import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModuloService {

  private urlEndPoint: string = environment.apiURL + 'api/usuarios';

  constructor(
    private http: HttpClient
  ) { }

  getMenusByUsuario(id: number): Observable<any[]>{
    return this.http.get<any[]>(this.urlEndPoint + `/modulo/modulosByUser/${id}`).pipe(
      map(response => {
        (response as any[]).map(res => {
          res.style = JSON.parse(res.style);
          res.items = JSON.parse(res.items);
        })
        return response;
      }),
      catchError(e =>{
        return throwError(() => e)
      })
    )
  }
}
