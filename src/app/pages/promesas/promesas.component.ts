import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styleUrls: ['./promesas.component.css'],
})
export class PromesasComponent implements OnInit {
  usuarios!: any;
  ngOnInit() {
    this.getUsuarios().then((usuarios) => {
      this.usuarios = usuarios;
    });
    // const promesa = new Promise((resolve, reject) => {
    //   if (false) {
    //     resolve('hola mundo');
    //   } else {
    //     reject('algo salio mal');
    //   }
    // });
    // promesa
    //   .then((mensaje) => {
    //     console.log(mensaje);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // console.log('fin del init');
  }
  getUsuarios() {
    return new Promise((resolve, reject) => {
      fetch('https://reqres.in/api/users')
        .then((data) => data.json())
        .then(({ data }) => resolve(data));
    });
  }
}
