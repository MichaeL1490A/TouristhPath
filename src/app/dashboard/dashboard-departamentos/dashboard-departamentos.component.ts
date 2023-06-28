import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard-departamentos',
  templateUrl: './dashboard-departamentos.component.html',
  styleUrls: ['./dashboard-departamentos.component.css']
})
export class DashboardDepartamentosComponent implements OnInit{

  seleccionarDepartamento: Subject<any> = new Subject<any>();

  mapa: any
  clicked:any = {id:-1}
  fechaActual = new Date()
  ngOnInit(): void {
    
  }

  seleccion(dep: any){
    this.seleccionarDepartamento.next({id: 0, descripcion:'PERÚ'});
    this.clicked.id = 0
  }
}
