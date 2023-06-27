import { LOCALE_ID, NgModule } from '@angular/core';
import { DatePipe, registerLocaleData } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import localeES from '@angular/common/locales/es';

import { AppRoutingModule } from './app-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ImageModule } from 'primeng/image';
import { BadgeModule } from 'primeng/badge';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { FieldsetModule } from 'primeng/fieldset';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { GalleriaModule } from 'primeng/galleria';
import { ToastModule } from 'primeng/toast';
import { KeyFilterModule } from 'primeng/keyfilter';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { ChartModule } from 'primeng/chart';
import { CarouselModule } from 'primeng/carousel';

import { AuthImagePipe } from './common/pipes/authImage.pipe';
import { TokenInterceptor } from './security/interceptors/token.interceptor';
import { AuthInterceptor } from './security/interceptors/auth.interceptor';
import { UserInterceptor } from './security/interceptors/user.interceptor';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MenuLateralComponent } from './menu-lateral/menu-lateral.component';
import { DemoComponent } from './demo/demo.component';
import { ModalDemoComponent } from './demo/modal-demo/modal-demo.component';
import { LoginComponent } from './security/login/login.component';
import { TablaAuxiliarComponent } from './configuracion/tabla-auxiliar/tabla-auxiliar.component';
import { ModalObservacionesComponent } from './common/modales/modal-observaciones/modal-observaciones.component';
import { ModalArchivosComponent } from './common/modales/modal-archivos/modal-archivos.component';
import { IniciarSesionComponent } from './security/login/iniciar-sesion/iniciar-sesion.component';
import { RecuperarUsuarioComponent } from './security/login/recuperar-usuario/recuperar-usuario.component';
import { IngresarPasswordComponent } from './security/ingresar-password/ingresar-password.component';
import { PerfilUsuarioComponent } from './security/usuario/perfil-usuario/perfil-usuario.component';
import { UsuarioListadoComponent } from './security/usuario/usuario-listado/usuario-listado.component';
import { ModalSiNoComponent } from './common/modales/modal-si-no/modal-si-no.component';
import { UsuarioModalRolesComponent } from './security/usuario/usuario-listado/usuario-modal-roles/usuario-modal-roles.component';
import { NotificacionComponent } from './notificacion/notificacion.component';
import { DashboardDepartamentosComponent } from './dashboard/dashboard-departamentos/dashboard-departamentos.component';
import { DashboardDepartamentosDerechaComponent } from './dashboard/dashboard-departamentos/dashboard-departamentos-derecha/dashboard-departamentos-derecha.component';
import { DashboardDepartamentosIzquierdaComponent } from './dashboard/dashboard-departamentos/dashboard-departamentos-izquierda/dashboard-departamentos-izquierda.component';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ModalEnviarCorreoComponent } from './correo/modal-enviar-correo/modal-enviar-correo.component';
import { ViajeListadoComponent } from './viajes/viaje-listado/viaje-listado.component';
import { ViajeDetalleComponent } from './viajes/viaje-detalle/viaje-detalle.component';


registerLocaleData(localeES, 'es-Pe');

@NgModule({
  declarations: [
    AppComponent,
    AuthImagePipe,
    HeaderComponent,
    MenuLateralComponent,
    DemoComponent,
    ModalDemoComponent,
    LoginComponent,
    TablaAuxiliarComponent,
    ModalObservacionesComponent,
    ModalArchivosComponent,
    IniciarSesionComponent,
    RecuperarUsuarioComponent,
    IngresarPasswordComponent,
    PerfilUsuarioComponent,
    UsuarioListadoComponent,
    ModalSiNoComponent,
    UsuarioModalRolesComponent,
    NotificacionComponent,
    DashboardDepartamentosComponent,
    DashboardDepartamentosDerechaComponent,
    DashboardDepartamentosIzquierdaComponent,
    ModalEnviarCorreoComponent,
    ViajeListadoComponent,
    ViajeDetalleComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    BlockUIModule,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    AppRoutingModule,
    InputTextModule,
    PasswordModule,
    DropdownModule,
    AutoCompleteModule,
    MultiSelectModule,
    CalendarModule,
    InputTextareaModule,
    InputNumberModule,
    MenubarModule,
    TieredMenuModule,
    PanelMenuModule,
    SidebarModule,
    MenuModule,
    SplitButtonModule,
    CheckboxModule,
    RadioButtonModule,
    InputMaskModule,
    InputSwitchModule,
    ImageModule,
    BadgeModule,
    TableModule,
    AccordionModule,
    FieldsetModule,
    OverlayPanelModule,
    GalleriaModule,
    ToastModule,
    KeyFilterModule,
    DynamicDialogModule,
    ChartModule,
    TabMenuModule,
    CarouselModule
  ],
  providers: [
    MessageService,
    DialogService,
    DatePipe,
    { provide: LOCALE_ID, useValue: 'es-Pe' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UserInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
