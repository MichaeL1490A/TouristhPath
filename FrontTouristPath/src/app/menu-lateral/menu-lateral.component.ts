import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../security/auth.service';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent {

  visible: boolean = false;
  menu: MenuItem[] = [];
  menuFlotante: MenuItem[] = [];

  iconos: string[] = ["viajes.png", "tours.png", "lugares.png"];
  nombresMenu: string[] = ["VIAJES", "TOURS", "LUGARES"];
  opcionesMenu: any[] = [ 
    [{label: 'Viajes', routerLink: '/viaje/listado'},
     {label: 'Agregar Viajes', routerLink: '/viaje/detalle/0'},
     {label: 'Dashboard', routerLink: '/viaje/dashboard'}],
    [{label: 'Tours', routerLink: '/tour/listado'},
     {label: 'Agregar Tour', routerLink: '/tour/detalle'},
     {label: 'Tours', routerLink: '/tour/dashboard'}],
    [{label: 'Lugares', routerLink: '/lugar/listado'},
     {label: 'Agregar Lugares', routerLink: '/lugar/detalle'},
     {label: 'Dashboard', routerLink: '/lugar/dashboard'}]
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.menu = this.authService.modulos;
    this.menu = this.menu.slice(0,3)
    console.log(this.menu)

    let i: number = 0;
    this.menu.forEach( m => {
      m.icon = "../../assets/icons/menu_lateral/" + this.iconos[i];
      m.label = this.nombresMenu[i];
      m.items = this.opcionesMenu[i];
      i = i+1;
    })
  }

  mostrarMenu() {
    console.log('1')
    let i=0
    this.menu.forEach(m => {
      m.icon = "../../assets/icons/menu_lateral/" + this.iconos[i];
      m.expanded = false;
      i = i+1
    });
    console.log(this.menu)

    this.visible = !this.visible;
  }

  abrirSubMenuLateral(i: number) {
    this.menuFlotante = this.menu[i].items;
    let items =  this.menuFlotante.length
    let st: string = (i*42 + 115 - 35*(items-1)) + '';

    document.documentElement.style.setProperty('--top-menu-flotante', `${st}px`);
  }
}
