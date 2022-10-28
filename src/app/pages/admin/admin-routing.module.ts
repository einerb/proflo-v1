import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin.component';
import { ReportComponent } from './report/report.component';
import { PublicComponent } from './public/public.component';

const routes: Routes = [
  {
    path: ``,
    component: AdminComponent,
    children: [
      { path: ``, component: PublicComponent },
      { path: `reports`, component: ReportComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
