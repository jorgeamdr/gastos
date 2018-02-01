import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-saldos',
  templateUrl: './saldos.component.html',
  styleUrls: ['./saldos.component.css']
})
export class SaldosComponent implements OnInit {

  public saldos: Array<any>;

      constructor(private _http: Http) { }

      ngOnInit() {
        this.cargarSaldos();
      }

      cargarSaldos() {
        this._http.get('api/saldos').subscribe(
          d => this.saldos = d.json(),
          err => alert(err)
        );
      }

}
