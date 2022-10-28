import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Api } from '../shared/api';

import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class OccupationService {

  constructor(private readonly globalService: GlobalService) { }

  public getAll(
  ): Observable<any> {
    return this.globalService
      .get(
        Api.Endpoints.OCCUPATION.ALL
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}
