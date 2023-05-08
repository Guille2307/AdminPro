import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css'],
})
export class BreadcrumbsComponent implements OnDestroy {
  public titulo: string = '';
  public tituloSubs$!: Subscription;
  constructor(private router: Router) {
    this.tituloSubs$ = this.getDataroutes().subscribe(({ titulo }) => {
      this.titulo = titulo;
      document.title = `AdminPro - ${titulo}`;
    });
  }
  ngOnDestroy() {
    this.tituloSubs$.unsubscribe();
  }
  getDataroutes() {
    return this.router.events.pipe(
      filter((event): event is ActivationEnd => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data)
    );
  }
}
