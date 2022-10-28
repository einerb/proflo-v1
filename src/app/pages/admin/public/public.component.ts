import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { map, Observable, startWith } from 'rxjs';
import {
  EmployeeService,
  GlobalService,
  ProjectService,
  ScheduleService,
} from 'src/app/services/';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
})
export class PublicComponent implements OnInit {
  public dateRealized?: string;
  public employees: any[] = [];
  public occupations: any[] = [];
  public projects: any[] = [];
  public publicForm!: FormGroup;
  public filteredOptions?: Observable<any[]>;
  public filterCC = new FormControl({ value: '', disabled: true });
  public scheduleArray: any[] = [];

  constructor(
    private readonly globalService: GlobalService,
    private readonly projectService: ProjectService,
    private readonly employeeService: EmployeeService,
    private readonly scheduleService: ScheduleService,
    private formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    moment.locale('es');
    this.dateRealized = moment(new Date()).format('LLLL');

    this.filteredOptions = this.filterCC.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );

    this.addSchedule();

    this.getProjects();
    this.getOccupations();
  }

  get f() {
    return this.publicForm.controls;
  }

  get g(): FormArray {
    return this.publicForm.get('schedule') as FormArray;
  }

  public addSchedule() {
    this.g.push(this.createSchedule());
  }

  public createSchedule(): FormGroup {
    return this.formBuilder.group({
      projectId: ['', [Validators.required]],
      hour: ['', [Validators.required]],
    });
  }

  public deleteSchedule(i: number) {
    this.g.removeAt(i);
  }

  public filterChange(event: any) {
    this.employees = [];
    this.filteredOptions = this.filterCC.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );

    if (event)
      this.filterCC.enable();

    this.filterCC.setValue('');

    this.getEmployees(event.value);
  }

  private _filter(value: any): any[] {
    if (value.length !== '') {
      const removeAccents = (str: string) => {
        if (str.length > 0)
          return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        else
          return str;
      }
      let valueStr = removeAccents(value)
      return this.employees?.filter((option) =>
        removeAccents(option?.fullname).toLowerCase().includes(valueStr)
      );
    } else {
      return this.employees = [];
    }

  }

  public onSave() {
    if (this.publicForm.invalid) {
      return;
    }
    this.fillArray();

    this.scheduleArray.forEach((element) => {
      const data = {
        hour: element.hour,
        journey: element.journey,
        projectId: element.projectId,
        identification: element.identification,
      };

      this.scheduleService.create(data).subscribe((res) => {
        if (res.code > 1000) {
          Swal.fire({
            title: `Operación exitosa`,
            text: res.message,
            icon: 'success',
            confirmButtonText: 'Ok',
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        } else {
          this.globalService.onMessage(res.code, res.error);
        }
      });
    });
  }

  private createForm() {
    this.publicForm = this.formBuilder.group({
      journey: ['', [Validators.required]],
      schedule: this.formBuilder.array([]),
    });
  }

  private fillArray() {
    this.scheduleArray = [];
    let fullname = this.employees.filter((x) => x.fullname.toLowerCase() === this.filterCC.value.toLowerCase())

    this.g.value.forEach((schedule: any) => {
      this.scheduleArray.push({
        hour: schedule.hour,
        journey: this.publicForm.get('journey')!.value,
        projectId: schedule.projectId,
        identification: fullname[0].identification,
      });
    });
  }

  private getEmployees(occupation: string) {
    this.employeeService.get(occupation).subscribe((res) => {
      this.employees = res.data?.sort(
        (e1: any, e2: any) => (e2.fullname.toLowerCase() < e1.fullname.toLowerCase()) ? 1 : (e2.fullname.toLowerCase() > e1.fullname.toLowerCase()) ? -1 : 0);
    });
  }

  private getProjects() {
    this.projectService.getAll().subscribe((res) => {
      this.projects = res.data;
    });
  }

  private getOccupations() {
    this.employeeService.getOccupation().subscribe((res) => {
      this.occupations = res.data?.sort(
        (o1: any, o2: any) => (o2.occupation.toLowerCase() < o1.occupation.toLowerCase()) ? 1 : (o2.occupation.toLowerCase() > o1.occupation.toLowerCase()) ? -1 : 0);
    });
  }
}
