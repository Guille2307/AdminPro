import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from 'src/app/models/hospital.model';
import { MedicoService } from 'src/app/services/medico.service';
import { Medico } from 'src/app/models/medico.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css'],
})
export class MedicoComponent implements OnInit {
  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado!: Hospital | undefined;
  public medicoSeleccionado!: Medico;
  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.cargarMedico(id);
    });

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    this.cargaHospitales();

    this.medicoForm.get('hospital')?.valueChanges.subscribe((hospitalId) => {
      this.hospitalSeleccionado = this.hospitales.find(
        (h) => h._id === hospitalId
      );
    });
  }

  cargarMedico(id: string) {
    if (id === 'nuevo') {
      return;
    }
    this.medicoService
      .obternerMedicoPorId(id)
      .pipe(delay(100))
      .subscribe({
        next: (medico) => {
          this.medicoSeleccionado = medico;
          this.medicoForm.setValue({
            nombre: medico.nombre,
            hospital: medico.hospital._id,
          });
        },
        error: (err) => {
          console.log(err.error.msg);
          return this.router.navigateByUrl(`/dashboard/medicos`);
        },
      });
  }

  cargaHospitales() {
    this.hospitalService.cargarHospitales().subscribe((hospitales) => {
      this.hospitales = hospitales;
    });
  }

  guardarMedico() {
    const { nombre } = this.medicoForm.value;

    if (this.medicoSeleccionado) {
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id,
      };

      this.medicoService.actualizarMedico(data).subscribe((resp) => {
        Swal.fire(
          'Médico actualizado ',
          `El médico ${nombre} actualizado correctamente`,
          'success'
        );
      });
    } else {
      this.medicoService
        .crearMedico(this.medicoForm.value)
        .subscribe((resp: any) => {
          Swal.fire(
            'Médico creado',
            `El médico ${nombre} se creo correctamente`,
            'success'
          );
          this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
        });
    }
  }
}
