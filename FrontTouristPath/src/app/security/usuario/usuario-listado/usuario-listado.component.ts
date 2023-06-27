import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { TablaAuxiliarDetalle } from '../../../configuracion/models/tabla-auxiliar-detalle';
import { UsuarioService } from '../../usuario.service';
import { TablaAuxiliarService } from 'src/app/configuracion/tabla-auxiliar/tabla-auxiliar.service';
import { Mensajes } from 'src/app/common/mensajes';
import { environment } from 'src/environments/environment';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UsuarioModalRolesComponent } from './usuario-modal-roles/usuario-modal-roles.component';
import { PersonalService } from 'src/app/personal/personal.service';
import { RoleService } from '../../role.service';
import { Observable, forkJoin } from 'rxjs';
import { Role } from '../../models/role';
import { Usuario } from '../../models/usuario';
import { WebsocketService } from 'src/app/notificacion/websocket.service';
import { Client } from '@stomp/stompjs';

@Component({
  selector: 'app-usuario-listado',
  templateUrl: './usuario-listado.component.html',
  styleUrls: ['./usuario-listado.component.css']
})
export class UsuarioListadoComponent implements OnInit {
  
  regexAutocomplete = environment.regexAutocomplete
  ref: DynamicDialogRef; 
  blnOcupado: boolean = false;

  currentEvent: LazyLoadEvent
  page: number = 0
  totalRegistros: number

  listaUsuario: any[] = [];
  usuarioEditando: any

  listaPersonal: any[] = []
  personalSeleccionado: any;

  listaEstado: TablaAuxiliarDetalle[] = [];
  listaRoles: Role[] = []
  estadoSeleccionado: TablaAuxiliarDetalle

  constructor(
    private usuarioService: UsuarioService,
    private auxiliarService: TablaAuxiliarService,
    private messageService: MessageService,
    private personalService: PersonalService,
    public dialogService: DialogService,
    private roleService: RoleService,
    private websocketService: WebsocketService
  ){}

  ngOnInit() {

    let listAuxiliares: Observable<any>[] = []
    listAuxiliares.push(
      this.auxiliarService.getListByCodigo('ESTGRL')
    )
    forkJoin(listAuxiliares).subscribe({
      next: (res)=>{
        this.listaEstado = (res[0] as any[]).reverse()
      }
    })
  } 


  agregar() {
    let usuarioNew: any = {}
    usuarioNew.id = 0
    usuarioNew.estado = this.listaEstado[0]
    this.usuarioEditando = usuarioNew
    this.listaUsuario.unshift(usuarioNew)
    this.estadoSeleccionado = this.listaEstado[0]
  }

  listar(event: LazyLoadEvent){
    this.blnOcupado = true;
    this.currentEvent = event
    this.page = (event.first / event.rows);

    this.usuarioService.getList(event, this.page, event.rows).subscribe({
      next: (res)=>{
        this.totalRegistros = res.totalElements;
        this.listaUsuario = res.content as any[];
        this.listaUsuario.forEach(u=>{
          u.rolesString = ""
          u.roles.forEach((r: Role)=>{
            u.rolesString = u.rolesString + r.nombreDetallado + ', '
          })
          u.rolesString = u.rolesString.substring(0,u.rolesString.length-2)
          if(!u.personal) u.personal = {}
          u.personal.nombre = u.personal?.apellidoPaterno + ' ' + u.personal?.apellidoMaterno + ' ' + u.personal?.nombres
        })
        this.blnOcupado = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} de usuarios` });
        this.blnOcupado = false;
      }
    });
  }

  asignarPersonal(){
    this.usuarioEditando.personal = this.personalSeleccionado
    this.usuarioEditando.username = this.personalSeleccionado.correo
    this.usuarioEditando.email = this.personalSeleccionado.correo
  }

  desasignarPersonal(){
    if(!this.personalSeleccionado?.id){
      this.usuarioEditando.personal = null
    }
  }

  editar(usuario: any){
    this.usuarioEditando = usuario
    this.personalSeleccionado = usuario.personal
    this.estadoSeleccionado = this.listaEstado.find(t => t.tablaAuxiliarDetalleId.id == this.usuarioEditando.estado.tablaAuxiliarDetalleId.id)
  }

  guardar(){
    if(!this.validar()) return
    this.blnOcupado = true
    if(this.usuarioEditando.id == 0){
      this.usuarioService.create(this.usuarioEditando).subscribe({
        next: (res) => {
          this.usuarioService.enviarCorreo(res.usuario).subscribe({
            next: (res2) => {
              this.messageService.add({severity: 'success', summary: Mensajes.tituloSuccess, detail: Mensajes.mensajeGuardadoSuccess});
              this.reiniciarValores()
              this.listar(this.currentEvent)
            },
            error: (err) => {
              console.error(err);
              this.messageService.add({severity: 'error', summary: Mensajes.tituloError, detail: 'Error al enviar el correo de confirmación.'});
              this.reiniciarValores()
              this.listar(this.currentEvent)
            }
          })
        },
        error: (err) => {
          if(err?.status==409)
            this.messageService.add({severity: 'warn', summary: Mensajes.tituloError, detail: err.error.mensaje});
          else{
            console.error(err);
            this.messageService.add({severity: 'error', summary: Mensajes.tituloError, detail: Mensajes.mensajeErrorCreacion});
            this.reiniciarValores()
          }
          this.blnOcupado = false;
        }
      });
    }
    else{
      this.usuarioService.update(this.usuarioEditando).subscribe({
        next: (res) => {        
          this.messageService.add({severity: 'success', summary: Mensajes.tituloSuccess, detail: Mensajes.mensajeActualizadoSuccess});
          this.reiniciarValores()
          this.listar(this.currentEvent)
        },
        error: (err) => {
          if(err?.status==409)
            this.messageService.add({severity: 'warn', summary: Mensajes.tituloError, detail: err.error.mensaje});
          else{
            console.error(err);
            this.messageService.add({severity: 'error', summary: Mensajes.tituloError, detail: Mensajes.mensajeErrorActualizacion});
            this.reiniciarValores()
          }
          this.blnOcupado = false;
        }
      });
    }
  }

  validar(){
    if(!this.usuarioEditando.personal?.id){
      this.messageService.add({severity: 'warn', summary: Mensajes.tituloFaltanDatos, detail: Mensajes.mensajeValidacionDatoFaltanteSelects + 'un personal'});
      return false
    }
    else if(!this.usuarioEditando.username || this.usuarioEditando.username.length<=0){
      this.messageService.add({severity: 'warn', summary: Mensajes.tituloFaltanDatos, detail: Mensajes.mensajeValidacionDatoFaltanteInputs + 'el username'});
      return false
    }
    else if(!this.usuarioEditando.email || this.usuarioEditando.email.length<=0){
      this.messageService.add({severity: 'warn', summary: Mensajes.tituloFaltanDatos, detail: Mensajes.mensajeValidacionDatoFaltanteInputs + 'el correo'});
      return false
    }
    else if(!this.usuarioEditando.rolesString || this.usuarioEditando.email.rolesString<=0){
      this.messageService.add({severity: 'warn', summary: Mensajes.tituloFaltanDatos, detail: Mensajes.mensajeValidacionDatoFaltanteSelects + 'por lo menos un rol'});
      return false
    }
    else
      return true
  }

  cancelar(){
    this.reiniciarValores()
    this.listar(this.currentEvent)
  }

  reiniciarValores(){
    if(this.usuarioEditando.id == 0) this.listaUsuario.shift()
    this.personalSeleccionado = null
    this.usuarioEditando = null
  }

  asignarEstado(){
    this.usuarioEditando.estado = this.estadoSeleccionado
  }

  filtrar(term: string) {
    this.personalService.getAutocomplete(term).subscribe({
      next: (res) => {
        this.listaPersonal = res;
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} del personal.`});
      }
    });
  }

  abrirRoles() {
    this.ref = this.dialogService.open(UsuarioModalRolesComponent, {
      draggable: true,
      data: {
        roles: this.usuarioEditando.roles
      },
      header: 'Roles de Usuario',
      width: '450px',
      styleClass: 'custom-dialog-padding-bottom'
    });

    this.ref.onClose.subscribe((res: any) => {
      if(res?.roles){
        this.usuarioEditando.rolesString = res.rolesString;
        this.usuarioEditando.roles = res.roles;
      }
    });
  }
}
