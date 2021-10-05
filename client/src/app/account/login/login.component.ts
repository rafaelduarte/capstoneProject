import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { CustomvalidationService } from 'src/app/services/customvalidation.service';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  isPasswordIncorrect: boolean = false;
  isEmailIncorrect: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthenticationService,
    private customValidator: CustomvalidationService,
    private registerComponent: RegisterComponent
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
      this.authService.login(email, password).subscribe((error) => {
        if (
          this.registerComponent.stringSearch(this.authService.error, 'email')
        ) {
          this.isEmailIncorrect = true;
        } else if (
          this.registerComponent.stringSearch(
            this.authService.error,
            'password'
          )
        ) {
          this.isPasswordIncorrect = true;
        }
      });

      this.router.navigateByUrl('/');
    }
  }
}
