import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { environment } from 'src/environments/environment';
import { FuncionesComunes } from 'src/app/common/funciones-comunes';
import { MantenimientoPreventivoService } from 'src/app/equipos/mantenimiento-preventivo.service';
import { Mensajes } from 'src/app/common/mensajes';
import { DatePipe } from '@angular/common';
import { SubtipoEquipoService } from 'src/app/equipos/subtipo-equipo.service';
import { Subtipo } from 'src/app/equipos/models/subtipo';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { AuthService } from 'src/app/security/auth.service';

@Component({
  selector: 'app-dashboard-mantenimiento-preventivo',
  templateUrl: './dashboard-mantenimiento-preventivo.component.html',
  styleUrls: ['./dashboard-mantenimiento-preventivo.component.css']
})
export class DashboardMantenimientoPreventivoComponent  implements OnInit {

  f = FuncionesComunes;
  regexAutocomplete = environment.regexAutocomplete;
  ref: DynamicDialogRef;
  event: LazyLoadEvent;

  fechaInicial: Date = new Date()
  blnOcupado: boolean = true;
  listado: any[] = []
  listaSubtipo: Subtipo[];
  listaSubtipoSeleccionado: Subtipo[];
  listaSubSubtipo: Subtipo[];
  listaSubSubtipoSeleccionado: Subtipo[];

  listadoDetalle: any[] = []
  listadoDetalleSeleccionado: any[] = []
  mes: number = 5
  anio: number = 2023
  mesActual: number = 5
  anioActual: number = 2023
  modo: number = 1
  lima: number = 1

  items: MenuItem[];
  activeItem: MenuItem;
  tipoGrafico: number = 1
  mensaje: string = '';
  dataMP: any;
  dataGAR: any;
  options: any;

  mesNumero= {"Ene":1, "Feb":2, "Mar":3, "Abr":4, "May":5, "Jun":6,
  "Jul":7, "Ago":8, "Sep":9, "Oct":10, "Nov":11, "Dic":12
  }

  constructor(
    private messageService: MessageService,
    public dialogService: DialogService,
    public mantenimientoPreventivoService: MantenimientoPreventivoService,
    public datePipe: DatePipe,
    private subtipoService: SubtipoEquipoService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {

    this.authService.setRoles()

    let fecha = this.datePipe.transform(this.fechaInicial, 'yyyy-MM-dd')?.toString()
    this.mes = this.fechaInicial.getMonth() + 1
    this.anio = this.fechaInicial.getFullYear()
    this.mesActual = this.fechaInicial.getMonth() + 1
    this.anioActual = this.fechaInicial.getFullYear()

    this.items = [
      { label: 'Gráfico Mantenimientos Preventivos',  command: () => {
        this.tipoGrafico = 1
      }
        
      },
      { label: 'Gráfico Garantía', command: () => {
        this.tipoGrafico = 2
      }},
    ];

    this.activeItem = this.items[0];

    let listasAuxiliares: Observable<any>[] = [];
    listasAuxiliares.push(
      this.mantenimientoPreventivoService.getListDashboard(fecha),
      this.subtipoService.getSubtipoSelect(0)
    );

    forkJoin(listasAuxiliares).subscribe({
      next: (res) => {
        this.listado = res[0]
        this.listado.sort((a, b) => (a.m < b.m && a.anio < b.anio)? -1:1)

        this.mensaje = 'MANTENIMIENTO PREVENTIVO EQUIPOS ' + this.listado[1]?.mes.toString() + ' - ' + this.listado[6]?.mes +' '+ this.listado[6]?.anio
        this.listaSubtipo = res[1];
        this.setDatosGraficas(JSON.parse(JSON.stringify(this.listado)))

        this.listado.forEach( (l,index) => {
          Object.keys(l).forEach(k => {
            if(this.listado[index][k]==0) this.listado[index][k] = ''
          })
        })

      },
      error: (err) => {
        if (err[0]) this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura}  al obtener la informacion.` });
      }
    });
  }
  
  listar(event: LazyLoadEvent) {
    this.event = event;
    this.blnOcupado = true;
    
    this.mantenimientoPreventivoService.getListEquipoDetalle(event, this.mes, this.anio, this.modo, this.lima).subscribe({
      next: (res) => {
        this.listadoDetalle = res
        this.blnOcupado = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} al obtener la informacion.` });
        this.blnOcupado = false;
      }
    });
  }

  setDatosGraficas(listado){
    let documentStyle = getComputedStyle(document.documentElement);
    let textColor = documentStyle.getPropertyValue('--color-text-label');
    let textColorSecondary = documentStyle.getPropertyValue('--color-text-input');
    let surfaceBorder = '#dfeaf4'
    let colorLima ='#7F97E5';
    let colorProvincia = '#6BD6D6';

    let labels = []
    let limaMP = []
    let provinciaMP = []
    let limaGAR = []
    let provinciaGAR = []
    listado.splice(0,1)
    listado.forEach( m => {
      labels.push(m.mes);
      limaMP.push(m.limaMP);
      provinciaMP.push(m.provinciaMP);
      limaGAR.push(m.limaGAR);
      provinciaGAR.push(m.provinciaGAR);
    })

    this.dataMP = {
      labels: labels,
      datasets: [
          {
              label: 'EQUIPOS EN LIMA',
              backgroundColor: colorLima,
              borderColor: colorLima,
              data: limaMP,
              borderWidth: 1
          },
          {
              label: 'EQUIPOS EN PROVINCIA',
              backgroundColor: colorProvincia,
              borderColor: colorProvincia,
              data: provinciaMP,
              borderWidth: 1
          }
      ]
    };
    this.dataGAR = {
      labels: labels,
      datasets: [
          {
              label: 'EQUIPOS EN LIMA',
              backgroundColor: colorLima,
              borderColor: colorLima,
              data: limaGAR,
              borderWidth: 1
          },
          {
              label: 'EQUIPOS EN PROVINCIA',
              backgroundColor: colorProvincia,
              borderColor: colorProvincia,
              data: provinciaGAR,
              borderWidth: 1
          }
      ]
    };
    this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                
                ticks: {
                    color: textColorSecondary,
                    stepSize: 1
                },
                grid: {
                    color: surfaceBorder,
                    borderWidth: 0.5,
                    drawBorder: false
                }
            },
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };
  }
  mostrarSubSubtipoBySubtipos(){

    this.listaSubSubtipoSeleccionado = null
    this.event.filters['subsubtipo'] = {value: "", matchMode:"equals"}
    
    if(this.listaSubtipoSeleccionado?.length >0 ){
      this.subtipoService.getSubsubtipoSelect(this.listaSubtipoSeleccionado.map(e => e.id).join()).subscribe({
        next: (res) => {
          this.listaSubSubtipo = res
        },
        error: (err) => {
          this.messageService.add({severity: 'error', summary: Mensajes.tituloError, detail: 'Error al obtener listado de subsubtipos.'});
        }
      })
    }
  }  

  setValores(mes,anio,modo,lima){
    this.mes = mes;
    this.anio = anio;
    this.modo = modo ;
    this.lima = lima ;
    this.listar(this.event)
  }
  nuevoTicket(){

    let id: any = this.listadoDetalleSeleccionado[0].clienteSedeId
    let igual = this.listadoDetalleSeleccionado.some(e=>{
      if(e.clienteSedeId!=id){
        this.messageService.add({ severity: 'warn', summary: Mensajes.tituloDatosErroneos, detail: `${Mensajes.mensajeErrorGenerico}: Los equipos deben ser del mismo Cliente y/o Sede` });
        return true;
      }
      else{
        return false;
      }
    })

    if(!igual){
      this.router.navigate(['/ticket/detalle/0',{equipos: JSON.stringify(this.listadoDetalleSeleccionado), preventivo: false}])
    }
  }

  exportarListaMantenimientoPreventivoEquipos(){
    this.mantenimientoPreventivoService.exportarListaMantenimientoPreventivoEquipos(
      this.event, this.mes, this.anio, this.modo, this.lima).subscribe({
        next: (res) => {
          saveAs(res, 'LISTA-MANTENIMIENTO-PREVENTIVO-EQUIPOS.xlsx');
        },
        error: (err) => {
          this.messageService.add({severity: 'error', summary: Mensajes.tituloError, detail: 'Error al generar excel de mantenimiento preventivo de equipos'});
        }  
      })
    
  }
}