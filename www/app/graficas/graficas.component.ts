import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Http } from '@angular/http';

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.css']
})
export class GraficasComponent implements OnInit {

  public filtro: any;
  public gastosDiarios: Array<any>;
  public gastosDiariosChartData: any;
  public gastosDiariosLabels: Array<string>;


  constructor(private _http: Http) { }

  async ngOnInit() {
    const fechaActual = moment().local();

    this.filtro = {
      fechaInicio: fechaActual.format('YYYY-MM'),
      fechaFin: fechaActual.format('YYYY-MM'),
    };

    this.gastosDiarios = [];
    this.gastosDiariosChartData = null;
    this.gastosDiariosLabels = null;

    await this.obtenerGastosDiarios();
  }

  async obtenerGastosDiarios() {
    this.gastosDiarios = await this._http.get('api/reportes/gastos-diarios', {
      params: this.filtro
    }).map(res => res.json()).toPromise();
    this.gastosDiarios = this.gastosDiarios.sort((a, b) => a.fecha.localeCompare(b.fecha));



    this.gastosDiariosLabels = this.gastosDiarios.map(d => moment(d.fecha).format('DD-MMM')),
    this.gastosDiariosChartData = [
      {
        data: this.gastosDiarios.map(d => d.importe),
        label: 'Gastos'
      }
    ];
  }

}
