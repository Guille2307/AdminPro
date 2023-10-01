import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  public usuario!: Usuario;
  public termino: string = '';
  @ViewChild('input', { static: true }) input!: ElementRef;
  constructor(private usuarioService: UsuarioService, private router: Router) {
    this.usuario = usuarioService.usuario;
  }
  ngAfterViewInit(): void {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(debounceTime(1000))
      .subscribe((resp: any) => {
        this.termino = this.input.nativeElement.value;
        this.buscar(this.termino);
      });
  }
  ngOnInit(): void {}

  logout() {
    this.usuarioService.logout();
  }

  buscar(termino: string) {
    this.input.nativeElement.value = '';
    this.router.navigateByUrl(`/dashboard/buscar/${termino}`);
  }
}
