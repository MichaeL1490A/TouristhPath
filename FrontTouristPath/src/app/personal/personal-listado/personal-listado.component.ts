import { Component, OnDestroy, OnInit } from '@angular/core';
import { TablaAuxiliarService } from '../../configuracion/tabla-auxiliar/tabla-auxiliar.service';
import { TablaAuxiliarDetalle } from '../../configuracion/models/tabla-auxiliar-detalle';
import { Observable, forkJoin } from 'rxjs';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Mensajes } from '../../common/mensajes';
import { PersonalService } from '../personal.service';
import { FuncionesComunes } from '../../common/funciones-comunes';
import { PersonalModalDetalleComponent } from '../personal-modal-detalle/personal-modal-detalle.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/security/auth.service';

@Component({
  selector: 'app-personal-listado',
  templateUrl: './personal-listado.component.html',
  styleUrls: ['./personal-listado.component.css']
})
export class PersonalListadoComponent implements OnInit, OnDestroy {

  f = FuncionesComunes;
  regexAutocomplete = environment.regexAutocomplete;
  ref: DynamicDialogRef;
  event: LazyLoadEvent;

  listaArea: TablaAuxiliarDetalle[] = [];
  areasSeleccionadas: TablaAuxiliarDetalle[];

  listaTipoPersonal: TablaAuxiliarDetalle[] = [];
  tiposPersonalSeleccionados: TablaAuxiliarDetalle[];

  listaEstado: TablaAuxiliarDetalle[] = [];
  estadosSeleccionados: TablaAuxiliarDetalle[];

  listaPersonal: any[] = [];
  personalSeleccionado: any[] = [];

  blnOcupado: boolean = false;

  constructor(
    private messageService: MessageService,
    private auxiliarService: TablaAuxiliarService,
    private personalService: PersonalService,
    public dialogService: DialogService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.setRoles()
    let listasAuxiliares: Observable<any>[] = [];
    listasAuxiliares.push(
      this.auxiliarService.getListByCodigo('LISARE'),
      this.auxiliarService.getListByCodigo('TIPPER'),
      this.auxiliarService.getListByCodigo('ESTGRL')
    );

    forkJoin(listasAuxiliares).subscribe({
      next: (res) => {
        this.listaArea = res[0];
        this.listaTipoPersonal = res[1];
        this.listaEstado = res[2];
      },
      error: (err) => {
        if (err[0]) this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} de áreas.` });
        if (err[1]) this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} de tipos de personal.` });
        if (err[2]) this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} de estados.` });
      }
    });
  }

  ngOnDestroy() {
    if (this.ref) this.ref.close();
  }

  listar(event: LazyLoadEvent) {
    this.event = event;
    this.blnOcupado = true;
    
    this.personalService.getList(event).subscribe({
      next: (res) => {
        this.listaPersonal = res;
        this.blnOcupado = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} del listado de personal.` });
        this.blnOcupado = false;
      }
    });
  }

  abrirDetalle(id: number) {
    this.ref = this.dialogService.open(PersonalModalDetalleComponent, {
      draggable: true,
      data: {
        id
      },
      header: 'Personal Spectrum',
      width: '1020px'
    });

    this.ref.onClose.subscribe((res: any) => {
      if (res?.listar == 1) {
        this.listar(this.event);
      }
    });
  }

  desahibilitarPersonalMasivo() {
    if (this.personalSeleccionado?.length == 0) {
      this.messageService.add({ severity: 'warn', summary: Mensajes.tituloFaltanDatos, detail: `Debe checkear al menos un personal.` });
      return;
    }
    this.blnOcupado = true;
    let ids: string = this.personalSeleccionado.map(p => p.id).join(',');
    this.personalService.disablePersonalMasivo(ids).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: Mensajes.tituloSuccess, detail: `Empleados inactivados correctamente.` });
        this.personalSeleccionado = [];
        this.listar(this.event);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorGenerico} de desactivar masivo.` });
        this.blnOcupado = false;
      }
    });
  }
}