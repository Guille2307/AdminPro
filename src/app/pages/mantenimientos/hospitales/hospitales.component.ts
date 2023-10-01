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
import { Hospital } from 'src/app/models/hospital.model';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css'],
})
export class HospitalesComponent implements OnInit, OnDestroy, AfterViewInit {
  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs!: Subscription;
  public termino: string = '';
  public hospitalesTemp: Hospital[] = [];
  public usuario: any = this.usuarioService.usuario.role;
  @ViewChild('input', { static: true }) input!: ElementRef;

  constructor(
    public usuarioService: UsuarioService,
    private hospitalService: HospitalService,
    private modalImagenSevice: ModalImagenService,
    private busquedasService: BusquedasService
  ) {}
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.modalImagenSevice.nuevaImagen
      .pipe(delay(100))
      .subscribe((resp) => this.cargarHospitales());
  }

  ngAfterViewInit() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(debounceTime(1000))
      .subscribe((resp: any) => {
        this.termino = this.input.nativeElement.value;
        this.buscar(this.termino);
      });
  }

  cargarHospitales() {
    this.cargando = true;

    this.hospitalService.cargarHospitales().subscribe((hospitales) => {
      this.cargando = false;
      this.hospitales = hospitales;
    });
  }

  guardarCambios(hospital: Hospital) {
    if (this.usuarioService.role !== 'ADMIN_ROLE') {
      Swal.fire('Error', 'No tiene Privilegios de Administrador', 'error');
    }
    if (this.usuarioService.role === 'ADMIN_ROLE') {
      this.hospitalService
        .actualizarHospital(hospital._id, hospital.nombre)
        .subscribe((resp) => {
          Swal.fire('Actualizado', hospital.nombre, 'success');
        });
    }
  }
  eliminarHospital(hospital: Hospital) {
    Swal.fire({
      title: '¿Esta seguro que quieres borrar este hospital?',
      showDenyButton: true,
      confirmButtonText: 'Borrar',
      denyButtonText: `No borrar`,
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.usuarioService.role !== 'ADMIN_ROLE') {
          Swal.fire('Error', 'No tiene Privilegios de Administrador', 'error');
        }
        if (this.usuarioService.role === 'ADMIN_ROLE') {
          this.hospitalService
            .borrarHospital(hospital._id)
            .subscribe((resp) => {
              Swal.fire('Eliminado', hospital.nombre, 'success');
              this.cargarHospitales();
            });
        }
      } else if (result.isDenied) {
        Swal.fire('No se realizaron cambios', '', 'info');
      }
    });
  }

  async abrirSweetAlert() {
    try {
      const { value = '' } = await Swal.fire<string>({
        title: 'Crear hospital',
        input: 'text',
        inputLabel: 'Ingrese el nombre del hospital',
        inputPlaceholder: 'Nombre del hospital',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      });
      if (this.usuarioService.role !== 'ADMIN_ROLE') {
        Swal.fire('Error', 'No tiene Privilegios de Administrador', 'error');
      }

      if (
        value!.trim().length > 0 &&
        this.usuarioService.role === 'ADMIN_ROLE'
      ) {
        this.hospitalService.crearHospital(value).subscribe((resp: any) => {
          Swal.fire('Creado', value, 'success');
          this.hospitales.push(resp.hospital);
        });
      }
    } catch (error: any) {
      Swal.fire('Error', 'Debe ingresar un nombre válido', 'error');
    }
  }

  abrirModal(hospital: Hospital) {
    if (hospital && this.usuarioService.role === 'ADMIN_ROLE') {
      this.modalImagenSevice.abrirModal(
        'hospitales',
        hospital._id as string,
        hospital.img
      );
    } else {
      Swal.fire('Error', 'No tiene Privilegios de Administrador', 'error');
    }
  }

  buscar(termino: string) {
    if (termino === '') {
      return this.cargarHospitales();
    }

    return this.busquedasService
      .buscar('hospitales', termino)
      .subscribe((resultados) => {
        this.hospitales = resultados;
      });
  }
}
