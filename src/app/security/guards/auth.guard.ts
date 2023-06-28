import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MessageService } from 'primeng/api';
import { Mensajes } from '../../common/mensajes';

export const AuthGuard = () => {
  const authService = inject(AuthService);
  const messageService = inject(MessageService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    if (authService.isTokenExpirado()) {
      messageService.add({severity: 'warn', summary: Mensajes.tituloWarning, detail: 'Sesión expirada.'});
      authService.logout();
      router.navigate(['/login']);
    }
    return true;
  }
  return router.navigate(['/login']);
}
