import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingBarHttpModule } from '@ngx-loading-bar/http';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { AppComponent } from './app.component';
import { GastosComponent } from './gastos/gastos.component';
import { GastosDiariosComponent } from './gastos-diarios/gastos-diarios.component';
import { PronosticoComponent } from './pronostico/pronostico.component';

import { LOCALE_ID } from '@angular/core';
import { SaldosComponent } from './saldos/saldos.component';
import { MensualidadesComponent } from './mensualidades/mensualidades.component';
import { AltaComponent } from './alta/alta.component';

@NgModule({
  declarations: [
    AppComponent,
    GastosComponent,
    GastosDiariosComponent,
    PronosticoComponent,
    SaldosComponent,
    MensualidadesComponent,
    AltaComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    NgbModule.forRoot(),
    ChartsModule,
    FormsModule,
    LoadingBarHttpModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
