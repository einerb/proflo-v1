import jwt_decode from 'jwt-decode';
import { Injectable } from '@angular/core';

import { Api } from '../shared/api';
import { GlobalService } from './global.service';
import { Login } from '../entities/login.entity';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public redirectUrl: string = '';
  private userInfo: any;

  constructor(
    private readonly globalService: GlobalService,
    private router: Router
  ) {}

  /**
   * @description realizar login
   * @returns Observable <any>
   */
  public login(data: Login): Observable<any> {
    return this.globalService
      .post(Api.Endpoints.AUTH.LOGIN, {
        identification: data.identification,
        password: data.password,
      })
      .pipe(
        map((res) => {
          localStorage.setItem('accessToken', res.data['accessToken']);

          return res.data;
        })
      );
  }

  public isLoggedIn() {
    const token = localStorage.getItem('accessToken');
    if (token && token !== undefined) {
      return true;
    }
    return false;
  }

  public saveToken(token: any): any {
    localStorage.setItem('accessToken', token);
  }

  public getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  public logout() {
    localStorage.clear();

    this.router.navigate(['/']);
  }
}
