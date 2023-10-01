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
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css'],
})
export class MedicosComponent implements OnInit, AfterViewInit, OnDestroy {
  public cargando: boolean = true;
  public medicos: Medico[] = [];
  public termino: string = '';
  public imgSubs!: Subscription;
  @ViewChild('input', { static: true }) input!: ElementRef;

  constructor(
    public usuarioService: UsuarioService,
    private medicoService: MedicoService,
    private modalImagenSevice: ModalImagenService,
    private busquedasService: BusquedasService
  ) {}

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenSevice.nuevaImagen
      .pipe(delay(100))
      .subscribe((resp) => this.cargarMedicos());
  }
  ngAfterViewInit(): void {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(debounceTime(1000))
      .subscribe((resp: any) => {
        this.termino = this.input.nativeElement.value;
        this.buscar(this.termino);
      });
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos().subscribe((medicos) => {
      this.cargando = false;
      this.medicos = medicos;
    });
  }

  abrirModal(medico: Medico) {
    if (medico && this.usuarioService.role === 'ADMIN_ROLE') {
      this.modalImagenSevice.abrirModal(
        'medicos',
        medico._id as string,
        medico.img
      );
    } else {
      Swal.fire('Error', 'No tiene Privilegios de Administrador', 'error');
    }
  }

  buscar(termino: string) {
    if (termino === '') {
      return this.cargarMedicos();
    }

    return this.busquedasService
      .buscar('medicos', termino)
      .subscribe((resultados) => {
        this.medicos = resultados;
      });
  }
  eliminarMedico(medico: Medico) {
    Swal.fire({
      title: '¿Esta seguro que quieres borrar este médico?',
      showDenyButton: true,
      confirmButtonText: 'Borrar',
      denyButtonText: `No borrar`,
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.usuarioService.role !== 'ADMIN_ROLE') {
          Swal.fire('Error', 'No tiene Privilegios de Administrador', 'error');
        }
        if (this.usuarioService.role === 'ADMIN_ROLE') {
          this.medicoService.borrarMedico(medico._id).subscribe((resp) => {
            Swal.fire('Eliminado', medico.nombre, 'success');
            this.cargarMedicos();
          });
        }
      } else if (result.isDenied) {
        Swal.fire('No se realizaron cambios', '', 'info');
      }
    });
  }
}
