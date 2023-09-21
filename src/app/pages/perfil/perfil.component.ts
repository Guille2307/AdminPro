import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  public perfilForm!: FormGroup;
  public usuario!: Usuario;
  public imagenSubir!: File;
  public imgTemp: any = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
  ) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit() {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });
  }
  actualizarPerfil() {
    this.usuarioService.actualizarPerfil(this.perfilForm.value).subscribe({
      next: (resp: any) => {
        const { nombre, email } = (resp as any).usuario;
        this.usuario.nombre = nombre;
        this.usuario.email = email;
        Swal.fire('succcess', '', 'success');
      },
      error: (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      },
    });
  }

  cambiarImage(event: any) {
    const imagen = event.target.files[0];
    this.imagenSubir = imagen;
    if (!imagen) {
      return (this.imgTemp = null);
    }

    const reader = new FileReader();
    reader.readAsDataURL(imagen);
    const url = (reader.onloadend = () => {
      this.imgTemp = reader.result;
    });
    return url;
  }

  subirImagen() {
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
      .then((img) => {
        this.usuario.img = img;
        if (!img) {
          this.usuario.img;
        } else {
          Swal.fire('succcess', '', 'success');
        }
      })
      .catch((err) => {
        Swal.fire('Error', err.error.msg, 'error');
      });
  }
}
