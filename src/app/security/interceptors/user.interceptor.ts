import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class UserInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if ((request.method == "POST" || request.method == "PUT" || request.method == "GET") && !request.url.includes('data:image/')) {
      let req = request.clone({
        params: (request.params ? request.params : new HttpParams()).set('usuarioId', this.authService.usuario?.id || 0)
      });
      return next.handle(req);
    }

    return next.handle(request);
  }
}
