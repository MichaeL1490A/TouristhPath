import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, forkJoin } from 'rxjs';
import { AuthService } from '../../auth.service';
import { Personal } from '../../../personal/models/personal';
import { TablaAuxiliarService } from '../../../configuracion/tabla-auxiliar/tabla-auxiliar.service';
import { TablaAuxiliarDetalle } from '../../../configuracion/models/tabla-auxiliar-detalle';
import { PersonalService } from '../../../personal/personal.service';
import { Mensajes } from '../../../common/mensajes';
import { FuncionesComunes } from '../../../common/funciones-comunes';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {

  f = FuncionesComunes;

  personal: Personal = new Personal();
  listaTipoDocumento: TablaAuxiliarDetalle[];
  listaTitulo: TablaAuxiliarDetalle[];

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private auxiliarService: TablaAuxiliarService,
    private personalService: PersonalService
  ) { }

  ngOnInit() {
    let listasAuxiliares: Observable<any>[] = [];
    listasAuxiliares.push(
      this.auxiliarService.getListByCodigo('LISTIT'),
      this.auxiliarService.getListByCodigo('TIPDID')
    );

    forkJoin(listasAuxiliares).subscribe({
      next: (res) => {
        this.listaTitulo = res[0];
        this.listaTipoDocumento = res[1];

        this.personalService.getById(this.authService.usuario.personalId).subscribe({
          next: (per) => {
            this.personal = per;
            this.f.bindarAuxiliar(this.personal, 'titulo', this.listaTitulo);
            this.f.bindarAuxiliar(this.personal, 'tipoDocumento', this.listaTipoDocumento);
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} del personal.` });
          }
        });
      },
      error: (err) => {
        if (err[0]) this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} de títulos.` });
        if (err[1]) this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: `${Mensajes.mensajeErrorLectura} de tipos de documento de identidad.` });
      }
    });
  }

  actualizar() {

    if (this.validar())
      this.personalService.update(this.personal).subscribe({
        next: (res) => {
          this.messageService.add({ severity: 'success', summary: Mensajes.tituloSuccess, detail: Mensajes.mensajeActualizadoSuccess });
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({ severity: 'error', summary: Mensajes.tituloError, detail: Mensajes.mensajeErrorCreacion });
        }
      });
  }

  validar(): boolean {
    return this.f.valida([
      { 'tipo': 'string', 'nombre': 'el apellido paterno', 'valor': this.personal.apellidoPaterno },
      { 'tipo': 'string', 'nombre': 'el apellido materno', 'valor': this.personal.apellidoMaterno },
      { 'tipo': 'string', 'nombre': 'el nombre', 'valor': this.personal.nombres }
    ], this.messageService);
  }
}
