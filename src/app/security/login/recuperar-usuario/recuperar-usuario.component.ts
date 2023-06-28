import { Component, HostListener } from '@angular/core';
import { UsuarioService } from '../../usuario.service';
import { MessageService } from 'primeng/api';
import { Mensajes } from 'src/app/common/mensajes';

@Component({
  selector: 'app-recuperar-usuario',
  templateUrl: './recuperar-usuario.component.html',
  styleUrls: ['./recuperar-usuario.component.css']
})
export class RecuperarUsuarioComponent {

  email: string = '';

  @HostListener('window:keydown.enter', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.recuperarUsuario()
  }
  
  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService
  ) {}

  recuperarUsuario() {
    if (!this.email || this.email?.trim().length == 0) {
      this.messageService.add({ severity: 'warn', summary: Mensajes.tituloFaltanDatos, detail: `Debe ingresar el correo.` });
      return;
    }

    this.usuarioService.recoverUsuario(this.email).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: Mensajes.mensajeActualizadoSuccess, detail: `Mensaje enviado al correo ${this.email} revisar bandeja de entrada.` });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `Error al enviar correo.` });
      }
    });
  }
}
