import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  menuItems: any[] = [];

  constructor(
    private sideBarService: SidebarService,
    private usuarioService: UsuarioService
  ) {
    this.menuItems = this.sideBarService.menu;
  }

  logout() {
    this.usuarioService.logout();
  }
}
