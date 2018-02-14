import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.css']
})
export class GraficasComponent implements OnInit {

  public filtro: any;


  constructor() { }

  ngOnInit() {
    const fechaActual = moment().local();

    this.filtro = {
      fechaInicio: fechaActual.format('YYYY-MM'),
      fechaFin: fechaActual.format('YYYY-MM'),
    };
  }

}
