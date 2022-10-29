import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Api } from '../shared/api';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private readonly globalService: GlobalService) { }

  public create(employee: any) {
    return this.globalService.post(Api.Endpoints.EMPLOYEE.BASE, employee).pipe(
      map((res) => {
        return res;
      })
    );
  }

  public getAll(
    identification: number,
    pageNumber: number,
    pageElements: number,
    start: string,
    end: string
  ): Observable<any> {
    return this.globalService
      .get(
        Api.Endpoints.EMPLOYEE.BYID(
          identification,
          pageNumber,
          pageElements,
          start,
          end
        )
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public get(occupation: string): Observable<any> {
    return this.globalService.get(Api.Endpoints.EMPLOYEE.ALL(occupation)).pipe(
      map((res) => {
        return res;
      })
    );
  }

  
  public getAllEmployee(): Observable<any> {
    return this.globalService.get(Api.Endpoints.EMPLOYEE.BASE).pipe(
      map((res) => {
        return res;
      })
    );
  }


  public delete(id: number): Observable<any> {
    return this.globalService.delete(Api.Endpoints.EMPLOYEE.BASE+'/'+id).pipe(
      map((res) => {
        return res;
      })
    );
  }
}
