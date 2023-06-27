import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Mensajes } from 'src/app/common/mensajes';
import { UsuarioService } from '../usuario.service';
import { ChangedPassword } from '../models/changed-password';

@Component({
  selector: 'app-ingresar-password',
  templateUrl: './ingresar-password.component.html',
  styleUrls: ['./ingresar-password.component.css']
})
export class IngresarPasswordComponent implements OnInit {

  token: string = '';
  modo: number = 0;
  password: string = '';
  confirmarPassword: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private messageService: MessageService,
    private usuarioService: UsuarioService
  ) {}

  @HostListener('window:keydown.enter', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.activarUsuario()
  }

  ngOnInit() {
    if(this.authService.isAuthenticated()) {
      this.router.navigate(['']);
      return;
    }

    this.activatedRoute.paramMap.subscribe(p => {
      this.token = p.get('token') || '';
      try{
        this.modo = Number.parseInt(p.get('modo') || '');
      }
      catch{}
      if(!this.token || this.token?.trim().length == 0) {
        //this.router.navigate(['/login']);
        return;
      }

      /* this.authService.comprobarToken(this.token).subscribe({
        next: (res) => {

        },
        error: (err) => {
          //this.router.navigate(['/login']);
          this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `Token inválido.` });
        }
      }); */
    })
  }

  activarUsuario() {
    if (!this.password || this.password.trim().length == 0) {
      this.messageService.add({ severity: 'warn', summary: Mensajes.tituloFaltanDatos, detail: `Debe ingresar su contraseña.` });
      return;
    }
    if (!this.confirmarPassword || this.confirmarPassword.trim().length == 0) {
      this.messageService.add({ severity: 'warn', summary: Mensajes.tituloFaltanDatos, detail: `Debe confirmar su contraseña.` });
      return;
    }
    if (this.password != this.confirmarPassword) {
      this.messageService.add({ severity: 'warn', summary: Mensajes.tituloDatosErroneos, detail: `Las contraseñas no coinciden.` });
      return;
    }

    let changedPassword = new ChangedPassword()
    changedPassword.token = this.token.trim()
    changedPassword.password = this.password.trim()
    changedPassword.modo = this.modo

    this.usuarioService.activarUsuario(changedPassword).subscribe({
      next: (res) =>{
        this.router.navigate(['/login']);
        this.messageService.add({ severity: 'success', summary: Mensajes.tituloSuccess, detail: res.mensaje });
      },
      error: (err) =>{
        this.router.navigate(['/login']);
        this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: err.mensaje??'Hubo un error al actualizar la contraseña. Inténtelo nuevamente.' });
      }
    })
  }
}
