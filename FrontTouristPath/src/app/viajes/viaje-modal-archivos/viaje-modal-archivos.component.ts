import { Component } from '@angular/core';
import { ViajeArchivo } from '../models/viaje-archivo';
import { Viaje } from '../models/viaje';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { Mensajes } from 'src/app/common/mensajes';

@Component({
  selector: 'app-viaje-modal-archivos',
  templateUrl: './viaje-modal-archivos.component.html',
  styleUrls: ['./viaje-modal-archivos.component.css']
})
export class ViajeModalArchivosComponent {

  listaArchivos: any[] = [];

  constructor(
    private ref: DynamicDialogRef,
    private messageService: MessageService,
  ){}

  ngOnInit(){

  }

  agregarArchivo(){
    let nuevoArchivo: ViajeArchivo = new ViajeArchivo();
    nuevoArchivo.id = 0;
    this.listaArchivos.push(nuevoArchivo);
  }

  eliminarArchivo(i: number){
    this.listaArchivos.splice(i,1);
  }

  guardar(){
    
  }


  abrirExploradorArchivos(input: HTMLInputElement){
    input.click();
  }

  cargarArchivo(event: any, i: number){
    let archivo: File = event.target.files[0];

    if(!archivo) {return}

    if(archivo.size > environment.sizeFile){
      this.messageService.add({severity: 'warn', summary: `${Mensajes.tituloWarning}`, detail: `No se puede cargar archivos tan pesados`})
      archivo = null;
      return;
    }

    this.listaArchivos[i].archivo = archivo;
    this.listaArchivos[i].nombre = archivo.name;
  }

  descargarArchivo(i: number){
    let variables: any = {};
    variables.archivo = this.listaArchivos[i].adjunto;
    variables.numeroRuta = 2;

    if(this.listaArchivos[i].adjunto == null || this.listaArchivos[i].adjunto == undefined || this.listaArchivos[i].adjunto == ''){
      this.messageService.add({severity:'warn', summary:`${Mensajes.tituloWarning}`, detail: `No existe archivo para descargar`})
      return;
    }

    if(this.listaArchivos[i].adjuntoFile){
//        this.listaArchivos[i].adjuntoFile);
      return
    }

//    this.ticketService.descargarArchivo(variables).subscribe({
 //     next: (res) => { 
//        FuncionesComunes.descargarArchivoBlob(res)
//      },
//      error: (err) => {
//        this.messageService.add({severity: 'error', summary: Mensajes.tituloError, detail: `Error al querer descargar el archivo.`});
//      }
//   });
  }



  cerrarModal() {
    this.ref.close();
  }

}
