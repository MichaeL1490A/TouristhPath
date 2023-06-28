import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../auth.service';
import { Mensajes } from '../../common/mensajes';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(e => {
        if (e.status === 401) {
          if (this.authService.isAuthenticated()) {
            this.authService.logout();
          }

          this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `Acceso restringido.` });
          this.router.navigateByUrl('/login');
        }
        
        if (e.status === 403) {
          this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `Acceso restringido.` });
          this.router.navigateByUrl('/');
        }

        return throwError(() => e);
      })
    );
  }
}
