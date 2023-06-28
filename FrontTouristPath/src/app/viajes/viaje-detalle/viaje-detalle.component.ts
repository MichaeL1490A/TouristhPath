import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Viaje } from '../models/viaje';
import { TablaAuxiliarService } from 'src/app/configuracion/tabla-auxiliar/tabla-auxiliar.service';
import { UbigeoService } from 'src/app/ubigeo/ubigeo.service';
import { Observable, forkJoin } from 'rxjs';
import { Departamento } from 'src/app/ubigeo/models/departamento';
import { Provincia } from 'src/app/ubigeo/models/provincia';
import { Distrito } from 'src/app/ubigeo/models/distrito';
import { MessageService } from 'primeng/api';
import { Mensaje } from 'src/app/correo/models/mensaje';
import { Mensajes } from 'src/app/common/mensajes';

@Component({
  selector: 'app-viaje-detalle',
  templateUrl: './viaje-detalle.component.html',
  styleUrls: ['./viaje-detalle.component.css']
})
export class ViajeDetalleComponent {

  id: number;
  viaje: Viaje = new Viaje();
  reembolsable: boolean = true;

  listaDepartamentos: Departamento[];
  origenDepartamento: Departamento;
  destinoDepartamento: Departamento;
  listaProvinciaOrigen: Provincia[];
  listaProvinciaDestino: Provincia[];
  origenProvincia: Provincia;
  destinoProvincia: Provincia;
  listaDistritoOrigen: Distrito[];
  listaDistritoDestino: Distrito[];




  constructor(
    private activatedRoute: ActivatedRoute,
    private auxiliarService: TablaAuxiliarService,
    private ubigeroService: UbigeoService,
    private messageService: MessageService
  ){

  }
  ngOnInit(){

    let listaAuxiliares: Observable<any>[] = [];
    listaAuxiliares.push(
      this.ubigeroService.getAllDepartamento(),
      this.auxiliarService.getListByCodigo('TIPIAD'),
    )

    this.activatedRoute.paramMap.subscribe(p => {
      this.id = Number(p.get('id'));

      forkJoin(listaAuxiliares).subscribe({
        next: (res) => {
          this.listaDepartamentos = res[0]
        }
      })



      if(this.id == 0){
        this.nuevoViaje()
      }

      
    })
  }

  nuevoViaje(){

  }

  getProvincia(dep: Departamento, caso: number){
    this.ubigeroService.getProvinciaByDepartamento(dep.id).subscribe({
      next: (res) => {
        if(caso == 0)      this.listaProvinciaOrigen = res;
        else if(caso == 1) this.listaProvinciaDestino = res;
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: `${Mensajes.tituloError}`, detail: 'Error al obtener la lista de provincias'});
      }
    })
  }

  getDistrito(pro: Provincia, caso: number){
    this.ubigeroService.getDistritoByProvincia(this.origenProvincia.id).subscribe({
      next: (res) => {
        if(caso == 0)      this.listaDistritoOrigen = res;
        else if(caso == 1) this.listaDistritoDestino = res;
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: `${Mensajes.tituloError}`, detail: 'Error al obtener la lista de distritos'});
      }      
    })
  }

  guardar(){
    console.log(this.viaje)
  }


}

