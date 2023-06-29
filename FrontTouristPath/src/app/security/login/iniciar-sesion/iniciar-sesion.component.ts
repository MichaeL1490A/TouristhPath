import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Mensajes } from '../../../common/mensajes';
import { AuthService } from '../../auth.service';
import { ModuloService } from '../../modulo.service';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css']
})
export class IniciarSesionComponent {

  @Input()
  modo: number;

  @Output()
  modoChange = new EventEmitter<number>();

  usuario: Usuario = new Usuario();

  rememberMe: boolean

  constructor(
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService,
    private moduloService: ModuloService
  ) { }

  @HostListener('window:keydown.enter', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.login()
  }

  login() {
    if(this.usuario.username == null || this.usuario.password == null || this.usuario.username == '' || this.usuario.password == '') {
      this.messageService.add({severity: 'warn', summary: Mensajes.tituloWarning, detail: 'Usuario o contraseña vacíos'});
      return;
    }
    this.authService.login(this.usuario,this.rememberMe ).subscribe({
      next: (res) => {
        this.authService.guardarUsuario(res.access_token);
        this.authService.guardarToken(res.access_token);
        this.moduloService.getMenusByUsuario(this.authService.usuario.id).subscribe({
          next: (mod) => {
            this.authService.guardarModulos(mod);
            this.router.navigate(['/']);
        }});
           
        if(this.authService.usuario.rolesAuthorities.includes("ROLE_GERENTE")) {
          this.authService.blnGerente = true;
        }
        if(this.authService.usuario.rolesAuthorities.includes("ROLE_SOPORTE")) {
          this.authService.blnSoporte = true;
        }
        if(this.authService.usuario.rolesAuthorities.includes("ROLE_ADMIN")) {
          this.authService.blnAdmin = true;
        }
      },
      error: (err) => {
        if (err.error?.error_description?.includes('Bad credentials')) {
          this.messageService.add({severity: 'warn', summary: Mensajes.tituloWarning, detail: 'Usuario y/o contraseña inválidos.'});
        }else if (err.status == 400 && err.error?.error_description?.includes('disabled')) {
          this.messageService.add({severity: 'warn', summary: Mensajes.tituloWarning, detail: 'El usuario se encuentra inactivo.'});
        } else {
          this.messageService.add({severity: 'error', summary: Mensajes.tituloError, detail: 'Error al iniciar sesión.'});
        }
      }
    });
  }

  recuperarUsuario() {
    this.modo = 2;
    this.modoChange.emit(this.modo);
  }
}
