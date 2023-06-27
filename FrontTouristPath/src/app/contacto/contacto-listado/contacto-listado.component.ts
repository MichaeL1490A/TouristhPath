import { Component, OnDestroy, ViewChild } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Observable, forkJoin } from 'rxjs';
import { FuncionesComunes } from '../../common/funciones-comunes';
import { Mensajes } from '../../common/mensajes';
import { TablaAuxiliarDetalle } from '../../configuracion/models/tabla-auxiliar-detalle';
import { TablaAuxiliarService } from '../../configuracion/tabla-auxiliar/tabla-auxiliar.service';
import { UbigeoService } from '../../ubigeo/ubigeo.service';
import { ContactoService } from '../contacto.service';
import { Table } from 'primeng/table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ContactoModalDetalleComponent } from '../contacto-modal-detalle/contacto-modal-detalle.component';
import { environment } from '../../../environments/environment';
import { saveAs } from 'file-saver';
import { AuthService } from 'src/app/security/auth.service';

@Component({
  selector: 'app-contacto-listado',
  templateUrl: './contacto-listado.component.html',
  styleUrls: ['./contacto-listado.component.css']
})
export class ContactoListadoComponent implements OnDestroy{

  //filtros
  apellidos: string = "";
  titulo: any[] = [];
  area: any[] = [];
  cliente: string = "";
  instAdm: any[] = [];
  dptos: any[] = [];
  cargo: any[] = [];
  red: any[] = [];
  sede: string = "";
  estados: any[] = [];

  f = FuncionesComunes;
  regexAutocomplete = environment.regexAutocomplete;
  ref: DynamicDialogRef;
  currentEvent: LazyLoadEvent;  
  blnOcupado: boolean = false;

  //tabla
  @ViewChild('tcont') table: Table;
  event: LazyLoadEvent;
  page: number = 0;
  totalRegistros: number;
  currentPage: number = 0;
  itemsMaestros: number = 30;
  currentRows: number = this.itemsMaestros;
  
  //contacto
  listaContacto: any[] = [];
  contactoSeleccionado: any

  //auxiliares
  listaTitulo: TablaAuxiliarDetalle[] = [];
  listaArea: TablaAuxiliarDetalle[] = [];
  listaDepartamento: any[];
  listaCargo: TablaAuxiliarDetalle[];
  listaInstitucionAdministrativa: TablaAuxiliarDetalle[];
  listaRed: TablaAuxiliarDetalle[];
  listaEstadoContacto: TablaAuxiliarDetalle[];

  blnCargando: boolean = false;
  mensajeCarga: string = "Generando excel ...";

  constructor(
    private auxiliarService: TablaAuxiliarService,
    private ubigeoService: UbigeoService,
    private messageService: MessageService,
    private contactoService: ContactoService,
    private dialogService: DialogService,
    public authService: AuthService
  ){  }

  ngOnInit(){
    
    this.authService.setRoles()
    
    let listaAuxiliares: Observable<any>[] = [];

    listaAuxiliares.push(
      this.auxiliarService.getListByCodigo('LISTIT'),
      this.auxiliarService.getListByCodigo('LISARE'),
      this.auxiliarService.getListByCodigo('TIPIAD'),
      this.auxiliarService.getListByCodigo('LISCAR'),
      this.auxiliarService.getListByCodigo('TIPRED'),
      this.auxiliarService.getListByCodigo('ESTGRL'),
      this.ubigeoService.getAllDepartamento()
    )

    forkJoin(listaAuxiliares).subscribe({
      next: (res) => {
        this.listaTitulo = res[0];
        this.listaArea = res[1];
        this.listaInstitucionAdministrativa = res[2];
        this.listaCargo = res[3];
        this.listaRed = res[4];
        this.listaEstadoContacto = res[5];
        this.listaDepartamento = res[6];

//        this.listaEstadoContacto.pop();
      },
      error: (err) =>{
        if(err[0]) this.mostrarMensajeError('titulos')
        if(err[1]) this.mostrarMensajeError('áreas')
        if(err[2]) this.mostrarMensajeError('instituciones administrativas')
        if(err[3]) this.mostrarMensajeError('cargos')
        if(err[4]) this.mostrarMensajeError('red')
        if(err[5]) this.mostrarMensajeError('estado de contacto')
        if(err[6]) this.mostrarMensajeError('departamentos')
      }
    })
  }

  ngOnDestroy(): void {
      if (this.ref) this.ref.close();      
  }


  mostrarMensajeError(campo: string){
    this.messageService.add({severity:'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} de ${campo}`})
  }

  listar(event: LazyLoadEvent){
    this.event = event
    this.page = (event.first / event.rows);
    this.currentPage = this.page;
    this.currentRows = event.rows;

    this.contactoService.getList(event, this.page, event.rows).subscribe({
      next: (res) => {
        this.listaContacto = res.content;
        this.totalRegistros = res.pagination.totalElements;
        this.blnOcupado = false;
      },
      error: (err) => {
        this.mostrarMensajeError('lista de contactos')
        this.blnOcupado = false;
      }
    });
  }

  abrirDetalle(id: number) {
    if (this.blnOcupado) return;
    this.ref = this.dialogService.open(ContactoModalDetalleComponent, {
      draggable: true,
      data: {
        id
      },
      header: 'Contacto Detalle',
      width: '60%'
    });

    this.ref.onClose.subscribe((res: any) => {
      if (res?.listado == 1) {
        this.listar(this.event);
      }
    });
  }

  exportarListaContactos(){
    this.blnCargando=true;
    this.contactoService.exportarListaContactos(this.event).subscribe({
      next: (res) => {
        saveAs(res, 'Lista-Contactos.xlsx')
        this.blnCargando=false;
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: `${Mensajes.tituloError}`, detail:  `Error al generar excel de lista de contactos.` });
        this.blnCargando=false;
      }
    })
  }

  limpiarFiltros() {
    this.apellidos = "";
    this.titulo = [];
    this.area = [];
    this.cliente = "";
    this.instAdm = [];
    this.dptos = [];
    this.cargo = [];
    this.red = [];
    this.sede = "";
    this.estados = [];

    this.event.sortOrder = 0;
    this.table.first = 0;
    this.event.first = 0;
    this.table.filters = {};
    this.event.filters = {};
    this.listar(this.event)
  }
}
