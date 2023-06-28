import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TablaAuxiliarDetalle } from '../../../configuracion/models/tabla-auxiliar-detalle';
import { TablaAuxiliarService } from 'src/app/configuracion/tabla-auxiliar/tabla-auxiliar.service';
import { Mensajes } from '../../mensajes';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FuncionesComunes } from '../../funciones-comunes';

@Component({
  selector: 'app-modal-observaciones',
  templateUrl: './modal-observaciones.component.html',
  styleUrls: ['./modal-observaciones.component.css']
})
export class ModalObservacionesComponent implements OnInit {

  f = FuncionesComunes;

  listaTipo: TablaAuxiliarDetalle[] = [];

  listaObservacion: Observacion[] = [];

  blnOcupado: boolean = false;

  soloLectura: boolean = false;

  indMostrarTipo: boolean = true;
  constructor(
    private messageService: MessageService,
    private auxiliarService: TablaAuxiliarService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.soloLectura = this.config.data.soloLectura??false
    this.blnOcupado = true;

    if(this.config.data?.mostrarTipo==0){
      this.indMostrarTipo = false
    }

    this.auxiliarService.getListByCodigo('TIPOBS').subscribe({
      next: (res) => {
        this.listaTipo = res;
        this.listaObservacion = this.config.data.observaciones as Observacion[] | [];
        this.listaObservacion.forEach(o => this.f.bindarAuxiliar(o, 'tipo', this.listaTipo));
        this.blnOcupado = false;
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} de tipos de observación.` });
      }
    });
  }

  agregarObservacion() {
    if (this.blnOcupado || this.soloLectura) return;
    let obs: Observacion = new Observacion();
    obs.id = 0;
    this.listaObservacion.push(obs);
  }

  quitarObservacion(i: number) {
    this.listaObservacion.splice(i, 1);
  }

  guardar() {

    this.listaObservacion = this.listaObservacion?.filter(o => o?.descripcion?.trim()?.length > 0);
    this.ref.close({actualizar: 1, observaciones: this.listaObservacion});

  }

  cerrarModal() {
    this.ref.close();
  }
}

class Observacion {
  id: number;
  tipo: TablaAuxiliarDetalle;
  descripcion: string;
}
