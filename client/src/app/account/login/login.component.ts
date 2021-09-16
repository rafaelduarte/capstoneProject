import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { windowWhen } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { CustomvalidationService } from 'src/app/services/customvalidation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthenticationService,
    private customValidator: CustomvalidationService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: '',
    });
  }

  get loginFormControls() {
    return this.form.controls;
  }

  login(): void {
    let email = this.form.controls['email'].value;
    let password = this.form.controls['password'].value;
    let rememberMe = this.form.controls['rememberMe'].value;
    console.log('This is log for remember ME', rememberMe);
    if (email && password) {
      if (rememberMe) {
        this.authService.login(email, password, rememberMe);
        console.warn('User pressed remember ME');
      } else {
        this.authService.login(email, password);
      }

      this.router.navigateByUrl('/');
    }
  }
}
