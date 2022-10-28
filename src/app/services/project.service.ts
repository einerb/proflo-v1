import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Api } from '../shared/api';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private readonly globalService: GlobalService) {}

  public getAll(): Observable<any> {
    return this.globalService.get(Api.Endpoints.PROJECT.BASE).pipe(
      map((res) => {
        return res;
      })
    );
  }

  public getId(name: string, start: string, end: string): Observable<any> {
    return this.globalService
      .get(Api.Endpoints.PROJECT.ID(name, start, end))
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public create(schedule: any) {
    return this.globalService.post(Api.Endpoints.PROJECT.BASE, schedule).pipe(
      map((res) => {
        return res;
      })
    );
  }
}
