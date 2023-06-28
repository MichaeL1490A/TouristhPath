import { Injectable } from '@angular/core';
import { Usuario } from './models/usuario';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private urlEndPoint: string = environment.apiURL + 'api/usuarios';

  private _usuario: Usuario;
  private _modulos: any[];
  private _token: string;

  blnGerente: boolean = false;
  blnSoporte: boolean = false;
  blnAdmin: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && localStorage.getItem("usuario") != null) {
      this._usuario = JSON.parse(localStorage.getItem("usuario")) as Usuario;
      return this._usuario;
    } else {
      return new Usuario();
    }
  }

  public get modulos(): any[] {
    if (this._modulos != null) {
      return this._modulos;
    } else if (this._modulos == null && localStorage.getItem("modulos") != null) {
      this._modulos = JSON.parse(localStorage.getItem("modulos")) as any[];
      return this._modulos;
    } else {
      return [];
    }
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && localStorage.getItem("token") != null) {
      this._token = localStorage.getItem("token");
      return this._token;
    } else {
      return null;
    }
  }

  login(usuario: Usuario, rememberMe: boolean): Observable<any> {
    const urlEndPoint = environment.apiURL + 'api/seguridad/oauth/token';
    let credenciales: any

    if(rememberMe){
      credenciales = window.btoa('angularapp' + ':' + '12345');
    }
    else {
      credenciales = window.btoa('frontendapp' + ':' + '12345');
    }
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8', 'Authorization': 'Basic ' + credenciales });

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    return this.http.post<any>(urlEndPoint, params.toString(), { headers: httpHeaders });
  }

  logout() {
    this._token = null;
    this._usuario = null;
    this._modulos = null;
    localStorage.clear();
  }

  guardarUsuario(accessToken: string) {
    let payload = this.obtenerDatosToken(accessToken);
    
    this._usuario = new Usuario();
    this._usuario.id = payload.id;
    this._usuario.personalId = payload.personalId;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;

    this._usuario.rolesAuthorities = payload.authorities;

    this._usuario.roles = payload.roles;
    this.guardarUsuarioLocalStorage();
  }

  guardarUsuarioLocalStorage() {
    localStorage.setItem("usuario", JSON.stringify(this._usuario));
  }

  guardarModulos(modulos: any[]): void {
    this._modulos = modulos;
    localStorage.setItem("modulos", JSON.stringify(this._modulos));
  }

  guardarToken(accessToken: string) {
    this._token = accessToken;
    localStorage.setItem("token", this._token);
  }

  obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(window.atob(accessToken.split(".")[1]));
    } else {
      return null;
    }
  }

  isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this.token);

    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }

    return false;
  }

  hasRole(role: string): boolean {
    if (this.usuario.rolesAuthorities.includes(role)) {
      return true;
    }
    return false;
  }

  isTokenExpirado(): boolean {
    let payload = this.obtenerDatosToken(this.token);
    let now = new Date().getTime()/1000;

    if (payload.exp < now) {
      return true;
    }

    return false;
  }

  comprobarToken(token: string): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/comprobar/${token}`).pipe(
      catchError(e => {
        if (e.status == 406) {
          this.router.navigate(['/login'])
        }
        return throwError(() => e);
      })
    );
  }

  setRoles(){
    if(this.usuario.rolesAuthorities.includes("ROLE_GERENTE")) {
      this.blnGerente = true;
    }
    if(this.usuario.rolesAuthorities.includes("ROLE_SOPORTE")) {
      this.blnSoporte = true;
    }
    if(this.usuario.rolesAuthorities.includes("ROLE_ADMIN")) {
      this.blnAdmin = true;
    } 
  }
}
