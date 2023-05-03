import { Component } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styleUrls: ['./grafica1.component.css'],
})
export class Grafica1Component {
  public labels1: string[] = ['video card', 'Ram memory', 'Cases'];
  public data1 = {
    labels: this.labels1,
    datasets: [
      {
        data: [350, 450, 100],
        backgroundColor: ['#6857e6', '#009fee', '#f02059'],
      },
    ],
  };
  public data2 = {
    labels: this.labels1,
    datasets: [
      {
        data: [50, 50, 250],
        backgroundColor: ['#6857e6', '#009fee', '#f02059'],
      },
    ],
  };
  public data3 = {
    labels: this.labels1,
    datasets: [
      {
        data: [30, 40, 10],
        backgroundColor: ['#6857e6', '#009fee', '#f02059'],
      },
    ],
  };
  public data4 = {
    labels: this.labels1,
    datasets: [
      {
        data: [450, 350, 800],
        backgroundColor: ['#6857e6', '#009fee', '#f02059'],
      },
    ],
  };
}
