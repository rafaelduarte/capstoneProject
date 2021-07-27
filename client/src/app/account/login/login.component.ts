import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { windowWhen } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/auth/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  readonly API_URL = 'http://localhost:3000/api';
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: '',
      password: '',
    });
  }

  login(): void {
    let email = this.form.controls['email'].value;
    let password = this.form.controls['password'].value;
    if (email && password) {
      this.authService.login(email, password);
      this.router.navigateByUrl('/');
    }
  }
}
