import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Api } from '../shared/api';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  constructor(private readonly globalService: GlobalService) {}

  public getAll(
    pageNumber: number,
    pageElements: number,
    start: string,
    end: string,
    journey: string
  ): Observable<any> {
    return this.globalService
      .get(
        Api.Endpoints.SCHEDULE.ALL(
          pageNumber,
          pageElements,
          start,
          end,
          journey
        )
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public create(schedule: any) {
    return this.globalService.post(Api.Endpoints.SCHEDULE.BASE, schedule).pipe(
      map((res) => {
        return res;
      })
    );
  }
}
