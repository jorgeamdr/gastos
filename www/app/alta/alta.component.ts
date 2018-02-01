import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Http } from '@angular/http';


interface Categoria {
  idCategoria: number;
  nombre: string;
}

interface Cuenta {
  idCuenta: number;
  nombre: string;
}

interface Persona {
  idPersona: number;
  nombre: string;
}

interface Gasto {
  fecha?: string;
  idCuenta?: number;
  idCategoria?: number;
  esEspecial?: boolean;
  importe?: number;
  idPersona?: number;
  descripcion?: string;
  categoria?: Categoria;
  persona?: Persona;
  cuenta?: Cuenta;
}

@Component({
  selector: 'app-alta',
  templateUrl: './alta.component.html',
  styleUrls: ['./alta.component.css']
})
export class AltaComponent implements OnInit {

  gasto: Gasto;
  categorias: Array<Categoria>;
  personas: Array<Persona>;

  api = {
    cuentas: {
      async obtenerCuentas() {
        return this._http.get('api/cuentas').map(r => r.json() as Array<Cuenta>).toPromise();
      }
    },
    gastos: {
      async guardarGasto(gasto: Gasto) {
        const dto = {
          fecha: gasto.fecha,
          idCuenta: gasto.cuenta.idCuenta,
          idCategoria: gasto.categoria.idCategoria,
          esEspecial: gasto.esEspecial,
          importe: gasto.importe,
          idPersona: gasto.persona.idPersona,
          descripcion: gasto.descripcion,
        };

        return this._http.post('api/gastos', dto).toPromise();
      }
    }
  };

  constructor(private _http: Http) { }

  ngOnInit() {
    this.inicializarGasto();
    this.cargarCategorias();
    this.cargarPersonas();
  }

  inicializarGasto() {
    this.gasto = {
      fecha: moment().toISOString().slice(0, 16),
      descripcion: '',
      esEspecial: false,
      importe: 0
     };
  }

  async obtenerCategorias() {
    return this._http.get('api/categorias').map(r => r.json() as Array<Categoria>).toPromise();
  }

  async cargarCategorias() {
    this.categorias = await this.obtenerCategorias();
  }

  async obtenerPersonas() {
    return this._http.get('api/personas').map(r => r.json() as Array<Persona>).toPromise();
  }

  async cargarPersonas() {
    this.personas = await this.obtenerPersonas();
  }

  async guardarGasto() {
    await this.api.gastos.guardarGasto(this.gasto);
    this.inicializarGasto();
  }
}
