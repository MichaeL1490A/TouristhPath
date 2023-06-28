import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, forkJoin } from 'rxjs';
import { Personal } from '../models/personal';
import { PersonalService } from '../personal.service';
import { Mensajes } from '../../common/mensajes';
import { TablaAuxiliarDetalle } from '../../configuracion/models/tabla-auxiliar-detalle';
import { TablaAuxiliarService } from '../../configuracion/tabla-auxiliar/tabla-auxiliar.service';
import { PersonalPermiso } from '../models/personal-permiso';
import { FuncionesComunes } from '../../common/funciones-comunes';
import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/security/auth.service';
import { ModalEnviarCorreoComponent } from 'src/app/correo/modal-enviar-correo/modal-enviar-correo.component';

@Component({
  selector: 'app-personal-modal-detalle',
  templateUrl: './personal-modal-detalle.component.html',
  styleUrls: ['./personal-modal-detalle.component.css']
})
export class PersonalModalDetalleComponent implements OnInit {

  nuevoModal: DynamicDialogRef;
  f = FuncionesComunes;
  id: number = 0;
  personal: Personal = new Personal();

  listaTitulo: TablaAuxiliarDetalle[];
  listaArea: TablaAuxiliarDetalle[];
  listaCargo: TablaAuxiliarDetalle[];
  listaTipoPersonal: TablaAuxiliarDetalle[];
  listaTipoDocumento: TablaAuxiliarDetalle[];
  listaEstado: TablaAuxiliarDetalle[];
  listaMotivoPermiso: TablaAuxiliarDetalle[];
  listaFechasTicketsAsignados: any[];

  blnOcupado: boolean = false;

  fechaMinInicial: Date = new Date();
  constructor(
    private messageService: MessageService,
    private auxiliarService: TablaAuxiliarService,
    private personalService: PersonalService,
    public ref: DynamicDialogRef,
    public dialogService: DialogService,
    public config: DynamicDialogConfig,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.setRoles()
    this.blnOcupado = true;
    this.id = this.config.data.id | 0;

    let listasAuxiliares: Observable<any>[] = [];
    listasAuxiliares.push(
      this.auxiliarService.getListByCodigo('LISTIT'),
      this.auxiliarService.getListByCodigo('LISARE'),
      this.auxiliarService.getListByCodigo('LISCAR'),
      this.auxiliarService.getListByCodigo('TIPPER'),
      this.auxiliarService.getListByCodigo('TIPDID'),
      this.auxiliarService.getListByCodigo('ESTGRL'),
      this.auxiliarService.getListByCodigo('TIPDES')
    );
  
    this.getFechasTicketsAsignadosPersonal();
    forkJoin(listasAuxiliares).subscribe({
      next: (res) => {
        this.listaTitulo = res[0];
        this.listaArea = res[1];
        this.listaCargo = res[2];
        this.listaTipoPersonal = res[3];
        this.listaTipoDocumento = res[4];
        this.listaEstado = res[5];
        this.listaMotivoPermiso = res[6];

        if (this.id > 0 && this.id != null && this.id != undefined) {
          this.personalService.getById(this.id).subscribe({
            next: (per) => {
              this.personal = per;

              this.f.bindarAuxiliar(this.personal, 'titulo', this.listaTitulo);
              this.f.bindarAuxiliar(this.personal, 'area', this.listaArea);
              this.f.bindarAuxiliar(this.personal, 'cargo', this.listaCargo);
              this.f.bindarAuxiliar(this.personal, 'tipo', this.listaTipoPersonal);
              this.f.bindarAuxiliar(this.personal, 'tipoDocumento', this.listaTipoDocumento);
              this.f.bindarAuxiliar(this.personal, 'estado', this.listaEstado);

              this.personal.fotoAux = this.personal.foto
              this.personal.fotoUrl = this.personal.foto!=null ? (environment.apiURL + 'api/personal/file/descargar/' + this.personal.foto + '/1'): environment.imagenDefault
              this.personal.firmaAux = this.personal.firma
              this.personal.firmaUrl = this.personal.firma!=null ? (environment.apiURL + 'api/personal/file/descargar/' + this.personal.firma + '/2'): environment.imagenDefault

              this.personal.permisosAux = []
              this.personal.permisos.forEach(p => {
                this.f.bindarAuxiliar(p, 'motivo', this.listaMotivoPermiso);
                let permisoAux: PersonalPermiso = new PersonalPermiso()
                permisoAux.adjunto = p.adjunto
                permisoAux.id = p.id
                this.personal.permisosAux.push(permisoAux)
                p.fechaInicio = this.f.getFechaHoraFormateadaPrime(p.fechaInicio)
                p.fechaFin = this.f.getFechaHoraFormateadaPrime(p.fechaFin)
              });
              
              this.blnOcupado = false;
            },
            error: (err) => {
              this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} del personal.` });
            }
          });
        } else {
          this.personal.id = 0;
          this.personal.estado = this.listaEstado.find(e => e.tablaAuxiliarDetalleId.id == 1);
          this.blnOcupado = false;
        }
      },
      error: (err) => {
        if (err[0]) this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} de títulos.` });
        if (err[1]) this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} de áreas.` });
        if (err[2]) this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} de cargos.` });
        if (err[3]) this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} de tipos de personal.` });
        if (err[4]) this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} de tipos de documento de identidad.` });
        if (err[5]) this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} de estados.` });
        if (err[6]) this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} de motivos de descanso.` });
      }
    });
  }

  getFechasTicketsAsignadosPersonal(){
    let year = this.fechaMinInicial.getFullYear();
    let month = ("0" + (this.fechaMinInicial.getMonth() + 1)).slice(-2);
    let day = ("0" + this.fechaMinInicial.getDate()).slice(-2);
    let fechaFormateada = year + "-" + month + "-" + day;

    this.personalService.getFechasTicketsAsignadosPersonal(this.id, fechaFormateada).subscribe({
      next: (res) => {
        this.listaFechasTicketsAsignados = res;
        this.listaFechasTicketsAsignados.forEach(e => {
          e.fechaInicial = this.f.getFechaHoraFormateadaPrime(e.fechaInicial);
          e.fechaFinal = this.f.getFechaHoraFormateadaPrime(e.fechaFinal);
        })
      }
    })
  }

  agregarPermiso() {
    let permiso: PersonalPermiso = new PersonalPermiso();
    permiso.id = 0;
    this.personal.permisos.push(permiso);
  }

  quitarPermiso(i: number) {
    this.personal.permisos.splice(i, 1);
  }

  validar(): boolean {
    let fechasValidas: boolean = true
    this.personal.permisos.forEach(permiso=>{
      if(permiso.motivo == null || permiso.motivo == undefined){
        this.messageService.add({ 
          severity: 'warn', 
          summary: Mensajes.tituloDatosErroneos,
          detail: `Debe ingresar el motivo del permiso.`});
        fechasValidas = false
      }

      if(!(permiso.fechaInicio < permiso.fechaFin)){
        this.messageService.add({ 
          severity: 'warn', 
          summary: Mensajes.tituloDatosErroneos,
          detail: `Las horas de inicio y fin de los permisos no son correctas.`});
        fechasValidas = false
      }
    })
    if(fechasValidas && this.seInterseca()){
      this.messageService.add({ 
        severity: 'warn', 
        summary: Mensajes.tituloDatosErroneos,
        detail: `Los intervalos de tiempo de los permison se cruzan entre sí.`});
      fechasValidas = false
    }

    let x = this.validarPermisosTicketsAsignados() 
    let per, num;
    if(x != '-1'){
      per = x.substring(0, x.indexOf('-'))
      num = x.substring(x.indexOf('-')+1, x.length)
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Permiso no valido',
        detail: `El permiso ${Number(per)+1} se cruza con el ticket ${num} asignado al personal.`});
      fechasValidas = false
    }

    return fechasValidas && this.f.valida([
      { 'tipo': 'string', 'nombre': 'el apellido paterno', 'valor': this.personal.apellidoPaterno },
      { 'tipo': 'string', 'nombre': 'el apellido materno', 'valor': this.personal.apellidoMaterno },
      { 'tipo': 'string', 'nombre': 'el nombre', 'valor': this.personal.nombres }
    ], this.messageService);

  }

  seInterseca(): boolean {
    for(let i:number = 0; i<this.personal.permisos.length; i++){
      for(let j:number = i+1; j<this.personal.permisos.length; j++){
        if(this.personal.permisos[i].fechaFin>this.personal.permisos[j].fechaInicio && this.personal.permisos[i].fechaInicio<this.personal.permisos[j].fechaFin)
          return true
      }
    }
    return false
  }

  guardar() {
    // this.validar()
    // return
    if (this.validar()) {
      this.blnOcupado = true;
      this.cargarArchivos()
//    if (this.personal.foto?.length > 0) this.personal.foto = this.personal.foto.replace(environment.imagenDefault, '');
//    if (this.personal.firma?.length > 0) this.personal.firma = this.personal.firma.replace(environment.imagenDefault, '');
      if (this.personal.tipoFirma) {
        this.personal.tipoFirma = String(this.personal.tipoFirma)=='1'?true:false; 
      }
      if (this.personal.permisos?.length > 0) {
        this.personal.permisos = this.personal.permisos.filter(p => p.motivo?.tablaAuxiliarDetalleId?.id > 0 && p.fechaInicio && p.fechaFin);
      }
      let vPermiso: boolean = true;
      if (this.personal.permisos?.length > 0) {
        this.personal.permisos.forEach((p, i) => {
          if (p.fechaFin < p.fechaInicio) {
            this.messageService.add({severity: 'warn', summary: Mensajes.tituloDatosErroneos, detail: `Fila ${i + 1}: La fecha fin del permiso no puede ser menor a la fecha inicio.`});
            vPermiso = false;
          }
        })
      }
      if (vPermiso) {
        (this.id == 0)?this.crear():this.actualizar();
      }
    }
  }

  crear() {
    this.personal.idUsuarioCrea = this.authService.usuario.id; 
    this.personalService.create(this.personal).subscribe({
      next: (res) => {
        this.messageService.add({severity: 'success', summary: Mensajes.tituloSuccess, detail: Mensajes.mensajeGuardadoSuccess});
        this.ref.close({listar: 1});
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({severity: 'error', summary: Mensajes.tituloError, detail: Mensajes.mensajeErrorCreacion});
        this.blnOcupado = false;
      }
    });
  }

  actualizar() {
    this.personal.idUsuarioModifica = this.authService.usuario.id; 
    this.personalService.update(this.personal).subscribe({
      next: (res) => {
        this.messageService.add({severity: 'success', summary: Mensajes.tituloSuccess, detail: Mensajes.mensajeActualizadoSuccess});
        this.ref.close({listar: 1});
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({severity: 'error', summary: Mensajes.tituloError, detail: Mensajes.mensajeErrorCreacion});
        this.blnOcupado = false;
      }
    });
  }

  cargarArchivos(){
    let res1 = this.f.prepararArchivos(this.personal, ['foto'], 1)
    let res2 = this.f.prepararArchivos(this.personal, ['firma'], 2, res1.listaArchivos, res1.listaAcciones)
    let res3 = this.f.prepararArchivosArrayCompare(this.personal.permisosAux, this.personal.permisos, ['adjunto'], 3, res2.listaArchivos, res2.listaAcciones)
    this.personalService.actualizarArchivos(res3.listaArchivos, res3.listaAcciones).subscribe({
      next: (res)=>{

      },
      error: (err)=>{

      }
    })
  }

  cerrarModal() {
    this.ref.close();
  }

  cargarFoto(event:any){   
    if(event?.target?.files?.length > 0){
      this.personal.fotoFile = event.target.files[0];
      this.personal.foto = this.personal.fotoFile.name;
      let reader = new FileReader();
      reader.readAsDataURL(this.personal.fotoFile);
      reader.onloadend = () => {this.personal.fotoUrl = reader.result as string;};
    } else{
      this.personal.fotoFile = null;
      this.personal.foto = '';
      this.personal.fotoUrl = environment.imagenDefault;
    }
  }

  quitarFoto() {
    this.personal.fotoFile = null;
    this.personal.fotoUrl = environment.imagenDefault;
    this.personal.foto = null;
  }

  cargarFirma(event:any){   
    if(event?.target?.files?.length > 0){
      this.personal.firmaFile = event.target.files[0];
      this.personal.firma = this.personal.firmaFile.name;
      let reader = new FileReader();
      reader.readAsDataURL(this.personal.firmaFile);
      reader.onloadend = () => this.personal.firmaUrl = reader.result as string;
    } else{
      this.personal.firmaFile = null;
      this.personal.firma = '';
      this.personal.firmaUrl = environment.imagenDefault;
    }
  }

  quitarFirma() {
    this.personal.firmaFile = null;
    this.personal.firmaUrl = environment.imagenDefault;
    this.personal.firma = null;
  }

  descargarAdjuntoPermiso(i: number){
    if(this.personal.permisos[i].adjunto == '' || this.personal.permisos[i].adjunto == null
    || this.personal.permisos[i].adjunto == undefined){
      this.messageService.add({severity: 'warn', summary: `${Mensajes.tituloWarning}`, detail:`No hay archivo para descargar`});
      return;
    }

  if(this.personal.permisos[i].adjuntoFile != null || this.personal.permisos[i].adjuntoFile != undefined){
    FuncionesComunes.descargarArchivo(this.personal.permisos[i].adjunto, this.personal.permisos[i].adjuntoFile);
    return;
  }

  let variables: any = {archivo: this.personal.permisos[i].adjunto, numeroRuta: 3}

  this.personalService.descargarArchivo(variables).subscribe({
    next: (res) => { 
      FuncionesComunes.descargarArchivoBlob(res)
      //var blobURL = URL.createObjectURL(res?.body); // Crea la URL de objeto
      //window.open(blobURL); // Abre la URL en una nueva pestaña
    },
    error: (err) => {
      this.messageService.add({severity: 'error', summary: Mensajes.tituloError, detail: `Error al querer descargar el archivo.`});
    }
  });
  }

  abrirExploradorPermisos(id: string){
    document.getElementById(id).click()
  }

  cargarAdjuntoPermiso(event: any, i: number){
    if(event?.target?.files?.length > 0){
      this.personal.permisos[i].adjuntoFile = event.target.files[0];
      this.personal.permisos[i].adjunto = event.target.files[0].name;
    }
  }

  eliminarAdjuntoPermiso(i: number){
    this.personal.permisos[i].adjunto = null;
    this.personal.permisos[i].adjuntoFile = null;
  }


  enviarMensaje(){
    let correos = '';
    if(this.personal.correo1 != null && this.personal.correo1 != undefined && this.personal.correo1.trim() != '')
      correos = this.personal.correo1+',';
    if(this.personal.correo2 != null && this.personal.correo2 != undefined && this.personal.correo2.trim() != '')
      correos = correos + this.personal.correo2;
    this.nuevoModal = this.dialogService.open(ModalEnviarCorreoComponent,{
      draggable: true,
      data: {
        relacionados: `{"tipo":"mensaje-personal", "personalId":${this.personal.id}}`,
        correos: correos
      },
      header: 'Nuevo mensaje',
      width: '700px'
    });
  }

  validarPermisosTicketsAsignados(): string {
    for(let i:number = 0; i<this.personal.permisos.length; i++){
      for(let j:number = i+1; j<this.listaFechasTicketsAsignados.length; j++){
        if(this.personal.permisos[i].fechaFin>this.listaFechasTicketsAsignados[j].fechaInicial && this.personal.permisos[i].fechaInicio<this.listaFechasTicketsAsignados[j].fechaFinal){
          return i + '-' + this.listaFechasTicketsAsignados[j].numeroTicket
        }          
      }
    }
    return '-1'
  }
}
