import { HttpClient } from '@angular/common/http';
import { ConditionalExpr } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { CustomvalidationService } from 'src/app/services/customvalidation.service';
import { faCheckCircle as fasCheck } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  //Icons
  faCross = faTimesCircle;
  fasCheck = fasCheck;

  form!: FormGroup;
  isEmpty!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private customValidator: CustomvalidationService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        name: ['', Validators.required],
        email: [
          '',
          {
            Validators: [Validators.required, Validators.email],
            asyncValidators: [
              this.customValidator.emailExistsValidator(this.authService),
            ],
          },
        ],
        username: [
          '',
          {
            validators: [Validators.required],
            asyncValidators: [
              this.customValidator.usernameExistsValidator(this.authService),
            ],
          },
        ],
        password: [
          '',
          {
            validators: [
              Validators.required,
              this.customValidator.patternValidator(),
            ],
          },
        ],
        confirmPassword: ['', Validators.required],
        birthday: [''],
        bio: [''],
      },
      {
        validator: this.customValidator.MatchPassword(
          'password',
          'confirmPassword'
        ),
      }
    );
  }

  get registerFormControl() {
    return this.form.controls;
  }

  get passwordValue() {
    return this.registerFormControl.password.value;
  }

  submit(): void {
    if (this.form.invalid) {
      this.isEmpty = true;
    }
    if (!this.isEmpty) {
      this.authService.register(this.form.value).subscribe(
        (user) => {
          console.error(this.authService.error);
          //console.log('this is subscribed in component ', user);
          if (this.authService.isRegistered) {
            this.router.navigateByUrl('/login');
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  public stringSearch(string: string, stringWord: string) {
    return RegExp('\b' + stringWord + '\b', 'i').test(string);
  }
}
