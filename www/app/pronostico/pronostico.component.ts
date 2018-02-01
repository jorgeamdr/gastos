import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { BaseChartDirective } from 'ng2-charts';
import * as moment from 'moment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-pronostico',
  templateUrl: './pronostico.component.html',
  styleUrls: ['./pronostico.component.css']
})
export class PronosticoComponent implements OnInit {

  public mostrarGrafica: boolean = false;

  public filtro = {
    fechaInicio: moment().startOf('day').toISOString().slice(0, 10),
    fechaFin: moment().startOf('day').add(30, 'days').toISOString().slice(0, 10)
  };

  public dias: Array<{
    fecha: moment.Moment, saldo: number, saldoFinal: number, saldoLight: number, ahorro: number,
    tarjetas: any
  }> = [];

  public chart: BaseChartDirective;

  public lineChartData = [{
    data: [],
    label: ''
  }];


  public lineChartLabels = null;

  public lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    datasetOverride: [{fill: false}, {fill: false}, {fill: false}, {fill: false}]
  };

  public lineChartColors = [
    { // blue
      backgroundColor: 'rgba(0,128,256,0.15)',
      borderColor: 'rgba(0,128,256,1)',
      pointBackgroundColor: 'rgba(0,128,256,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0,128,256,0.8)'
    },
    { // grey
      backgroundColor: 'rgba(134, 142, 150,0.15)',
      borderColor: 'rgba(134, 142, 150,1)',
      pointBackgroundColor: 'rgba(134, 142, 150,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(134, 142, 150,1)'
    },
    { // green
      backgroundColor: 'rgba(40, 167, 69,0.15)',
      borderColor: 'rgba(40, 167, 69,1)',
      pointBackgroundColor: 'rgba(40, 167, 69,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(40, 167, 69,0.8)'
    },
    { // red
      backgroundColor: 'rgba(220, 53, 69,0.15)',
      borderColor: 'rgba(220, 53, 69,1)',
      pointBackgroundColor: 'rgba(220, 53, 69,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(220, 53, 69,0.8)'
    },
    { // yellow
      backgroundColor: 'rgba(255, 193, 7, 0.15)',
      borderColor: 'rgba(255, 193, 7, 1)',
      pointBackgroundColor: 'rgba(255, 193, 7, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255, 193, 7, 0.8)'
    }
  ];


  constructor(private _http: Http) { }

  ngOnInit() {
    this.cargarGastos();
  }

  async cargarGastos() {
    this.dias = await this._http.get('api/pronostico', {
      params: this.filtro
    }).map(d => d.json()).toPromise();

    this.dias.forEach(dia => dia.fecha = moment(dia.fecha));

    console.log(this.dias);
    this.lineChartData = [ {
      data: this.dias.map(d => d.saldo),
      label: 'Saldo'
    }, {
      data: this.dias.map(d => d.ahorro),
      label: 'Ahorro'
    }, {
      data: this.dias.map(d => d.tarjetas['Uni-k'].saldo),
      label: 'Uni-k'
    }, {
      data: this.dias.map(d => d.tarjetas['Light'].saldo),
      label: 'Light'
    }, ];
    /*
    this.lineChartData = [
      {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
      {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
      {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
    ];*/
    this.lineChartLabels = this.dias.map(d => d.fecha.format('ddd DD-MMM-YY'));

    // this.lineChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    this.actualizarGrafica();
  }

  actualizarGrafica(): void {
    setTimeout(() => this.mostrarGrafica = false, 0);
    setTimeout(() => this.mostrarGrafica = true, 0);
  }

}
