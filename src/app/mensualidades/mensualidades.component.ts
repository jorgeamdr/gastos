import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-mensualidades',
  templateUrl: './mensualidades.component.html',
  styleUrls: ['./mensualidades.component.css']
})
export class MensualidadesComponent implements OnInit {

  public mensualidades: Array<any>;

      constructor(private _http: Http) { }

      ngOnInit() {
        this.cargarMensualidades();
      }

      cargarMensualidades() {
        this._http.get('api/mensualidades').subscribe(
          d => this.mensualidades = d.json(),
          err => alert(err)
        );
      }

}
