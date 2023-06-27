import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FuncionesComunes } from 'src/app/common/funciones-comunes';
import { Mensajes } from 'src/app/common/mensajes';
import { Mensaje } from '../models/mensaje';
import { CorreoService } from '../correo.service';

@Component({
  selector: 'app-modal-enviar-correo',
  templateUrl: './modal-enviar-correo.component.html',
  styleUrls: ['./modal-enviar-correo.component.css']
})
export class ModalEnviarCorreoComponent {

  listaCorreos: any[] = [];
  correos: string; 
  mensaje: Mensaje = new Mensaje();

  mensajeCarga: string = "Enviando correo..."
  blnCargando: boolean = false;
  
  listaAux: any[] = [];

  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private messageService: MessageService,
    private correoService: CorreoService
  ){}

  ngOnInit(){
    this.correos = this.config.data.correos;
    this.mensaje.relacionados = this.config.data.relacionados;
    this.agregarCorreos();
  }

  agregarCorreos(){
    if(this.correos != null && this.correos != undefined && this.correos.trim() != ','){
      this.listaAux = this.correos.split(',');
      this.listaAux.forEach( e => {
        this.listaCorreos.push({correo: e});
      })
    }
  }

  agregarCorreo(){
    this.listaCorreos.unshift({correo: ''})
  }

  eliminarCorreo(posicion: number){
    this.listaCorreos.splice(posicion, 1)
  }

  validarCampos(): boolean{
    if(this.mensaje.asunto == null || this.mensaje.asunto == undefined || this.mensaje.asunto.trim() == ''){
      this.messageService.add({severity: 'warn', summary: `${Mensajes.tituloWarning }`, detail: 'Debe ingresar el asunto del correo'})
      return false;
    }
    if(this.mensaje.mensaje == null || this.mensaje.mensaje == undefined || this.mensaje.mensaje.trim() == ''){
      this.messageService.add({severity: 'warn', summary: `${Mensajes.tituloWarning}`, detail: 'Debe ingresar el mensaje del correo'})
      return false;
    }
    if(this.listaCorreos == null || this.listaCorreos == undefined || this.listaCorreos.length <= 0 ){
      this.messageService.add({severity: 'warn', summary: `${Mensajes.tituloWarning}`, detail: 'Debe seleccionar o ingresar al menos un correo'})
      return false;
    }

    let boolCorreo: boolean = false; 
    this.listaCorreos.forEach(e => {
      if(e.correo == null || e.correo == undefined || e.correo.trim().length == 0){
        this.messageService.add({severity: 'warn', summary: `${Mensajes.tituloWarning}`, detail: 'El correo no puede estar vacío'})
        boolCorreo = true;
      }
    })
    if(boolCorreo){
      return false;
    }
    return true;
  }

  formatearMensaje(){
    this.mensaje.receptores = '';
    this.listaCorreos.forEach(e => {
      this.mensaje.receptores = this.mensaje.receptores + e.correo + ','; 
    })
    this.mensaje.receptores = this.mensaje.receptores.substring(0,this.mensaje.receptores.length-1);
    this.mensaje.fechaEnvio = new Date();
  }

  enviarMensaje(){
    if(!this.validarCampos()) return
    this.formatearMensaje();
    this.blnCargando = true;

    this.correoService.enviarCorreo(this.mensaje, '').subscribe({
      next: (res) => {
        this.messageService.add({severity: 'success', summary: `${Mensajes.tituloSuccess}`, detail: `Mensaje enviado con éxito`})
        this.blnCargando = false;
        this.ref.close();
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: `${Mensajes.tituloSuccess}`, detail: `Error`})
        this.blnCargando = false;
      }
    })
  }

  cerrarModal(){
    this.ref.close();
  }

}
