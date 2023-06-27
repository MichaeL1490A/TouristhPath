import { Component } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FuncionesComunes } from '../../funciones-comunes';
import { Mensajes } from '../../mensajes';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-modal-archivos',
  templateUrl: './modal-archivos.component.html',
  styleUrls: ['./modal-archivos.component.css']
})
export class ModalArchivosComponent {

  //BINDADO
  variables: any = {};
  nombre: string;
  accion: number = 0;

  //CARGAR ARCHIVO
  archivo: File;

  //SERVICE
  service: any;
  desactivar: boolean = false
  constructor(
    private config: DynamicDialogConfig,
    private messageService: MessageService,
    private ref: DynamicDialogRef
  ){}

  ngOnInit(){
    this.variables = this.config.data.variables;

    if(this.config.data?.disable){
      this.desactivar = true;
    }

    this.nombre = this.variables.archivo;
    this.service = this.variables.service;
    this.archivo = this.variables.file;
  }


  selectFile(input: HTMLInputElement): void {
    input.click();
  }

  cargarArchivo(event){
    this.archivo = event.target.files[0]

    if(!this.archivo) {return}

    if(this.archivo.size > environment.sizeFile){
      this.messageService.add({severity: 'warn', summary: `${Mensajes.tituloWarning}`, detail: `No se puede cargar archivos tan pesados`})
      this.archivo = null;
      return;
    }

    this.nombre = this.archivo.name;
    this.accion = 1;
  }

/*  agregarArchivo(){
    if(this.archivoTemp?.size > (104857600 - 10)){
      let mensajeWarning = "No se puede guardar archivos muy pesados.";
      this.messageService.add({severity: 'warn', summary: Mensajes.tituloFaltanDatos, detail: mensajeWarning});
      return ;
    }
    
    if(this.archivoTemp != null){
      this.blnGuardando = true;
      this.mensajeCarga = "Guardando archivo.";
      this.archivoFormularios.crearArchivo(this.atencionId, this.archivoTemp).subscribe({
        next: (res) => {
          if (res.type === HttpEventType.Response) {          
            this.archivos.push(res.body.archivo);
            this.cargarArchivo(null);
            this.messageService.add({severity: 'success', summary: Mensajes.tituloSuccess, detail: `${Mensajes.mensajeGuardadoSuccess}.`});
          }
        },
        error: (err) => {
          this.messageService.add({severity: 'error', summary: Mensajes.tituloError, detail: `Error al querer crear el archivo.`});
        }
      }).add(() => {
        this.blnGuardando = false;
      });
    }
  }
*/



  descargarArchivo(){
    if(this.archivo){
      FuncionesComunes.descargarArchivo(this.archivo.name, this.archivo);
      return
    }
    else if(this.nombre != null && this.nombre != undefined){
      this.service.descargarArchivo(this.variables).subscribe({
        next: (res) => {
          FuncionesComunes.descargarArchivoBlob(res);
        }
      })
    }
  }

  eliminarArchivo(){
    this.archivo = null;
    this.nombre = null;
    this.accion = 1;
  }

  guardarArchivo(){
    this.ref.close({archivo: this.archivo, nombreArchivo: this.nombre, accion: this.accion});
  }
}
