import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { environment } from 'src/environments/environment';
import { FuncionesComunes } from 'src/app/common/funciones-comunes';
//import { MantenimientoPreventivoService } from 'src/app/equipos/mantenimiento-preventivo.service';
import { Mensajes } from 'src/app/common/mensajes';
import { DatePipe } from '@angular/common';
//import { SubtipoEquipoService } from 'src/app/equipos/subtipo-equipo.service';
//import { Subtipo } from 'src/app/equipos/models/subtipo';
import { Table } from 'primeng/table';
import { ModalObservacionesComponent } from 'src/app/common/modales/modal-observaciones/modal-observaciones.component';
import { saveAs } from 'file-saver';
import { ModalArchivosComponent } from 'src/app/common/modales/modal-archivos/modal-archivos.component';

@Component({
  selector: 'app-dashboard-consumo-accesorios',
  templateUrl: './dashboard-consumo-accesorios.component.html',
  styleUrls: ['./dashboard-consumo-accesorios.component.css']
})
export class DashboardConsumoAccesoriosComponent  implements OnInit {

  f = FuncionesComunes;
  regexAutocomplete = environment.regexAutocomplete;
  ref: DynamicDialogRef;

  event: LazyLoadEvent;
  @ViewChild('dpe') table: Table;
  page: number = 0;
  totalRegistros: number;

  fechaInicial: Date = new Date()
  fechaInicialString: string = this.datePipe.transform(this.fechaInicial, 'yyyy-MM-dd')?.toString()
  blnOcupado: boolean = true;
  listado: any[] = []
  listadoSeleccionado: any[] = []
  keysHeader: any[] = []
//  listaSubtipo: Subtipo[];
//  listaSubtipoSeleccionado: Subtipo[];
//  listaSubSubtipo: Subtipo[];
//  listaSubSubtipoSeleccionado: Subtipo[];
  mesNumero: any;

  constructor(
    private messageService: MessageService,
    public dialogService: DialogService,
  //  public accesorioService: MantenimientoPreventivoService,
    public datePipe: DatePipe,
//    private subtipoService: SubtipoEquipoService
  ) {}

  ngOnInit() {

    this.mesNumero= {"Ene":1, "Feb":2, "Mar":3, "Abr":4, "May":5, "Jun":6,
      "Jul":7, "Ago":8, "Sep":9, "Oct":10, "Nov":11, "Dic":12
      }

    let listasAuxiliares: Observable<any>[] = [];
    listasAuxiliares.push(
//      this.subtipoService.getSubtipoSelect(0)
    );

    forkJoin(listasAuxiliares).subscribe({
      next: (res) => {
  //      this.listaSubtipo = res[0];
      },
      error: (err) => {
        if (err[0]) this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura}  al obtener la informacion.` });
      }
    });
  }

  listar(event: LazyLoadEvent) {
    this.blnOcupado = true;
    this.event = event
    this.page = (event.first / event.rows);

    // this.accesorioService.getListProyeccion (event, this.page, event.rows, this.fechaInicialString).subscribe({
    //   next: (res) => {
    //     this.totalRegistros = res.totalElements;
    //     this.listado = res.content as any[];
    //     this.listado.map( l => {
    //       if(l.obs){
    //         l.obs=JSON.parse(l.obs)
    //       }
    //       else{
    //         l.obs = []
    //       }
    //       return l;
    //     })
      
    //     this.actualizarKeysHeader()
    //   },
    //   error: (err) => {
    //     console.error(err)
    //     this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} de clientes` });
    //     this.blnOcupado = false;
    //   }
    // });
  }

  actualizarKeysHeader(){
    this.listado.forEach( (l,index) => {
      Object.keys(l).forEach(k => {
        if(this.listado[index][k]==0) this.listado[index][k] = ''
      })
    })
    this.keysHeader = []
    if(this.listado?.length>0){
      Object.keys(this.listado[0]).forEach(k => {
        if(k.match('_')){
          this.keysHeader.push(k.replaceAll('_',' '))
        }
      })
      this.keysHeader.sort((a, b) => a.split(' ')[1] - b.split(' ')[1] || this.mesNumero[a.split(' ')[0]] - this.mesNumero[b.split(' ')[0]] )
    }
    

  }

  setDatosGraficas(listado){
  
  }
  mostrarSubSubtipoBySubtipos(){

    // this.listaSubSubtipoSeleccionado = null
    this.event.filters['subsubtipo'] = {value: "", matchMode:"equals"}
    
    // if(this.listaSubtipoSeleccionado?.length >0 ){
    //   this.subtipoService.getSubsubtipoSelect(this.listaSubtipoSeleccionado.map(e => e.id).join()).subscribe({
    //     next: (res) => {
    //       this.listaSubSubtipo = res
    //     },
    //     error: (err) => {
    //       this.messageService.add({severity: 'error', summary: Mensajes.tituloError, detail: 'Error al obtener listado de subsubtipos.'});
    //     }
    //   })
    // }
  }  

  abrirModalObservaciones( data){

    this.ref = this.dialogService.open(ModalObservacionesComponent, {
      draggable: true,
      data: {
        observaciones:  data,
        soloLectura: true,
        mostrarTipo: 0
      },
      header: 'Observaciones del Accesorio',
      width: '700px',
      styleClass: 'custom-dialog-padding-bottom'
    });
  }

  exportarListaConsumoAccesorio(){
    // this.accesorioService.exportarListaConsumoAccesorio(this.event, this.fechaInicialString).subscribe({
    //   next: (res) => {
    //     saveAs(res, 'LISTA-PROYECCION-CONSUMO-ACCESORIO.xlsx');
    //   },
    //   error: (err) => {
    //     this.messageService.add({severity: 'error', summary: Mensajes.tituloError, detail: 'Error al generar excel de proyeccion consumo accesorio en M.P.'});
    //   }
    // })
  }

  cargarArchivo(accesorio: any){
    this.ref = this.dialogService.open(ModalArchivosComponent, {
      draggable: true,
      data: {
        // variables: {archivo: accesorio.foto, file: accesorio.fotoFile, service: this.accesorioService, numeroRuta: 1},
        disable: true
      },
      header: 'FOTO DEL ACCESORIO',
      width: '55%'
    })

    this.ref.onClose.subscribe((res: any) => {
      if (res) {
        accesorio.foto = res.nombreArchivo
        accesorio.fotoFile = res.archivo
      }
    });
    }
}