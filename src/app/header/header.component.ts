import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs';
import { AuthService } from '../security/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  menu: string = '';
  items: MenuItem[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService
  ) {
    const navEndEvents = this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) =>{
      this.menu = this.activatedRoute.root.firstChild.snapshot.data['menu']?this.activatedRoute.root.firstChild.snapshot.data['menu']:'';
    })
  }

  ngOnInit() {
    this.items = [
      {
        label:'Mi Perfil',
        routerLink: ['/seguridad/mi-perfil']
      },
      {
        label:'Cerrar Sesion',
        command: () => {
            this.logout();
        }
      }
    ];
  }

  isAuthenticated():boolean{
    return this.authService.isAuthenticated();
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
