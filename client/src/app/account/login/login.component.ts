import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { CustomvalidationService } from 'src/app/services/customvalidation.service';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { stringify } from 'querystring';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  //Icons
  faCross = faTimesCircle;

  form!: FormGroup;
  isFieldIncorrect: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private registerComponent: RegisterComponent,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get loginFormControls() {
    return this.form.controls;
  }

  login(): void {
    let email = this.form.controls['email'].value;
    let password = this.form.controls['password'].value;
    if (email && password) {
      this.authService.login(email, password).subscribe(
        (res) => {
          if (res) {
            this.router.navigateByUrl('/');
          }
        },
        (error) => {
          if (error) {
            this.isFieldIncorrect = true;
            this.registerComponent.stringSearch(error, 'credentials');
          }
          this.isFieldIncorrect ? null : this.router.navigateByUrl('/');
        }
      );
    }
  }
}
