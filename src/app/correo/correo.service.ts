import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Mensaje } from './models/mensaje';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CorreoService {

  urlEndPoint: string = environment.apiURL + 'api/mails'

  constructor(private http: HttpClient) { }

  enviarCorreo(mensaje: Mensaje, nombreArchivo: string){
    let url: string = `${this.urlEndPoint}/send-save-email?rutaRelativaArchivo=${nombreArchivo}`
    return this.http.put<any>(`${url}`,mensaje).pipe(
      catchError( e => {
        return throwError(() => e)
      })
    )

  }

}
