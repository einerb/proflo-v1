import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { EmployeeService, GlobalService } from 'src/app/services';
import { OccupationService } from 'src/app/services/occupation.service';

@Component({
  selector: 'app-modal-manual',
  templateUrl: './modal-manual.component.html',
  styleUrls: ['./modal-manual.component.scss'],
})
export class ModalManualComponent implements OnInit {
  public employeeForm!: FormGroup;
  public occupations: any[] = [];

  constructor(
    private readonly globalService: GlobalService,
    private readonly employeeService: EmployeeService,
    private readonly occupationService: OccupationService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ModalManualComponent>
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.getOccupations();
  }

  get f() {
    return this.employeeForm.controls;
  }

  public onSave() {
    if (this.employeeForm.invalid) {
      return;
    }

    const data = {
      identification: this.employeeForm.get('identification')?.value,
      fullname: this.employeeForm.get('fullname')?.value,
      occupation: this.employeeForm.get('occupation')?.value,
      city: this.employeeForm.get('city')?.value,
      address: this.employeeForm.get('address')?.value,
      phone: this.employeeForm.get('phone')?.value,
      state: true,
    };

    this.employeeService.create(data).subscribe(
      (res) => {
        this.globalService.onMessage(res.code, res.message);
        this.dialogRef.close();
      },
      (err) => this.globalService.onMessage(err.code, err.error)
    );
  }

  private createForm() {
    this.employeeForm = this.formBuilder.group({
      identification: [
        '',
        [
          Validators.required,
          Validators.pattern(/^((\d{8})|(\d{10})|(\d{11})|(\d{6}-\d{5}))?$/g),
        ],
      ],
      fullname: ['', [Validators.required]],
      occupation: ['', [Validators.required]],
      city: [''],
      address: [''],
      phone: [''],
    });
  }

  private getOccupations() {
    this.occupationService.getAll().subscribe((res: any) => {
      this.occupations = res.data;      
    })
  }
}
