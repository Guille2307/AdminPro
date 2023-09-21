import { Component } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styleUrls: ['./modal-imagen.component.css'],
})
export class ModalImagenComponent {
  public imagenSubir!: File;
  public imgTemp: any = '';
  constructor(
    public modalImagenService: ModalImagenService,
    private fileUploadService: FileUploadService
  ) {}
  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
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
    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, tipo, id)
      .then((img) => {
        Swal.fire('succcess', '', 'success');
        this.modalImagenService.nuevaImagen.emit(img);
        this.cerrarModal();
      })
      .catch((err) => {
        Swal.fire('Error', err.error.msg, 'error');
      });
  }
}
