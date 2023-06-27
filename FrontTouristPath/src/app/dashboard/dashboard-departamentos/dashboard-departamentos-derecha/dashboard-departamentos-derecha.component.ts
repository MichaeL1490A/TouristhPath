import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { Mensajes } from 'src/app/common/mensajes';
import { MessageService } from 'primeng/api';
import { WebsocketService } from 'src/app/notificacion/websocket.service';
import { Client } from '@stomp/stompjs';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard-departamentos-derecha',
  templateUrl: './dashboard-departamentos-derecha.component.html',
  styleUrls: ['./dashboard-departamentos-derecha.component.css']
})
export class DashboardDepartamentosDerechaComponent implements OnInit{
  
  @Input()
  seleccionarDepartamento: Subject<any> = new Subject<any>();

  departamentoId: number = 15;
  nombreDepartamento: string = 'LIMA';
  urlImagenDpto: string = '/assets/images/departamentos/lima.svg#Layer_1';

  estadosAlerta: number[] = [1,2,3,4,6,7,8]

  subscriptionEquipos: any;
  subscriptionClientes: any;
  subscriptionTicket: any;

  listaAlertas: any[] = [
    {titulo:"Programados",descripcion:"tickets programados con demora mayor a 1 día", numero: 0, icono: 'programados.svg'},
    {titulo:"Asignados",descripcion:"tickets asignados y no iniciados con demora mayor a 1 día", numero: 0, icono: 'asignados.svg'},
    {titulo:"En Atención",descripcion:" tickets en atencion con demora en el cierre con demora mayor 1 día", numero: 0, icono: 'atencion.svg'},
    {titulo:"Terminado Parcial",descripcion:"tickets en terminado parcial con demora en cierre a 7 días", numero: 0, icono: 'terminado-parcial.svg'},
  ]
  listaEstados: any[] = [
    {titulo:"Generados", numero: 0, id:1},
    {titulo:"Programados", numero: 0, id:2},
    {titulo:"Asignados", numero: 0, id:3},
    {titulo:"Atendiendo", numero: 0, id:4},
    {titulo:"Term. Parcial", numero: 0, id:6},
    {titulo:"Terminado", numero: 0, id:7},
    {titulo:"Anulado", numero: 0, id:8}

  ]
  listaProgramaciones: any[] = [
    {titulo:"MANT. PreventivoS", pasados: 0, mes1: 0, mes2: 0, mes3: 0, mes4: 0, mes5: 0, mes6: 0},
    {titulo:"VCTO Garantías", pasados: null, mes1: 0, mes2: 0, mes3: 0, mes4: 0, mes5: 0, mes6: 0}
  ]
  tmes: string[] = []
  equipos: number[] = [0,0,0,0]
  
  constructor(
    public dashboardService: DashboardService,
    public messageService: MessageService,
    public websocketService: WebsocketService,
    private router: Router,
  ){}

  ngOnInit(): void {

    this.seleccionarDepartamento.subscribe(res => {
      if (res) {
        this.departamentoId = res.id;
        this.nombreDepartamento = res.descripcion
        this.urlImagenDpto = '/assets/images/departamentos/' + (res.descripcion as string).toLowerCase().replaceAll(' ', '_') + '.svg#Layer_1'
        if(res.id==0)  this.urlImagenDpto = "/assets/icons/dashboard/mapa.svg#Layer_1"
        this.listar()
      }
    });

    this.websocketService.conexion();
    this.sockets();
  }

  listar(){
    this.listarEstados()
    this.listarMantenimientos()
    this.listarEquipos()
  }

  listarEstados(){
    this.dashboardService.getDataCantidadTotalEstadosTicket(this.departamentoId).subscribe({
      next: (res)=>{
        //estados
        this.listaAlertas[0].numero = res.totalTicketAlertaProgramado>0?res.totalTicketAlertaProgramado:null
        this.listaAlertas[1].numero = res.totalTicketAlertaAsignado>0?res.totalTicketAlertaAsignado:null
        this.listaAlertas[2].numero = res.totalTicketAlertaAtencion>0?res.totalTicketAlertaAtencion:null
        this.listaAlertas[3].numero = res.totalTicketAlertaTerminadoParcial>0?res.totalTicketAlertaTerminadoParcial:null

        this.listaEstados[0].numero = res.totalTicketEstadoGenerado?res.totalTicketEstadoGenerado:null
        this.listaEstados[1].numero = res.totalTicketEstadoProgramado?res.totalTicketEstadoProgramado:null
        this.listaEstados[2].numero = res.totalTicketEstadoAsignado?res.totalTicketEstadoAsignado:null
        this.listaEstados[3].numero = res.totalTicketEstadoEnAtencion?res.totalTicketEstadoEnAtencion:null
        this.listaEstados[4].numero = res.totalTicketEstadoTerminadoParcial?res.totalTicketEstadoTerminadoParcial:null
        this.listaEstados[5].numero = res.totalTicketEstadoTerminado?res.totalTicketEstadoTerminado:null
        this.listaEstados[6].numero = res.totalTicketEstadoAnulado?res.totalTicketEstadoAnulado:null
        
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} de estados de tickets` })
      }
    })
  }

  listarMantenimientos(){
    this.dashboardService.getDataMantenimientosPreventivosByDepartamento(this.departamentoId).subscribe({
      next: (res)=>{
        //mantenimientos
        this.listaProgramaciones[0].pasados = res[0].depMP>0?res[0].depMP:null
        this.listaProgramaciones[0].mes1 = res[1].depMP>0?res[1].depMP:null
        this.listaProgramaciones[0].mes2 = res[2].depMP>0?res[2].depMP:null
        this.listaProgramaciones[0].mes3 = res[3].depMP>0?res[3].depMP:null
        this.listaProgramaciones[0].mes4 = res[4].depMP>0?res[4].depMP:null
        this.listaProgramaciones[0].mes5 = res[5].depMP>0?res[5].depMP:null
        this.listaProgramaciones[0].mes6 = res[6].depMP>0?res[6].depMP:null
        
        this.listaProgramaciones[1].mes1 = res[1].depGAR>0?res[1].depGAR:null
        this.listaProgramaciones[1].mes2 = res[2].depGAR>0?res[2].depGAR:null
        this.listaProgramaciones[1].mes3 = res[3].depGAR>0?res[3].depGAR:null
        this.listaProgramaciones[1].mes4 = res[4].depGAR>0?res[4].depGAR:null
        this.listaProgramaciones[1].mes5 = res[5].depGAR>0?res[5].depGAR:null
        this.listaProgramaciones[1].mes6 = res[6].depGAR>0?res[6].depGAR:null

        this.tmes[0] = res[1].col
        this.tmes[1] = res[2].col
        this.tmes[2] = res[3].col
        this.tmes[3] = res[4].col
        this.tmes[4] = res[5].col
        this.tmes[5] = res[6].col
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} de mantenimientos preventivos` })
      }
    })
  }

  listarEquipos(){
    this.dashboardService.getDataTotalClientesEquiposTicketsByDepartamento(this.departamentoId).subscribe({
      next: (res)=>{
        //equipos
        this.equipos[0] = res.totalClientes
        this.equipos[1] = res.totalEquipos
        this.equipos[2] = res.totalSedes
        this.equipos[3] = res.totalTicketProceso
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} de equipos` })
      }
    })
  }

  sockets(){
    setTimeout(() => {   
      
      this.subscriptionTicket =  (this.websocketService.client as Client).subscribe(`/js/subscribe/dashboard/tickets`, (data) => {
        this.listarEstados()
        this.listarMantenimientos()
        this.listarEquipos()
        this.reproducir(1)
      });
    
    }, 1000);
    setTimeout(() => {   
      
      this.subscriptionClientes =  (this.websocketService.client as Client).subscribe(`/js/subscribe/dashboard/clientes`, (data) => {
        this.listarEquipos()
        this.reproducir(2)
      });
    
    }, 1000);
    setTimeout(() => {   
      
    this.subscriptionEquipos = (this.websocketService.client as Client).subscribe(`/js/subscribe/dashboard/equipos`, (data) => {
        this.listarEquipos()
        this.reproducir(3)
      });
    
    }, 1000);
  }

  reproducir(nroAudio: number){
    let audio = new Audio('assets/audio/campana' + nroAudio + '.mp3');
    audio.play();
  }

  navegar(estadoId: number, filterAlert: number){
    this.router.navigate(['/ticket/listado/' + this.departamentoId + '/' + estadoId + "/" + filterAlert])
  }

  navegar2(){
    this.router.navigate(['/dashboard/mantenimientos-preventivos'])
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.subscriptionEquipos.unsubscribe();
    }, 2000);
    setTimeout(() => {
      this.subscriptionClientes.unsubscribe();
    }, 2000);
    setTimeout(() => {
      this.subscriptionTicket.unsubscribe();
    }, 2000);
  }
}
