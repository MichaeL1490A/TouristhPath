import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private urlEndPoint: string = environment.apiURL + 'api/usuarios';

  constructor(
    private http: HttpClient
  ) { }

  getAllRoles(): Observable<any>{
    let url: string = `${this.urlEndPoint}/role/all?`;
    return this.http.get<any[]>(url).pipe(
      map((res: any) => {
        return res
      }),
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

}
