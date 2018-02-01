import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosDiariosComponent } from './gastos-diarios.component';

describe('GastosDiariosComponent', () => {
  let component: GastosDiariosComponent;
  let fixture: ComponentFixture<GastosDiariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GastosDiariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GastosDiariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
