import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { CargarUsuarios } from '../interfaces/cargar-usuarios.interface';

import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor(private http: HttpClient,
    private router: Router,
    private ngZone: NgZone) {

    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return { headers: { 'x-token': this.token } };
  }

  googleInit() {

    return new Promise(resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          // client_id: '214850903693-a0gp2ue6laalfqqc7qt09rj06eeka38q.apps.googleusercontent.com',
          client_id: environment.googleClientID,
          cookiepolicy: 'single_host_origin',
        });

        resolve();
      });
    })

  }

  logout() {
    localStorage.removeItem('token');

    this.auth2.signOut().then(() => {

      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
    });

  }

  validarToken(): Observable<boolean> {
    // const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        const { nombre, apellidos, email, google, img = '', rol, uid } = resp.usuario;
        this.usuario = new Usuario(nombre, apellidos, email, '', img, google, rol, uid);

        localStorage.setItem('token', resp.token);
        return true;
        // console.log(this.usuario);
      }),
      catchError(error => of(false))
    );

  }


  crearUsuario(formData: RegisterForm) {

    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      )

  }

  actualizarPerfil(data: { email: string, nombre: string, rol: string }) {

    data = {
      ...data,
      rol: this.usuario.rol
    }

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, {
      headers: {
        'x-token': this.token
      }
    });
  }

  modificarUsr(usr: Usuario) {

    return this.http.put(`${base_url}/usuarios/${usr.uid}`, usr, this.headers);
  }

  login(formData: LoginForm) {

    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      );

  }

  loginGoogle(token) {

    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      );

  }

  obtenerUsuarios(desde: number = 0) {

    //localhost:3015/api/usuarios?desde=1
    const URL = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuarios>(URL, this.headers)
      .pipe(
        map(resp => {
          const users = resp.usuarios.map(
            user => new Usuario(user.nombre, user.apellidos, user.email, '', user.img, user.google, user.rol, user.uid)
          );

          return {
            total: resp.total,
            usuarios: users
          };
        })
      );
  }

  eliminarUsuario(usuario: Usuario) {

    //localhost:3015/api/usuarios/5f2d0f7ea5920b4b088d095d
    const url = `${base_url}/usuarios/${usuario.uid}`
    return this.http.delete(url, this.headers);

  }

}
