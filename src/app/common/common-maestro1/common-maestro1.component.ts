import { Component } from '@angular/core';
import { Mensajes } from '../mensajes';
import { CommonMaestro1Service } from './common-maestro1.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';

@Component({
  selector: 'app-common-maestro1',
  templateUrl: './common-maestro1.component.html',
  styleUrls: ['./common-maestro1.component.css']
})
export class CommonMaestro1Component<T> {

  item: T;
  listado: T[];
  itemSeleccionado: T;
  blnAccion: boolean = true;
  blnFront: boolean;

  currentEvent: LazyLoadEvent;
  totalRegistros: number;
  mensaje = Mensajes;
  obligatorios: string[] = [];
  event: any = {};
  currentPage: number = 0;
  currentRows: number = 5;

  constructor(
    protected commonService: CommonMaestro1Service<T>,
    protected messageService: MessageService,
    // protected item: T,
  ) { }

  listar(event: LazyLoadEvent): void {
    this.event = event;
    this.blnAccion = true;
    this.currentEvent = event;
    let page: number = (event.first/event.rows);
    this.currentPage = page;
    this.currentRows = event.rows;
    this.commonService.getAllPage(event, event.sortField?event.sortField:'id', event.sortOrder?event.sortOrder:0, event.rows, page).subscribe({
      next: (res) => {
        this.totalRegistros = res.totalElements;
        this.listado = res.content as T[];
        this.blnAccion = false;
      },
      error: (err) => {
        console.error(err)
        this.messageService.add({severity: 'error', summary: this.mensaje.tituloError, detail: this.mensaje.mensajeErrorLectura});
        this.blnAccion = false;
      }
    });
  }

  listarPorCambios(event: LazyLoadEvent, rows: number, page: number){
    this.blnAccion = true;
    this.commonService.getAllPage(event, event.sortField?event.sortField:'id', event.sortOrder?event.sortOrder:0, rows, page).subscribe({
      next: (res) => {
        this.totalRegistros = res.totalElements;
        this.listado = res.content as T[];
        this.blnAccion = false;
      },
      error: (err) => {
        console.error(err)
        this.messageService.add({severity: 'error', summary: this.mensaje.tituloError, detail: this.mensaje.mensajeErrorLectura});
        this.blnAccion = false;
      }
    });
  }

  seleccionar(t: T): void {
    this.blnFront = true;
    this.itemSeleccionado = t;
  }

  agregar(): void {
    this.blnFront = true;
    this.itemSeleccionado = JSON.parse(JSON.stringify(this.item));
    this.listado.unshift(this.itemSeleccionado);
  }

  cancelar(): void {
    if((this.itemSeleccionado as any).id == undefined) this.listado.shift();
    this.blnFront = false;
    this.itemSeleccionado = null;
    this.listar(this.currentEvent);
  }

  guardar(): void {
    if (this.validaCompleto()) {
      this.blnAccion = true;
      !(this.itemSeleccionado as any).id?this.crear():this.actualizar();
    }
  }

  valida(): boolean {
    let atributos: string[] = [];
    for (let k in this.itemSeleccionado) atributos.push(k);
    let valida: boolean = true;

    for (let o of this.obligatorios) {
        if (!atributos.includes(o)) {
          this.messageService.add({severity: 'warn', summary: this.mensaje.tituloFaltanDatos, detail: `Debe ingresar el campo ${o}`});
          valida = false;
          break;
        } else {
          if (typeof this.itemSeleccionado[o] == 'string') {
            if ((this.itemSeleccionado[o] as string).trim().length == 0) {
              this.messageService.add({severity: 'warn', summary: this.mensaje.tituloFaltanDatos, detail: `El campo ${o} no puede estar vacío`});
              valida = false;
              break;
            }
          } else if (typeof this.itemSeleccionado[o] == 'number') {
            if (this.itemSeleccionado[o] == null || this.itemSeleccionado[o] == undefined) {
              this.messageService.add({severity: 'warn', summary: this.mensaje.tituloFaltanDatos, detail: `El campo ${o} no puede estar vacío`});
              valida = false;
              break;
            }
          } else if (typeof this.itemSeleccionado[o] == 'object') {
            if (this.itemSeleccionado[o] == null || this.itemSeleccionado[o] == undefined) {
              this.messageService.add({severity: 'warn', summary: this.mensaje.tituloFaltanDatos, detail: `El campo ${o} no puede estar vacío`});
              valida = false;
              break;
            }
          }
          //TO DO: validacion tipo date
        }
     }

    return valida;
  }

  validaCompleto(): boolean {
      return this.valida();
  }

  crear(): void {
    this.commonService.create(this.itemSeleccionado, null).subscribe({
      next: (res) => {
        this.messageService.add({severity: 'success', summary: this.mensaje.tituloSuccess, detail: this.mensaje.mensajeGuardadoSuccess});
        this.blnFront = false;
        this.listar(this.currentEvent);
        this.itemSeleccionado = null;
      },
      error: (err) => {
        console.error(err);
        if(err.status == 409) {
          this.messageService.add({severity: 'warn', summary: this.mensaje.tituloError, detail: err.error.mensaje});
        } else {
          this.messageService.add({severity: 'error', summary: this.mensaje.tituloError, detail: this.mensaje.mensajeErrorCreacion});
        }
        this.blnAccion = false;
      }
    });
  }

  actualizar(): void {
    this.commonService.update(this.itemSeleccionado, null).subscribe({
      next: (res) => {
        this.messageService.add({severity: 'success', summary: this.mensaje.tituloSuccess, detail: this.mensaje.mensajeActualizadoSuccess});
        this.blnFront = false;
        this.listar(this.currentEvent);
        this.itemSeleccionado = null;
      },
      error: (err) => {
        if(err.status == 409) {
          this.messageService.add({severity: 'warn', summary: this.mensaje.tituloWarning, detail: err.error.mensaje});
        } else {
          this.messageService.add({severity: 'error', summary: this.mensaje.tituloError, detail: this.mensaje.mensajeErrorActualizacion});
        }

        this.blnAccion = false;
      }
    });
  }
}
