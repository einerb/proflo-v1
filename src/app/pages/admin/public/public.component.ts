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
import { OccupationService } from 'src/app/services/occupation.service';
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
  public filteredOptionsProject?: Observable<any[]>;
  public filterCC = new FormControl({ value: '', disabled: true });
  public filterProject = new FormControl();
  public scheduleArray: any[] = [];
  public projectArray: any[] = [];

  constructor(
    private readonly globalService: GlobalService,
    private readonly projectService: ProjectService,
    private readonly employeeService: EmployeeService,
    private readonly scheduleService: ScheduleService,
    private readonly occupationService: OccupationService,
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

    this.filteredOptionsProject = this.filterProject.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterProject(value || ''))
    );

    this.getProjects();
    this.getOccupations();
  }

  get f() {
    return this.publicForm.controls;
  }

  g() {
    return (<FormArray>this.publicForm.get('schedule')).controls;
  }

  public addSchedule() {
    (<FormArray>this.publicForm.get('schedule')).push(
      new FormGroup({
        projectId: new FormControl(null, Validators.required),
        hour: new FormControl(null, Validators.required),
      })
    );
  }

  public deleteSchedule(i: number) {
    (<FormArray>this.publicForm.get('schedule')).removeAt(i);
  }

  public filterChange(event: any) {
    this.employees = [];
    this.filteredOptions = this.filterCC.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );

    if (event) this.filterCC.enable();

    this.filterCC.setValue('');

    this.getEmployees(event.value);
  }

  private _filter(value: any): any[] {
    if (value.length !== '') {
      const removeAccents = (str: string) => {
        if (str.length > 0)
          return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
        else return str;
      };
      let valueStr = removeAccents(value);
      return this.employees?.filter((option) =>
        removeAccents(option?.fullname).toLowerCase().includes(valueStr)
      );
    } else {
      return (this.employees = []);
    }
  }

  private _filterProject(value: any): any[] {
    if (value.length !== '') {
      const removeAccents = (str: string) => {
        if (str.length > 0)
          return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
        else return str;
      };
      let valueStr = removeAccents(value);
      return this.projects?.filter((option) =>
        removeAccents(option?.name).toLowerCase().includes(valueStr)
      );
    } else {
      return (this.projects = []);
    }
  }

  public onSave() {
    if (this.publicForm.invalid) {
      return;
    }

    let fullname = this.employees.filter(
      (x) => x.fullname.toLowerCase() === this.filterCC.value.toLowerCase()
    );

    let totalHours = 0;
    this.publicForm.value?.schedule.forEach((element: any) => {
      totalHours += element.hour;
    });

    if (totalHours >= 7.5 && totalHours <= 8.5) {
      this.publicForm.value?.schedule.forEach((element: any) => {
        let projectId = this.projects.filter(
          (x) => x.name.toLowerCase() === element.projectId.toLowerCase()
        );

        const data = {
          hour: element.hour,
          projectId: projectId[0]?.id,
          journey: this.publicForm.get('journey')!.value,
          identification: fullname[0]?.identification
            ? fullname[0]?.identification
            : null,
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
    } else {
      Swal.fire({
        title: `Operación errónea`,
        text: 'El registro total de horas no se encuentra en el rango permitido. Rango permitido de 7.5 a 8.5 horas!',
        icon: 'error',
        confirmButtonText: 'Ok',
        allowOutsideClick: false,
      });
    }
  }

  private createForm() {
    this.publicForm = this.formBuilder.group({
      journey: ['', [Validators.required]],
      schedule: this.formBuilder.array([]),
    });
  }

  private getEmployees(occupation: string) {
    this.employeeService.get(occupation).subscribe((res) => {
      this.employees = res.data?.sort((e1: any, e2: any) =>
        e2.fullname.toLowerCase() < e1.fullname.toLowerCase()
          ? 1
          : e2.fullname.toLowerCase() > e1.fullname.toLowerCase()
          ? -1
          : 0
      );
    });
  }

  private getProjects() {
    this.projectService.getAll().subscribe((res) => {
      this.projects = res.data;
    });
  }

  private getOccupations() {
    this.occupationService.getAll().subscribe((res: any) => {
      this.occupations = res.data?.sort((o1: any, o2: any) =>
        o2.name.toLowerCase() < o1.name.toLowerCase()
          ? 1
          : o2.name.toLowerCase() > o1.name.toLowerCase()
          ? -1
          : 0
      );
    });
  }
}
