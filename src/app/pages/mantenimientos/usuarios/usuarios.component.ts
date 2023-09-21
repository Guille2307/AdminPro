import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime, delay } from 'rxjs/operators';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit, AfterViewInit, OnDestroy {
  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;
  public termino: string = '';
  public imgSubs!: Subscription;

  @ViewChild('input', { static: true }) input!: ElementRef;

  constructor(
    private usuarioService: UsuarioService,
    private busquedasService: BusquedasService,
    private modalImagenSevice: ModalImagenService
  ) {}
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenSevice.nuevaImagen
      .pipe(delay(100))
      .subscribe((resp) => this.cargarUsuarios());
  }

  ngAfterViewInit() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(debounceTime(1000))
      .subscribe((resp: any) => {
        this.termino = this.input.nativeElement.value;
        this.buscar();
      });
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService
      .cargarUsuarios(this.desde)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar() {
    if (this.termino === '') {
      return (this.usuarios = [...this.usuariosTemp]);
    }

    return this.busquedasService
      .buscar('usuarios', this.termino)
      .subscribe((resultados) => {
        this.usuarios = resultados;
      });
  }

  clear() {
    this.cargarUsuarios();
    this.input.nativeElement.value = '';
  }

  eliminarUsuarios(usuario: Usuario) {
    if (usuario.uid === this.usuarioService.uid) {
      return Swal.fire(
        'Error',
        'No puede borrar el usuario actual ya que está en uso',
        'error'
      );
    }

    return Swal.fire({
      title: '¿Borra Usuario',
      text: `Esta apunto de borrar a el usuario ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario).subscribe((resp) => {
          Swal.fire(
            'Usuario borrado!',
            `${usuario.nombre} fue eliminado correctamente`,
            'success'
          );
          this.cargarUsuarios();
        });
      }
    });
  }
  cambiarRole(usuario: Usuario) {
    this.usuarioService.guardarUsuario(usuario).subscribe((resp) => {
      console.log(resp);
    });
  }
  abrirModal(usuario: Usuario) {
    this.modalImagenSevice.abrirModal(
      'usuarios',
      usuario.uid as string,
      usuario.img
    );
  }
}
