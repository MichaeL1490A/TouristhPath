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
import { environment } from 'src/environments/environment';
import { ViajeFoto } from '../models/viaje-foto';
import { TablaAuxiliarDetalle } from 'src/app/configuracion/models/tabla-auxiliar-detalle';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ViajeModalArchivosComponent } from '../viaje-modal-archivos/viaje-modal-archivos.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-viaje-detalle',
  templateUrl: './viaje-detalle.component.html',
  styleUrls: ['./viaje-detalle.component.css']
})
export class ViajeDetalleComponent {

  f = FuncionesComunes;
  ref: DynamicDialogRef;

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

  blnVisible: boolean = false;


  listaOfertas: TablaAuxiliarDetalle[] = [];
  listaServiciosVip: TablaAuxiliarDetalle[] = [];
  listaEstado: TablaAuxiliarDetalle[] = [];
  serviciosVip: TablaAuxiliarDetalle[] = [];


  blnCargando: boolean = true;
  _activeIndex: number = 0;
  get activeIndex(): number {
    return this._activeIndex;
  }

  set activeIndex(newValue) {
    if (this.viaje.archivos && 0 <= newValue && newValue <= this.viaje.archivos?.length - 1) {
        this._activeIndex = newValue;
    }
  }



  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private auxiliarService: TablaAuxiliarService,
    private ubigeroService: UbigeoService,
    private messageService: MessageService,
    private viajeService: ViajeService,
    private dialogService: DialogService,
    public datePipe: DatePipe
  ){

  }
  ngOnInit(){

    let listaAuxiliares: Observable<any>[] = [];
    listaAuxiliares.push(
      this.ubigeroService.getAllDepartamento(),
      this.auxiliarService.getListByCodigo('TPOFER'),
      this.auxiliarService.getListByCodigo('TPSERV'),
      this.auxiliarService.getListByCodigo('TPESTV')
    )

    this.activatedRoute.paramMap.subscribe(p => {
      this.id = Number(p.get('id'));

      forkJoin(listaAuxiliares).subscribe({
        next: (res) => {
          this.listaDepartamentos = res[0];
          this.listaOfertas = res[1];
          this.listaServiciosVip = res[2];
          this.listaEstado = res[3];
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
    let archivo = [{
      itemImageSrc: 'https://www.spectrumperu.com/aplication/webroot/imgs/catalogo/150928091226bell-3.jpg',
    }]
    this.viaje.archivos.push(archivo)
  }

  getProvincia(dep: Departamento, caso: number){
    
    this.ubigeroService.getProvinciaByDepartamento(dep.id).subscribe({
      next: (res) => {
        if(caso == 0){
          this.listaProvinciaOrigen = res;
          this.origenProvincia = null;
          this.viaje.origenDistrito = null
        }
        else if(caso == 1){
          this.listaProvinciaDestino = res;
          this.destinoProvincia = null;
          this.viaje.destinoDistrito = null
        }
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: `${Mensajes.tituloError}`, detail: 'Error al obtener la lista de provincias'});
      }
    })
  }

  getDistrito(pro: Provincia, caso: number){
    let provincia: number = caso==0? this.origenProvincia.id:this.destinoProvincia.id

    this.ubigeroService.getDistritoByProvincia(provincia).subscribe({
      next: (res) => {
        if(caso == 0){
          this.listaDistritoOrigen = res;
          this.viaje.origenDistrito = null
        }      
        else if(caso == 1){
          this.listaDistritoDestino = res;
          this.viaje.destinoDistrito = null;
        }
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
//    if(!this.validar()) return
    console.log(this.viaje)

    let ser: string = '';
    let ix: number;
    this.viaje.archivos = []
    this.viaje.estado = this.listaEstado[1];
    this.viaje.reembolsable = this.reembolsable;
    this.viaje.serviciosVip = '';
    this.serviciosVip.forEach(sv => {
      this.viaje.serviciosVip = sv.tablaAuxiliarDetalleId.id + ',' + this.viaje.serviciosVip
      ser = sv.nombre + ', ' + ser
    })
    this.viaje.serviciosVip = this.viaje.serviciosVip.substring(0, this.viaje.serviciosVip.length-1);
    ser = ser.substring(0, ser.length-2);
    ix = this.viaje.descripcion.indexOf('\nSERVICIOS VIP');
    this.viaje.descripcion = ix !=-1?  this.viaje.descripcion.substring(0, ix): this.viaje.descripcion;
    this.viaje.descripcion = this.viaje.descripcion + '\nSERVICIOS VIP : ' +  ser;

    
    if(this.viaje?.id == 0){
      this.viajeService.create(this.viaje).subscribe({
        next: (res) => {
          this.messageService.add({severity: 'success', summary: `${Mensajes.tituloSuccess}`, detail: 'Se ha creado el viaje con éxito'});
          this.salir();
        },
        error: (err) => {
          this.messageService.add({severity: 'error', summary: `${Mensajes.tituloError}`, detail: 'Error al crear el viaje'});
        }
      })  
    }else{
      this.viajeService.update(this.viaje).subscribe({
        next: (res) => {
          this.messageService.add({severity: 'success', summary: `${Mensajes.tituloSuccess}`, detail: 'Se ha actualizado el viaje con éxito'});
          this.salir();
        },
        error: (err) => {
          this.messageService.add({severity: 'error', summary: `${Mensajes.tituloError}`, detail: 'Error al actualizar el viaje'});
        }
      })
    }
  }

  getViajeById(){
    this.viajeService.getById(this.id).subscribe({
      next: (res) => {
        console.log(res)
        this.viaje = res
        this.viaje.diaSalida = this.f.getFechaHoraFormateadaPrime(this.viaje.diaSalida)
        this.reembolsable = this.viaje.reembolsable;
        this.viaje.archivos = []
        this.viaje.serviciosVip.split(',').forEach(sv => {
          this.listaServiciosVip.forEach(lsv => {
            if(parseInt(sv) == lsv.tablaAuxiliarDetalleId.id){
              this.serviciosVip.push(lsv)
            }
          })
        })
        this.getUbigeoOrigen()
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: `${Mensajes.tituloError}`, detail: 'Error al obtener datos del viaje'});
      }
    })
  }

  getUbigeoOrigen(){
    this.ubigeroService.getDistritoByDistrito(this.viaje.origenDistrito.id).subscribe({
      next: (res) => {
        this.listaDistritoOrigen = res
        this.listaDistritoOrigen.forEach(ld => {
          if(ld.id == this.viaje.origenDistrito.id){
            this.viaje.origenDistrito = ld
          }
        })
        this.ubigeroService.getProvinciaByDistrito(this.viaje.origenDistrito.id).subscribe({
          next: (res2) => {
            this.listaProvinciaOrigen = res2
            this.listaProvinciaOrigen.forEach(lp => {
              if(lp.id == this.viaje.origenDistrito.provincia.id){
                this.origenProvincia = lp
              }
            })

            this.ubigeroService.getAllDepartamento().subscribe({
              next: (res) => {
                this.listaDepartamentos = res;
                this.listaDepartamentos.forEach( ld => {
                  if(ld.id == this.origenProvincia.departamento.id){
                    this.origenDepartamento = ld
                  }
                })
                this.getUbigeoDestino()
              },
              error: (err) => {
                this.messageService.add({severity: 'error', summary: `${Mensajes.tituloError}`, detail: 'Error al obtener el departamento de origen'});
              }
            })
          },
          error: (err) => {
            this.messageService.add({severity: 'error', summary: `${Mensajes.tituloError}`, detail: 'Error al obtener la provincia de origen'});
          }
        })
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: `${Mensajes.tituloError}`, detail: 'Error al obtener el distrito de origen'});
      }
    })
  }

  getUbigeoDestino(){
    this.ubigeroService.getDistritoByDistrito(this.viaje.destinoDistrito.id).subscribe({
      next: (res) => {
        this.listaDistritoDestino = res
        this.listaDistritoDestino.forEach(ld => {
          if(ld.id == this.viaje.destinoDistrito.id){
            this.viaje.destinoDistrito = ld
          }
        })
        this.ubigeroService.getProvinciaByDistrito(this.viaje.destinoDistrito.id).subscribe({
          next: (res2) => {
            this.listaProvinciaDestino = res2
            this.listaProvinciaDestino.forEach(lp => {
              if(lp.id == this.viaje.destinoDistrito.provincia.id){
                this.destinoProvincia = lp
              }
            })
            this.listaDepartamentos.forEach( ld => {
              if(ld.id == this.destinoProvincia.departamento.id){
                this.destinoDepartamento = ld
              }
            })

            this.ubigeroService.getAllDepartamento().subscribe({
              next: (res) => {
//                this.listaDepartamentos = res;
//                this.listaDepartamentos.forEach( ld => {
//                  if(ld.id == this.origenProvincia.departamento.id){
//                    this.origenDepartamento = ld
 //                 }
 //               })
                this.blnCargando = false
              },
              error: (err) => {
                this.messageService.add({severity: 'error', summary: `${Mensajes.tituloError}`, detail: 'Error al obtener el departamento de origen'});
              }
            })
          },
          error: (err) => {
            this.messageService.add({severity: 'error', summary: `${Mensajes.tituloError}`, detail: 'Error al obtener la provincia de origen'});
          }
        })

      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: `${Mensajes.tituloError}`, detail: 'Error al obtener el distrito de origen'});
      }

    })
  }


  selectFile(input: HTMLInputElement): void {
    input.click();
  }

  cargarFoto(event: any){
    console.log(this.activeIndex)
    let archivo: File = event.target.files[0];

    if(!archivo) {return}

    if(archivo.size > environment.sizeFile){
      this.messageService.add({severity: 'warn', summary: `${Mensajes.tituloWarning}`, detail: `No se puede cargar archivos tan pesados`})
      archivo = null;
      return;
    }

    let fotoNew = new ViajeFoto()
    fotoNew.id = 0
    fotoNew.fotoAux = null
    fotoNew.foto = archivo.name
    fotoNew.fotoFile = archivo

    let reader = new FileReader();
    reader.readAsDataURL(fotoNew.fotoFile);
    reader.onloadend = () => fotoNew.fotoUrl = reader.result as string;

    this.viaje.archivos.push(fotoNew)
    this.activeIndex = this.activeIndex +1

  }

  ocultarNuevo(){
    this.blnVisible = false
    setTimeout(() => {
      this.next()
      this.blnVisible = true
    }, 0);
  }

  next() {
    this.activeIndex++;
  }

  salir(){
    this.router.navigateByUrl("/viaje/listado");
  }

  abrirModalArchivos(){
    this.ref = this.dialogService.open(ViajeModalArchivosComponent, {
      draggable: true,
      data: { },
      header: 'DOCUMENTOS DEL VIAJE',
      width: '600px'
    })

    this.ref.onClose.subscribe((res: any) => {
      if (res?.actualizar == 1) {
//        this.responseModalCopia(res);
      }
    });

  }
}

