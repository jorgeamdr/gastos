import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import * as moment from 'moment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css']
})
export class GastosComponent implements OnInit {

  public gastos: Array<any>;

  constructor(private _http: Http) { }

  ngOnInit() {
    this.cargarGastos();
  }
  /*
  async cargarGastos() {
    const gastos = await this._http.get('api/gastos').map(d => d.json() as Array<any>).toPromise();


    const gastosDias = [];
    gastos.forEach(g => {
      const dia = moment(g.Fecha);

      if (!gastosDias.includes(dia.format('YYYY-MM-DD'))) {
        console.log('si entra');
        gastosDias.push(dia.format('YYYY-MM-DD'));
      } else {
        console.log('no entra');
      }

      g.Fecha = moment(g.Fecha);
    });

    this.gastos = gastosDias.map(gd => {
      const fecha = moment(gd).startOf('day');
      const resumen = {
        fecha: fecha,
        gastos: gastos.filter(g => fecha.isSame(g.Fecha, 'day'))
          .sort((a, b) => (a.Fecha as moment.Moment).diff(b.Fecha)),
        total: 0
      };

      resumen.total = resumen.gastos.reduce((a, b) => a + b.Importe, 0);
      return resumen;
    });

    this.gastos = this.gastos.sort((a, b) => -moment(a.fecha).diff(b.fecha));
    console.log(this.gastos);
  }*/

  async cargarGastos() {
    //this.gastos = await this._http.get('api/gastos-diarios').map(d => d.json() as Array<any>).toPromise();
    this.gastos = await this._http.get('api/gastos').map(d => d.json() as Array<any>).toPromise();
  }
}
