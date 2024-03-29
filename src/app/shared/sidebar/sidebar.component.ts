import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  public usuario!: Usuario;

  constructor(
    public sideBarService: SidebarService,
    private usuarioService: UsuarioService
  ) {
    this.usuario = usuarioService.usuario;
  }

  logout() {
    this.usuarioService.logout();
  }
}
