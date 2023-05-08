import { ComponentFixture, TestBed } from '@angular/core/testing';

import PromesasComponent from './promesas.component';

describe('PromesasComponent', () => {
  let component: PromesasComponent;
  let fixture: ComponentFixture<PromesasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PromesasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PromesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
