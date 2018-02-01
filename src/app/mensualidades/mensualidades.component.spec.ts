import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensualidadesComponent } from './mensualidades.component';

describe('MensualidadesComponent', () => {
  let component: MensualidadesComponent;
  let fixture: ComponentFixture<MensualidadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensualidadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensualidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
