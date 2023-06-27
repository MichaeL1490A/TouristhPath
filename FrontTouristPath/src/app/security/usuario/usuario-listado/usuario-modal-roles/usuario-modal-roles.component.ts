import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Mensajes } from 'src/app/common/mensajes';
import { Role } from 'src/app/security/models/role';
import { RoleService } from 'src/app/security/role.service';

@Component({
  selector: 'app-usuario-modal-roles',
  templateUrl: './usuario-modal-roles.component.html',
  styleUrls: ['./usuario-modal-roles.component.css']
})
export class UsuarioModalRolesComponent implements OnInit{

  listaRoles0: Role[] = [];
  listaRoles: Role[] = [];
  listadoSelected: Role;

  allRoles: Role[];
  rolOptions: Role[];
  rolSeleccionado: Role;

  constructor(
    protected messageService: MessageService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private roleService: RoleService
  ) { }

  ngOnInit(): void {

    this.listaRoles0 = (this.config.data.roles as Role[])

    this.roleService.getAllRoles().subscribe({
      next: (res) => {
        this.allRoles = res
        this.listaRoles = this.allRoles.filter(r => this.listaRoles0?.find(r2 => r2.id == r.id))
        //this.allRoles = res.filter(r => r.id != 3 && r.id != 4)
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: Mensajes.tituloError, detail: 'Error al obtener listado de roles.'});
      }
    })

  }

  quitarRol(id) {
    this.listaRoles = this.listaRoles.filter(r => r.id != id)
  }

  agregarRol() {
    if(this.listaRoles.includes(this.rolSeleccionado)) {
      this.messageService.add({severity: 'warn', summary: Mensajes.tituloWarning, detail: 'El rol seleccionado ya fue asignado.'});
    } else {
      this.listaRoles.push(this.rolSeleccionado);
    }

    this.rolSeleccionado=null;
  }

  filterRoles(event) {
    /* let term = event.query;

    this.roleService.getAutocompleteRoles(term).subscribe({
      next: (res) => {
        this.rolOptions = res;
      }
    }) */
    let filtered : any[] = [];
    let query = event.query;

    for(let i = 0; i < this.allRoles.length; i++) {
      let rol = this.allRoles[i];
      if (rol.nombreDetallado.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(rol);
      }
    }

    this.rolOptions = filtered;
  }

  cerrarModal() {
    this.ref.close();
  }

  guardar() {
    let rolesString = ""
    this.listaRoles.forEach((r: Role)=>{
      rolesString = rolesString + r.nombreDetallado + ', '
    })
    rolesString = rolesString.substring(0,rolesString.length-2)
    this.ref.close({roles: this.listaRoles, rolesString: rolesString});
  }

}
