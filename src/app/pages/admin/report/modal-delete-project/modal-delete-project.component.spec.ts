import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteProjectComponent } from './modal-delete-project.component';

describe('ModalDeleteProjectComponent', () => {
  let component: ModalDeleteProjectComponent;
  let fixture: ComponentFixture<ModalDeleteProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDeleteProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeleteProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
