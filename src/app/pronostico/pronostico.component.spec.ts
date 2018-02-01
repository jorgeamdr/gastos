import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PronosticoComponent } from './pronostico.component';

describe('PronosticoComponent', () => {
  let component: PronosticoComponent;
  let fixture: ComponentFixture<PronosticoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PronosticoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PronosticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
