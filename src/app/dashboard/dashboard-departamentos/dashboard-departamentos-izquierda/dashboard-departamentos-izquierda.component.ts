import { Component, Input, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { Subject } from 'rxjs';
import { WebsocketService } from 'src/app/notificacion/websocket.service';
import { UbigeoService } from 'src/app/ubigeo/ubigeo.service';

@Component({
  selector: 'app-dashboard-departamentos-izquierda',
  templateUrl: './dashboard-departamentos-izquierda.component.html',
  styleUrls: ['./dashboard-departamentos-izquierda.component.css']
})
export class DashboardDepartamentosIzquierdaComponent implements OnInit {

  @Input()
  seleccionarDepartamento: Subject<any> = new Subject<any>();
  
  departamentos: any[] = [];
  @Input()
  clicked: any = {id: 0};

  subscriptionEquipos: any;
  subscriptionClientes: any;
  
  constructor(
    private ubigeoService: UbigeoService,
    public websocketService: WebsocketService,
  ){}

  ngOnInit(): void {
    this.ubigeoService.getGrafosDepartamento().subscribe({
      next: (res)=>{
        this.departamentos = res
      }
    })

    this.websocketService.conexion()
    this.sockets()
  }
  
  seleccion(dep: any){
    if(dep.indUso == 0) return
    this.clicked.id = dep.id
    this.seleccionarDepartamento.next({id: dep.id, descripcion: dep.descripcion});
  }
  sockets(){
  
      setTimeout(() => {   
      
        this.subscriptionClientes =  (this.websocketService.client as Client).subscribe(`/js/subscribe/dashboard/clientes`, (data) => {
          this.getInfo()
        });
      
      }, 1000);
      setTimeout(() => {   
        
      this.subscriptionEquipos = (this.websocketService.client as Client).subscribe(`/js/subscribe/dashboard/equipos`, (data) => {
        this.getInfo()
        });
      
      }, 1000);
  
  }

  getInfo(){
    this.ubigeoService.getGrafosDepartamento().subscribe({
      next: (res)=>{
        this.departamentos = res
      }
    })
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.subscriptionEquipos.unsubscribe();
    }, 2000);
    setTimeout(() => {
      this.subscriptionClientes.unsubscribe();
    }, 2000);
  }
}
