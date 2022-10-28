import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, GlobalService } from 'src/app/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public year = new Date().getFullYear();

  public loading = false;
  public loginForm!: FormGroup;
  public userInfo: any;

  constructor(
    private formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly globalService: GlobalService,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.logout();
  }

  get f() {
    return this.loginForm.controls;
  }

  public onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe(
      (res) => {
        this.loading = false;
        if (res.user === false) {
          this.router.navigateByUrl('/admin');
        } else {
          this.router.navigateByUrl('/admin/reports');
        }
      },
      (err: any) => {
        this.globalService.onMessage(err.error.code, err.error.error);
        this.loading = false;
      }
    );
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      identification: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  private logout() {
    this.authService.logout();
  }
}
