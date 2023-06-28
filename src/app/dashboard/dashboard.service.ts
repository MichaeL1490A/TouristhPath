import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  urlEndPoint: string =  environment.apiURL + 'api/dashboard';
  constructor(
    private http: HttpClient
  ) { }

  getDataMantenimientosPreventivosByDepartamento(departamentoId: number){
    return this.http.get<any>(`${this.urlEndPoint}/mantenimientos-garantias/${departamentoId}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getDataTotalClientesEquiposTicketsByDepartamento(departamentoId: number){
    return this.http.get<any>(`${this.urlEndPoint}/totales/${departamentoId}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getDataCantidadTotalEstadosTicket(departamentoId: number){
    return this.http.get<any>(`${this.urlEndPoint}/data-tickets/${departamentoId}`).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
}
