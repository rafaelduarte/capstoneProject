import { HttpClient } from '@angular/common/http';
import { ConditionalExpr } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { CustomvalidationService } from 'src/app/services/customvalidation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  userNameExists!: boolean;
  emailExists!: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthenticationService,
    private customValidator: CustomvalidationService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        password: [
          '',
          Validators.compose([
            Validators.required,
            this.customValidator.patternValidator(),
          ]),
        ],
        confirmPassword: ['', Validators.required],
        dob: [''],
        bio: ['', [Validators.required]],
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

  submit(): void {
    //console.log(this.form.getRawValue());
    this.authService.register(this.form.value).subscribe(
      (user) => {
        console.log(this.authService.error);
        //console.log('this is subscribed in component ', user);
        if (this.authService.isRegistered) {
          this.router.navigateByUrl('/login');
        }
      },
      (error) => {
        if (this.stringSearch(this.authService.error, 'username')) {
          this.userNameExists = true;
        } else if (
          this.stringSearch(this.authService.error, 'email') &&
          this.stringSearch(this.authService.error, 'exists')
        ) {
          this.emailExists = true;
        }
      }
    );
  }

  public stringSearch(string: string, stringWord: string) {
    new RegExp('\\b' + stringWord + '\\b', 'i').test(string);
    return true;
  }
}
