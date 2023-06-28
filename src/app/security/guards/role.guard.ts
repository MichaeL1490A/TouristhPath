import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth.service';

export const RoleGuard = (next: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  // const next = inject(ActivatedRouteSnapshot);
  let role:string[] = next.data['role'] as string[];
  let blnContieneRol:boolean  = false;

  role.forEach(rol => {
    if (authService.hasRole(rol)) {
      blnContieneRol = true;
      return;
    }
  });

  if(blnContieneRol){
    return true;
  }

  return router.navigate(['/']);
}
