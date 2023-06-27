import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { AuthGuard } from './security/guards/auth.guard';
import { DemoComponent } from './demo/demo.component';
import { LoginComponent } from './security/login/login.component';
import { ContactoListadoComponent } from './contacto/contacto-listado/contacto-listado.component';
import { IngresarPasswordComponent } from './security/ingresar-password/ingresar-password.component';
import { PerfilUsuarioComponent } from './security/usuario/perfil-usuario/perfil-usuario.component';
import { UsuarioListadoComponent } from './security/usuario/usuario-listado/usuario-listado.component';
import { DashboardDepartamentosComponent } from './dashboard/dashboard-departamentos/dashboard-departamentos.component';
import { ViajeListadoComponent } from './viajes/viaje-listado/viaje-listado.component';
import { ViajeDetalleComponent } from './viajes/viaje-detalle/viaje-detalle.component';

const empresa: string = environment.empresa;
const routes: Routes = [
  { path: 'demo', component: DemoComponent, title: `${empresa} | DEMO`, data: { menu: 'DEMO' } },
  { path: 'login', component: LoginComponent, title: `${empresa} | LOGIN`, data: { menu: '' } },
  { path: 'reset-password/:modo/:token', component: IngresarPasswordComponent, title: `${empresa} | CAMBIAR CONTRASEÑA`, data: { menu: 'SEGURIDAD | CAMBIAR CONTRASEÑA' } },
  { path: 'seguridad/mi-perfil', component: PerfilUsuarioComponent, title: `${empresa} | SEGURIDAD | MI PERFIL`, data: { role: ['ROLE_TI'], menu: 'SEGURIDAD | MI PERFIL' } },
  { path: 'usuario/listado', component: UsuarioListadoComponent, title: `${empresa} | SEGURIDAD | CONSULTA DE USUARIOS`, data: { role: ['ROLE_TI'], menu: 'SEGURIDAD | CONSULTA DE USUARIOS' } },
  { path: 'contacto/listado', component: ContactoListadoComponent, title: `${empresa} | CONTACTOS | CONSULTA DE CONTACTOS`, data: { role: ['sROLE_TI'], menu: 'CONTACTOS | CONSULTA DE CONTACTOS' } },

  { path: 'dashboard/departamentos', component: DashboardDepartamentosComponent, title: `${empresa} | DASHBOARD | DASHBOARD KPIs`, data: { role: ['sROLE_TI'], menu: 'DASHBOARD | DASHBOARD KPIs' } },

  { path: 'viaje/listado', component: ViajeListadoComponent, title: `TOURIST PATH | VIAJES | CONSULTA DE VIAJES`, data: { role: ['ROLE_TI'], menu: 'TOURIST PATH' } },
  { path: 'viaje/detalle', component: ViajeDetalleComponent, title: `TOURIST PATH | VIAJES | DETALLE DEL VIAJE`, data: { role: ['ROLE_TI'], menu: 'TOURIST PATH' } },

  { path: '**', redirectTo: 'dashboard/departamentos', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }