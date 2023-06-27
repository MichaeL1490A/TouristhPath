import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { AuthGuard } from './security/guards/auth.guard';
import { DemoComponent } from './demo/demo.component';
import { LoginComponent } from './security/login/login.component';
import { IngresarPasswordComponent } from './security/ingresar-password/ingresar-password.component';
import { PerfilUsuarioComponent } from './security/usuario/perfil-usuario/perfil-usuario.component';
import { UsuarioListadoComponent } from './security/usuario/usuario-listado/usuario-listado.component';
import { DashboardDepartamentosComponent } from './dashboard/dashboard-departamentos/dashboard-departamentos.component';
import { ViajeListadoComponent } from './viajes/viaje-listado/viaje-listado.component';
import { ViajeDetalleComponent } from './viajes/viaje-detalle/viaje-detalle.component';
import { PantallaPrincipalComponent } from './pantalla-principal/pantalla-principal.component';

const empresa: string = environment.empresa;
const routes: Routes = [
  { path: 'demo', component: DemoComponent, title: `${empresa} | DEMO`, data: { menu: 'DEMO' } },
  { path: 'login', component: LoginComponent, title: `${empresa} | LOGIN`, data: { menu: '' } },
  { path: 'reset-password/:modo/:token', component: IngresarPasswordComponent, canActivate: [AuthGuard], title: `${empresa} | CAMBIAR CONTRASEÑA`, data: { menu: 'SEGURIDAD | CAMBIAR CONTRASEÑA' } },
  { path: 'seguridad/mi-perfil', component: PerfilUsuarioComponent, canActivate: [AuthGuard], title: `${empresa} | SEGURIDAD | MI PERFIL`, data: { role: ['ROLE_TI'], menu: 'SEGURIDAD | MI PERFIL' } },
  { path: 'usuario/listado', component: UsuarioListadoComponent, canActivate: [AuthGuard], title: `${empresa} | SEGURIDAD | CONSULTA DE USUARIOS`, data: { role: ['ROLE_TI'], menu: 'SEGURIDAD | CONSULTA DE USUARIOS' } },

  { path: 'dashboard/departamentos', component: DashboardDepartamentosComponent, canActivate: [AuthGuard], title: `${empresa} | DASHBOARD | DASHBOARD KPIs`, data: { role: ['sROLE_TI'], menu: 'DASHBOARD | DASHBOARD KPIs' } },
  { path: 'pantalla/principal', component: PantallaPrincipalComponent, canActivate: [AuthGuard], title: `${empresa} | DASHBOARD | DASHBOARD KPIs`, data: { role: ['sROLE_TI'], menu: 'DASHBOARD | DASHBOARD KPIs' } },

  { path: 'viaje/listado', component: ViajeListadoComponent, canActivate: [AuthGuard], title: `TOURIST PATH | VIAJES | CONSULTA DE VIAJES`, data: { role: ['ROLE_TI'], menu: 'TOURIST PATH' } },
  { path: 'viaje/detalle', component: ViajeDetalleComponent, canActivate: [AuthGuard], title: `TOURIST PATH | VIAJES | DETALLE DEL VIAJE`, data: { role: ['ROLE_TI'], menu: 'TOURIST PATH' } },

  { path: '**', redirectTo: 'pantalla/principal', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }