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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.menu = this.authService.modulos;
  }

  mostrarMenu() {
    this.menu.forEach(m => {
      m.expanded = false;
    });
    this.visible = !this.visible;
  }

  abrirSubMenuLateral(i: number) {
    this.menuFlotante = this.menu[i].items;
    let items =  this.menuFlotante.length
    let st: string = (i*42 + 115 - 35*(items-1)) + '';

    document.documentElement.style.setProperty('--top-menu-flotante', `${st}px`);
  }
}
