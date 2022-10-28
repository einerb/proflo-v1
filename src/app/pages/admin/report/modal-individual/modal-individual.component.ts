import { Component, OnInit } from '@angular/core';
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
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';

import { DATE_FORMAT } from 'src/app/utils/moment-format.util';
import { EmployeeService, ProjectService } from 'src/app/services';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

const ELEMENT_DATA: any[] = [];

@Component({
  selector: 'app-modal-individual',
  templateUrl: './modal-individual.component.html',
  styleUrls: ['./modal-individual.component.scss'],
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
export class ModalIndividualComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  public range = new FormGroup({
    start: new FormControl(
      moment(new Date()).add(0, 'day').format('YYYY-MM-DD')
    ),
    end: new FormControl(moment(new Date()).add(1, 'day').format('YYYY-MM-DD')),
  });
  displayedColumns: string[] = ['id', 'fecha', 'jornada', 'proyecto', 'hora'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  public search = new FormControl('');
  public totalHours: number = 0.0;
  public filteredOptions!: Observable<any[]>;
  public filterCC = new FormControl('');
  public name: any;
  public description: any;
  public projects: any[] = [];

  constructor(
    private readonly projectService: ProjectService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    moment.locale('es');

    this.getProjects();

    this.filteredOptions = this.filterCC.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  public filterChange() {
    if (this.filterCC.value !== '')
      this.getProject(
        this.filterCC.value,
        moment(this.range.get('start')?.value).format('YYYY-MM-DD'),
        moment(this.range.get('end')?.value).format('YYYY-MM-DD')
      );
  }

  private _filter(value: any): any[] {
    return this.projects?.filter((option: any) =>
      option?.name.toLowerCase().includes(value)
    );
  }

  public getRange(event: MatDatepickerInputEvent<Date>) {
    let start = moment(this.range.get('start')?.value).format('YYYY-MM-DD');
    let end = moment(this.range.get('end')?.value).format('YYYY-MM-DD');
    let startHours = moment(start).add(-4.9, 'hours').toISOString();
    let endHours = moment(end).add(18.99, 'hours').toISOString();

    if (
      this.range.get('start')?.value !== null &&
      this.range.get('end')?.value !== null &&
      this.filterCC.value !== ''
    ) {
      this.blockUI.start();
      this.getProject(this.filterCC.value, startHours, endHours);
    } else {
      this.blockUI.stop();
    }
  }

  private getProject(name: string, startDate: string, endDate: string) {
    this.projectService
      .getId(name, startDate, endDate)
      .subscribe((res: any) => {
        this.name = res.data?.name;
        this.description = res.data?.description;
        this.totalHours =
          res.code > 1000
            ? res.data?.schedule
                .map((item: any) => item.hour)
                .reduce((prev: any, curr: any) => prev + curr, 0)
            : 0.0;

        this.blockUI.stop();
      });
  }

  private getProjects() {
    this.projectService.getAll().subscribe((res) => {
      this.projects = res.data;

      this.blockUI.stop();
    });
  }
}
