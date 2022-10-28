import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';

import { DATE_FORMAT } from 'src/app/utils/moment-format.util';
import { ModalManualComponent } from './modal-manual/modal-manual.component';
import { ScheduleService } from 'src/app/services';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { ModalIndividualComponent } from './modal-individual/modal-individual.component';
import { ModalProjectComponent } from './modal-project/modal-project.component';

const ELEMENT_DATA: any[] = [];

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
  ],
})
export class ReportComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  public range = new FormGroup({
    start: new FormControl(
      moment(new Date()).add(0, 'day').format('YYYY-MM-DD')
    ),
    end: new FormControl(moment(new Date()).add(1, 'day').format('YYYY-MM-DD')),
  });
  displayedColumns: string[] = [
    'nombre',
    'fecha',
    'jornada',
    'ocupacion',
    'proyecto',
    'hora',
  ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  public page: number = 1;
  public currentElements: number = 200;
  public startDate: any;
  public endDate: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public journey = new FormControl('M');

  constructor(
    private readonly scheduleService: ScheduleService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    moment.locale('es');

    this.getSchedule(
      this.page,
      this.currentElements,
      this.range.get('start')?.value,
      this.range.get('end')?.value,
      this.journey.value
    );
  }

  public journeyChange() {
    this.blockUI.start();
    this.getSchedule(
      this.page,
      this.currentElements,
      moment(this.range.get('start')?.value).format('YYYY-MM-DD'),
      moment(this.range.get('end')?.value).format('YYYY-MM-DD'),
      this.journey.value
    );
  }

  public getRange(event: MatDatepickerInputEvent<Date>) {
    let start = moment(this.range.get('start')?.value).format('YYYY-MM-DD');
    let end = moment(this.range.get('end')?.value).format('YYYY-MM-DD');
    let startHours = moment(start).add(-4.9, 'hours').toISOString();
    let endHours = moment(end).add(18.99, 'hours').toISOString();
    if (
      this.range.get('start')?.value !== null &&
      this.range.get('end')?.value !== null
    ) {
      this.blockUI.start();
      this.getSchedule(
        this.page,
        this.currentElements,
        startHours,
        endHours,
        this.journey.value
      );
    }
  }

  private getSchedule(
    page: number,
    currentElements: number,
    startDate: string,
    endDate: string,
    journey: string
  ) {
    this.scheduleService
      .getAll(page, currentElements, startDate, endDate, journey)
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res.data.records);
        this.blockUI.stop();
      });
  }

  public SavePDF(): void {
    this.blockUI.start();

    var doc = new jsPDF();
    const DATA: any = document.getElementById('content');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(`REPORTE DIARIO - PROFLO LATAM`, 20, 20);

    const options = {
      background: 'white',
      scale: 5,
    };
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 15;
        const bufferY = 25;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        this.blockUI.stop();
        docResult.save(`Reporte_PROFLO_${new Date().toISOString()}.pdf`);
      });
  }

  public openDialog() {
    const dialogRef = this.dialog.open(ModalManualComponent);

    dialogRef.afterClosed().subscribe();
  }

  public openDialogIndividual() {
    const dialogRef = this.dialog.open(ModalIndividualComponent);

    dialogRef.afterClosed().subscribe();
  }

  public openDialogProject() {
    const dialogRef = this.dialog.open(ModalProjectComponent);

    dialogRef.afterClosed().subscribe();
  }
}
