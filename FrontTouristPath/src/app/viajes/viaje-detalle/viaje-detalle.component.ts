import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { ViajeService } from '../viaje.service';
import { FuncionesComunes } from 'src/app/common/funciones-comunes';

@Component({
  selector: 'app-viaje-detalle',
  templateUrl: './viaje-detalle.component.html',
  styleUrls: ['./viaje-detalle.component.css']
})
export class ViajeDetalleComponent {

  f = FuncionesComunes;

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

  _activeIndex: number = 0;
  get activeIndex(): number {
    return this._activeIndex;
  }

  set activeIndex(newValue) {
//    if (this.equipo.fotosActivas && 0 <= newValue && newValue <= this.equipo.fotosActivas?.length - 1) {
//        this._activeIndex = newValue;
//    }
  }



  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private auxiliarService: TablaAuxiliarService,
    private ubigeroService: UbigeoService,
    private messageService: MessageService,
    private viajeService: ViajeService
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
        this.nuevoViaje();
      }else{
        this.getViajeById();
      }

      
    })
  }

  nuevoViaje(){
    let archivo = {
      fotoUrl: 'https://lh3.googleusercontent.com/atMuLhGMqOCbCSn69HvtfA4LNnOVQIJOgtp9lzv3uIWzfl2wBBlKQnzfR7M8sBLM32Xa6pcFulTrOt-SuO49sZTgDiihHIVAu5PHCfo'
    };
    this.viaje.archivos.push(archivo)

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

  validar(): boolean {
    return this.f.valida([
      { 'tipo': 'number', 'nombre': 'el precio regular', 'valor': this.viaje.precioRegular },
      { 'tipo': 'number', 'nombre': 'el precio vip', 'valor': this.viaje.precioVip },
      { 'tipo': 'number', 'nombre': 'las horas de viaje', 'valor': this.viaje.horasViaje },
      { 'tipo': 'number', 'nombre': 'el total de pasajeros', 'valor': this.viaje.totalPasajeros },
      { 'tipo': 'string', 'nombre': 'el terminal de origen', 'valor': this.viaje.origenTerminalSalida },
      { 'tipo': 'object', 'nombre': 'el distrito de origen del terminal', 'valor': this.viaje.origenDistrito },
      { 'tipo': 'string', 'nombre': 'la direccion de origen del terminal', 'valor': this.viaje.origenDireccion },
      { 'tipo': 'string', 'nombre': 'el terminal de llegada', 'valor': this.viaje.destinoTerminalLlegada },
      { 'tipo': 'object', 'nombre': 'el distrito de llegada del terminal', 'valor': this.viaje.destinoDistrito },
      { 'tipo': 'string', 'nombre': 'el direccion de llegada del terminal', 'valor': this.viaje.destinoDireccion }
    ], this.messageService);
  }


  guardar(){
    if(!this.validar()) return

    this.viajeService.create(this.viaje).subscribe({
      next: (res) => {
        this.messageService.add({severity: 'success', summary: `${Mensajes.tituloSuccess}`, detail: 'Se ha creado el viaje con éxito'});
        this.salir();
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: `${Mensajes.tituloError}`, detail: 'Error al crear el viaje'});
      }
    })
    console.log(this.viaje)
  }

  getViajeById(){
    this.viajeService.getById(this.id).subscribe({
      next: (res) => {
        this.viaje = res
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: `${Mensajes.tituloError}`, detail: 'Error al obtener datos del viaje'});
      }
    })
  }





  salir(){
    this.router.navigateByUrl("/viaje/listado");
  }
}

