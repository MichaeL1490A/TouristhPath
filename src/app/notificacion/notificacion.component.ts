import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Client } from '@stomp/stompjs';
import { OverlayPanel } from 'primeng/overlaypanel';
import { MessageService } from 'primeng/api';
import { NotificacionService } from './notificacion.service';
import { Mensajes } from '../common/mensajes';
import { Notificacion } from './models/notificacion';
import { Router } from '@angular/router';
import { AuthService } from '../security/auth.service';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css']
})
export class NotificacionComponent implements OnInit {
  mensaje: any = 0;


  notificaciones: Notificacion[];
  selectedProduct: any;
  moverCampana: boolean;
  totalNotificacionesNuevas: number = 0 ;

  constructor(
    private websocketService: WebsocketService,
    private messageService: MessageService,
    private notificacionServie: NotificacionService,
    private router: Router,
    private authService: AuthService
  ){}

  
  ngOnInit(): void {
    this.websocketService.conexion();
    this.getNotificaciones();
    this.sockets()
  
  }

  onRowSelect(data, op: OverlayPanel) {
    this.router.navigate([data.url])
    if(data.estado==2)
      this.updateEstadoNotificacion(data.id,3)
    op.hide();
  }

  sockets(){
    
    this.websocketService.conexion();
    setTimeout(() => {   
      
      (this.websocketService.client as Client).subscribe(`/js/subscribe/ticket/${this.authService.usuario.id}`, (data) => {
        this.getNotificaciones()
        this.reproducir()
      });
    
    }, 4000);

    setTimeout(() => {   
      
      (this.websocketService.client as Client).subscribe(`/js/subscribe/local/${this.authService.usuario.id}`, (data) => {
        this.getNotificaciones()
      });
    
    }, 4000);

    setTimeout(() => {   

      (this.websocketService.client as Client).subscribe(`/js/subscribe/notificacion/${this.authService.usuario.id}`, (data) => {
        this.totalNotificacionesNuevas = 0 ;
      });
    
    }, 3000);

  }
  
  getNotificaciones(){
    this.notificacionServie.getList().subscribe({
      next: (res) => {
        this.notificaciones = res
        this.calcularNuevasNotificaciones();
      },
      error: (err) => {
        console.error(err)
        this.messageService.add({severity: 'error', summary: Mensajes.tituloError, detail: 'Error al obtener listado de notificaciones.'});
      }
    })

  }

  calcularNuevasNotificaciones(){
    this.totalNotificacionesNuevas = this.notificaciones.reduce((total,act)=>{
      if(act.estado==1) total = total + 1
      return total
    },0)
  }

  reproducir() {
    this.moverCampana = true;
    let audio = new Audio('assets/audio/notification.mp3');
    audio.play();
    setTimeout(() => {
      this.moverCampana = false;
    }, 1000);
    
  }

  eliminar(i,noti){
    //this.notificaciones.splice(i,1);
    this.updateEstadoNotificacion(noti.id, 4)
    
  }

  open(){
    this.getNotificaciones()
    this.websocketService.actualizarNotificacion('notificacion/'+this.authService.usuario.id)
    if(this.totalNotificacionesNuevas>0){
      this.updateVistoNotificacion()
    }
    
    //this.reproducir();
    
  }

  evaluarAnteriores(){
    

  }

  updateVistoNotificacion(){
    this.notificacionServie.updateVisto().subscribe({
      next: (res) => {
        this.totalNotificacionesNuevas = 0 ;
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: Mensajes.tituloError, detail: 'Error al actualizar la notifiacion'});
      }
    })
  }

  updateEstadoNotificacion(id,estado){
  this.notificacionServie.updateEstado(id, estado).subscribe({
    next: (res) => {
      this.websocketService.actualizarNotificacion('local/'+this.authService.usuario.id)
    },
    error: (err) => {
      this.messageService.add({severity: 'error', summary: Mensajes.tituloError, detail: 'Error al eliminar la notifiacion'});
    }
  })
}


changeColor(){
  this.reproducir()
}
}

