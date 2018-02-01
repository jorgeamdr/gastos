import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-gastos-diarios',
  templateUrl: './gastos-diarios.component.html',
  styleUrls: ['./gastos-diarios.component.css']
})
export class GastosDiariosComponent implements OnInit {

  public gastos: Array<any>;

    constructor(private _http: Http) { }

    ngOnInit() {
      this.cargarGastos();
    }

    cargarGastos() {
      this._http.get('/api/gastos-diarios').subscribe(
        d => this.gastos = d.json(),
        err => alert(err)
      );
    }
}
