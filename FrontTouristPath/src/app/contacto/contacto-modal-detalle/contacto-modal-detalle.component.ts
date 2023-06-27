import { Component } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { TablaAuxiliarDetalle } from 'src/app/configuracion/models/tabla-auxiliar-detalle';
import { Contacto } from '../models/contacto';
import { TablaAuxiliarService } from 'src/app/configuracion/tabla-auxiliar/tabla-auxiliar.service';
import { Observable, forkJoin } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Mensajes } from 'src/app/common/mensajes';
import { ContactoService } from '../contacto.service';
import { FuncionesComunes } from 'src/app/common/funciones-comunes';
import { ClienteService } from 'src/app/cliente/cliente.service';
import { Cliente } from 'src/app/cliente/models/cliente';
import { ContactoObservacion } from '../models/contacto-observacion';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/security/auth.service';

@Component({
  selector: 'app-contacto-modal-detalle',
  templateUrl: './contacto-modal-detalle.component.html',
  styleUrls: ['./contacto-modal-detalle.component.css']
})
export class ContactoModalDetalleComponent {

  id: number = 0;
  cliente: any;
  sede: any;

  f = FuncionesComunes;
  regexAutocomplete = environment.regexAutocomplete;
  blnOcupado: boolean = false;

  //contacto
  contacto: Contacto = new Contacto();
  fechaUltimaActualizacion: Date;
  usuarioModifica: string;

  //listas auxiliares
  listaRed: TablaAuxiliarDetalle[];
  listaTitulo: TablaAuxiliarDetalle[];
  listaInstitucionAdministrativa: TablaAuxiliarDetalle[];
  listaEstado: TablaAuxiliarDetalle[];
  listaCargo: TablaAuxiliarDetalle[];
  listaArea: TablaAuxiliarDetalle[];
  listaTipoObservacion: TablaAuxiliarDetalle[] = [];
  listaClienteAutocomplete: any[] = [];
  listaSedeAutocomplete: Cliente[];

  puedoEditar: boolean = false ;
  //tabla observaciones
  listaContactoObservacion: ContactoObservacion[] = [];
  observacionSeleccionado: ContactoObservacion;

  constructor(
    private auxiliarService: TablaAuxiliarService,
    public ref: DynamicDialogRef,
    private messageService: MessageService,
    private contactoService: ContactoService,
    private config: DynamicDialogConfig,
    private clienteService: ClienteService,
    public authService: AuthService
    ) {

  }

  ngOnInit() {
    this.authService.setRoles();
    
    if(this.authService.blnAdmin || this.authService.blnSoporte){
      this.puedoEditar = true
    }
    else{
      this.puedoEditar = false
    }

    this.id = this.config.data.id | 0;
    this.cliente = this.config.data.cliente;
    this.sede = this.config.data.sede;

    let listaAuxiliares: Observable<any>[] = [];

    listaAuxiliares.push(
      this.auxiliarService.getListByCodigo('TIPRED'),
      this.auxiliarService.getListByCodigo('LISTIT'),
      this.auxiliarService.getListByCodigo('TIPIAD'),
      this.auxiliarService.getListByCodigo('ESTGRL'),
      this.auxiliarService.getListByCodigo('LISCAR'),
      this.auxiliarService.getListByCodigo('LISARE'),
      this.auxiliarService.getListByCodigo('TIPOBC')
    )

    forkJoin(listaAuxiliares).subscribe({
      next: (res) => {
        this.listaRed = res[0];
        this.listaTitulo = res[1];
        this.listaInstitucionAdministrativa = res[2];
        this.listaEstado = res[3];
        this.listaCargo = res[4];
        this.listaArea = res[5];
        this.listaTipoObservacion = res[6];

        this.contacto.estado = this.listaEstado.find(e => e.tablaAuxiliarDetalleId.id == 1)

        if(this.id != 0 && this.id != null && this.id != undefined){
          this.getDetalle()
        }

        if(this.cliente != null || this.cliente != undefined){
          this.contacto.cliente = this.cliente as Cliente
        }

        if(this.sede != null || this.sede != undefined){
          this.contacto.sede = this.sede as Cliente
        }
      },
      error: (err) => {
        if(err[0]) this.mensajeErrorLectura('de lista de red')
        if(err[1]) this.mensajeErrorLectura('de lista de titulos')
        if(err[2]) this.mensajeErrorLectura('de lista de instituciones')
        if(err[3]) this.mensajeErrorLectura('de lista de estados')
        if(err[4]) this.mensajeErrorLectura('de lista de cargos')
        if(err[5]) this.mensajeErrorLectura('de lista de areas')
        if(err[6]) this.mensajeErrorLectura('de tipos de dobservación')
      }
    })

  }

  mensajeErrorLectura(valor: string){
    this.messageService.add({severity:'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} ${valor}` })
  }


  getDetalle(){
    this.contactoService.getById(this.id).subscribe({
      next: (res) => {
        this.contacto = res.contacto as Contacto

        this.bindarDatosAuxiliares(res);

        this.f.bindarAuxiliar(this.contacto, 'red', this.listaRed);
        this.f.bindarAuxiliar(this.contacto, 'titulo', this.listaTitulo);
        this.f.bindarAuxiliar(this.contacto, 'institucionAdministrativa', this.listaInstitucionAdministrativa);
        this.f.bindarAuxiliar(this.contacto, 'estado', this.listaEstado);
        this.f.bindarAuxiliar(this.contacto, 'cargo', this.listaCargo);
        this.f.bindarAuxiliar(this.contacto, 'area', this.listaArea);
        this.fechaUltimaActualizacion = this.contacto.fechaModifica? this.f.getFechaHoraFormateadaPrime(this.contacto.fechaModifica):this.f.getFechaHoraFormateadaPrime(this.contacto.fechaCrea);
        this.listaContactoObservacion = this.contacto.observaciones as ContactoObservacion[];
        this.listaContactoObservacion.forEach((lco) => {
          if(lco.fechaCrea != null && lco.fechaCrea != undefined) lco.fechaCrea = this.f.getFechaHoraFormateadaPrime(lco.fechaCrea)
        })
      }


    })
  }

  bindarDatosAuxiliares(res: any){
    this.usuarioModifica = res.usuarioModifica;
    this.cliente = {};
    this.sede = {};

    if(this.contacto.cliente != null || this.contacto.cliente != undefined){
      this.cliente.id = this.contacto.cliente.id;
      this.cliente.texto = this.contacto.cliente.razonSocialNombre;
    }
    if(this.contacto.sede != null || this.contacto.sede != undefined){
      this.sede.id = this.contacto.sede.id;
      this.sede.texto = this.contacto.sede.razonSocialNombre;
    }
  }


  filtrarCliente(term: string){
    this.clienteService.getClienteAutocomplete(term).subscribe({
      next: (cli) => {
        this.listaClienteAutocomplete = cli;
      },
      error: (err) => {
        this.mensajeErrorLectura('de clientes');
      }
    })
  }

  filtrarSede(term: string){
    if(this.cliente == null || this.cliente == undefined){
      this.messageService.add({severity:'warn', summary: `${Mensajes.tituloFaltanDatos}`, detail: `Debe ingresar el cliente para poder buscar sus sedes`})
      return
    }else if(this.cliente.id == null || this.cliente.id == undefined){
      this.messageService.add({severity:'warn', summary: `${Mensajes.tituloFaltanDatos}`, detail: `El cliente no es válido, seleccione un cliente`})
      return
    }

    this.clienteService.getSedeAutocomplete(term, this.cliente.id).subscribe({
      next: (sede) => {
        this.listaSedeAutocomplete = sede;
      },
      error: (err) => {
        this.mensajeErrorLectura('de sedes');
      }
    })
  }

  agregar(){
    let contactoNuevo = new ContactoObservacion();
    contactoNuevo.id = 0;
    this.listaContactoObservacion.unshift(contactoNuevo);

  }

  validar(): boolean {
    if(this.cliente == null || this.cliente == undefined){
      this.messageService.add({severity: 'warn', summary: `${Mensajes.tituloWarning}`, detail: `Debe ingesar el cliente`});
      return false
    }else if(this.cliente.id == null || this.cliente.id == undefined){
      this.messageService.add({severity: 'warn', summary: `${Mensajes.tituloWarning}`, detail: `El cliente no es válido, selecciono otro`});
      return false
    }

    if(this.sede != null && this.sede != undefined){
      if(this.sede.id == null && this.sede == undefined){
        this.messageService.add({severity: 'warn', summary: `${Mensajes.tituloWarning}`});
      }
    }

    return this.f.valida([
      {'tipo': 'string', 'nombre': 'el apellido paterno', 'valor': this.contacto.apellidoPaterno},
      {'tipo': 'string', 'nombre': 'el nombre', 'valor': this.contacto.nombres}
    ], this.messageService);


  }

  guardar(){
    this.contacto.cliente = new Cliente();

    if(this.validar()){
      this.blnOcupado = true;
      this.contacto.cliente.id = this.cliente.id
      if(this.sede?.id){
        this.contacto.sede = new Cliente();
        this.contacto.sede.id = this.sede.id
      }
      else this.contacto.sede = null

      this.listaContactoObservacion.forEach((lco)=>{
        if(lco.id == 0) lco.id = null
      })

      if(!this.contacto.observaciones)
        this.contacto.observaciones = this.listaContactoObservacion

      this.id==0? this.crear():this.actualizar();
    }
  }

  crear(){
    this.contacto.fechaCrea = new Date();
    this.contacto.idUsuarioCrea = this.authService.usuario.id; 

    if(this.contacto.sede != null && this.contacto.sede != undefined){
        
    }

    this.contactoService.create(this.contacto).subscribe({
      next: (res) => {
        this.messageService.add({severity: 'success', summary: Mensajes.tituloSuccess, detail: Mensajes.mensajeGuardadoSuccess});
        this.ref.close({listado: 1});
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({severity: 'error', summary: Mensajes.tituloError, detail: Mensajes.mensajeErrorCreacion});
        this.blnOcupado = false;
      }
    });
  }

  actualizar(){
    this.contacto.fechaModifica = new Date();
    this.contacto.idUsuarioModifica = this.authService.usuario.id; 

    this.contactoService.update(this.contacto).subscribe({
      next: (res) => {        
        this.messageService.add({severity: 'success', summary: Mensajes.tituloSuccess, detail: Mensajes.mensajeActualizadoSuccess});
        this.ref.close({listado: 1});
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({severity: 'error', summary: Mensajes.tituloError, detail: Mensajes.mensajeErrorCreacion});
        this.blnOcupado = false;
      }
    });

  }

  cerrarModal(){
    this.ref.close();
  }

}
