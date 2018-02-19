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
  public nuevoGasto: any;
  public gastoEdicion: any;

  constructor(private _http: Http) { }

  ngOnInit() {
    this.resetNuevoGasto();
    this.cargarGastos();
  }

  resetNuevoGasto() {
    this.nuevoGasto = {
      fecha: moment().local().format('YYYY-MM-DDTHH:mm:ss')
    };
  }

  async guardarNuevoGasto() {
    const gastoGuardar = {...this.nuevoGasto};
    gastoGuardar.fecha = this.offsetLocalToUTC(gastoGuardar.fecha).toISOString();
    const res = await this._http.post('api/gastos', gastoGuardar).map(d => d.json()).toPromise();
    this.nuevoGasto.id = res.id;

    this.gastos.push({...this.nuevoGasto});
    this.resetNuevoGasto();
    this.ordernarGastos();
  }

  editarGasto(gasto) {
    this.gastoEdicion = {
      ...gasto,
      fecha: moment(gasto.fecha).local().format('YYYY-MM-DDTHH:mm:ss')
    };
  }

  offsetLocalToUTC(fecha: string): moment.Moment {
    return moment(fecha); // .subtract((moment(fecha)).utcOffset(), 'm');
  }

  async guardarGasto(gasto) {
    const gastoGuardar = {...this.gastoEdicion};
    gastoGuardar.fecha = this.offsetLocalToUTC(gastoGuardar.fecha).toISOString();
    const res = await this._http.put(`api/gastos/${gastoGuardar.id}`, gastoGuardar).toPromise();

    gasto.fecha = moment(this.gastoEdicion.fecha).toISOString();
    gasto.descripcion = this.gastoEdicion.descripcion;
    gasto.importe = this.gastoEdicion.importe;

    console.log('gastoEdicion', this.gastoEdicion);
    console.log('gastoGuardar', gastoGuardar);
    console.log('gastoEdicion', gasto);

    this.cancelarEdicion();
    this.ordernarGastos();
  }

  cancelarEdicion() {
    this.gastoEdicion = null;
  }

  async eliminarGasto(gasto) {
    if (window.confirm('Confirma que desea eliminar?')) {
      await this._http.delete(`api/gastos/${gasto.id}`).toPromise();
      this.gastos.splice(this.gastos.indexOf(gasto), 1);
    }
  }

  ordernarGastos() {
    // Ordenar de más reciente a más antiguo
    this.gastos = this.gastos.sort((a, b) => {
      // console.log({a, b});
      return b.fecha.localeCompare(a.fecha);
    });
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
    // this.gastos = await this._http.get('api/gastos-diarios').map(d => d.json() as Array<any>).toPromise();
    this.gastos = await this._http.get('api/gastos').map(d => d.json() as Array<any>).toPromise();
    this.ordernarGastos();
  }
}
