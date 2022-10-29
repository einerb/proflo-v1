import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ReportComponent } from './report/report.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { PublicComponent } from './public/public.component';
import { ModalManualComponent } from './report/modal-manual/modal-manual.component';
import { ModalIndividualComponent } from './report/modal-individual/modal-individual.component';
import { ModalProjectComponent } from './report/modal-project/modal-project.component';
import { ModalDeleteProjectComponent } from './report/modal-delete-project/modal-delete-project.component';
import { ModalDeleteEmployeeComponent } from './report/modal-delete-employee/modal-delete-employee.component';

@NgModule({
  declarations: [
    AdminComponent,
    ReportComponent,
    PublicComponent,
    ModalManualComponent,
    ModalIndividualComponent,
    ModalProjectComponent,
    ModalDeleteProjectComponent,
    ModalDeleteEmployeeComponent
  ],
  imports: [CommonModule, AdminRoutingModule, ComponentsModule, MatTableModule],
})
export class AdminModule {}
