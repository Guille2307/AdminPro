import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';
import { take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styleUrls: ['./rxjs.component.css'],
})
export class RxjsComponent implements OnDestroy {
  public IntervalSubs!: Subscription;

  constructor() {
    this.IntervalSubs = this.retornaIntervalo().subscribe();
  }
  ngOnDestroy() {
    this.IntervalSubs.unsubscribe();
  }

  retornaIntervalo(): Observable<number> {
    return interval(500).pipe(
      // take(10),
      map((valor) => {
        return valor + 1;
      }),
      filter((valor) => valor % 2 === 0)
    );
  }
}
