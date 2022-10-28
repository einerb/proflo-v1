import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';
import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Api } from '../utils/api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private httpOptions;

  constructor(private httpClient: HttpClient, private router: Router) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: '',
      }),
    };
  }

  /**
   * @description Manejo de errores en las peticiones.
   */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 400) {
      Swal.fire({
        title: `Fallo de operación`,
        text: error.error?.message[0],
        icon: 'error',
        confirmButtonText: 'Ok',
        allowOutsideClick: false,
      });
    }

    if (!Api.PRODUCTION) {
      console.error(error);
    }

    return throwError({
      code: error.statusText,
      message: error.error.message ? error.error.message : error.error.message,
      handleError: true,
      error: error.error,
    });
  }

  /**
   * @description Obtener token de autententication
   * @returns String
   */
  public getToken() {
    return localStorage.getItem('accessToken');
  }

  public getDecodedToken() {
    return jwt_decode("localStorage.getItem('accessToken')");
  }

  /**
   * @description Obtener cabecera por defecto
   * @return HttpHeaders {any}
   */
  getHeader() {
    const token = 'Bearer ' + this.getToken();
    // this.httpOptions.headers.Authorization = token;
    return this.httpOptions;
  }

  /**
   * @description Peticiones por el metodo post
   * @param url string
   * @param data Object
   * @param header? HttpHeaders
   * @return Observable
   */
  post(url: string, data?: any, headerOptions?: any): Observable<any> {
    return this.httpClient
      .post(url, data, headerOptions ? headerOptions : this.getHeader())
      .pipe(catchError(this.handleError));
  }

  /**
   * @description Peticiones por el metodo GET
   * @param url string
   * @param header? HttpHeaders
   * @return Observable
   */
  get(url: string, headerOptions?: any): Observable<any> {
    return this.httpClient
      .get(url, headerOptions ? headerOptions : this.getHeader())
      .pipe(catchError(this.handleError));
  }

  /**
   * @description Peticiones por el metodo PUT
   * @param url string
   * @param header? HttpHeaders
   * @return Observable
   */
  put(url: string, data?: any, headerOptions?: any): Observable<any> {
    return this.httpClient
      .put(url, data, headerOptions ? headerOptions : this.getHeader())
      .pipe(catchError(this.handleError));
  }

  /**
   * @description Peticiones por el metodo DEL
   * @param url string
   * @param header? HttpHeaders
   * @return Observable
   */
  delete(url: string, headerOptions?: any): Observable<any> {
    return this.httpClient
      .delete(url, headerOptions ? headerOptions : this.getHeader())
      .pipe(catchError(this.handleError));
  }

  public onMessage(code: number, msg: string) {
    let codeOut = code > 1000 ? true : false;

    Swal.fire({
      title: codeOut ? `Operación exitosa` : `Fallo de operación`,
      text: msg,
      icon: codeOut ? 'success' : 'error',
      confirmButtonText: 'Ok',
      allowOutsideClick: false,
    });
  }
}
