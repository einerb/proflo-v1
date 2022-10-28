import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalService, ProjectService } from 'src/app/services';

@Component({
  selector: 'app-modal-project',
  templateUrl: './modal-project.component.html',
  styleUrls: ['./modal-project.component.scss'],
})
export class ModalProjectComponent implements OnInit {
  public projectForm!: FormGroup;

  constructor(
    private readonly globalService: GlobalService,
    private readonly projectService: ProjectService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ModalProjectComponent>
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  get f() {
    return this.projectForm.controls;
  }

  public onSave() {
    if (this.projectForm.invalid) {
      return;
    }

    const data = {
      name: this.projectForm.get('name')?.value,
      description: this.projectForm.get('description')?.value,
      state: true,
    };

    this.projectService.create(data).subscribe(
      (res) => {
        this.globalService.onMessage(res.code, res.message);
        this.dialogRef.close();
      },
      (err) => this.globalService.onMessage(err.code, err.error)
    );
  }

  private createForm() {
    this.projectForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
    });
  }
}
