import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIndividualComponent } from './modal-individual.component';

describe('ModalIndividualComponent', () => {
  let component: ModalIndividualComponent;
  let fixture: ComponentFixture<ModalIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalIndividualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
