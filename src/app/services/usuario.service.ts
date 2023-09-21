import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
declare const google: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public usuario!: Usuario;
  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get role(): string {
    return this.usuario.role || '';
  }
  get headers() {
    return { headers: { 'x-token': this.token } };
  }
  validarToken(): Observable<boolean> {
    return this.http
      .get(`${base_url}/login/renew`, {
        headers: { 'x-token': this.token },
      })
      .pipe(
        map((resp: any) => {
          const { email, google, nombre, role, uid, img = '' } = resp.usuario;
          this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
          localStorage.setItem('token', resp.token);
          return true;
        }),

        catchError((err) => of(false))
      );
  }

  crearUsuario(formData: any) {
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  actualizarPerfil(data: {
    email: string;
    nombre: string;
    role: string | undefined;
  }) {
    data = { ...data, role: this.usuario.role };
    return this.http.put(
      `${base_url}/usuarios/${this.uid}`,
      data,
      this.headers
    );
  }

  login(formData: any) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  logout() {
    if (this.usuario.google) {
      localStorage.removeItem('token');
      google.accounts.id.revoke(this.usuario.email, () => {
        this.ngZone.run(() => {
          this.router.navigateByUrl('/auth/login');
        });
      });
    } else {
      localStorage.removeItem('token');
      this.router.navigateByUrl('/auth/login');
    }
  }
  cargarUsuarios(desde: number = 0) {
    return this.http
      .get<{ total: number; usuarios: Usuario[] }>(
        `${base_url}/usuarios?desde=${desde}`,
        this.headers
      )
      .pipe(
        map((resp) => {
          const usuarios = resp.usuarios.map(
            (user) =>
              new Usuario(
                user.nombre,
                user.email,
                '',
                user.img,
                user.google,
                user.role,
                user.uid
              )
          );
          return {
            total: resp.total,
            usuarios,
          };
        })
      );
  }
  eliminarUsuario(usuario: Usuario) {
    return this.http.delete(
      `${base_url}/usuarios/${usuario.uid}`,
      this.headers
    );
  }
  guardarUsuario(usuario: Usuario) {
    return this.http.put(
      `${base_url}/usuarios/${usuario.uid}`,
      usuario,
      this.headers
    );
  }
}
