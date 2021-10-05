import { HttpClient, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Subject, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { User } from '../models/user.model';
import { error } from '@angular/compiler/src/util';
import { InterceptorSkipHeader } from './auth-interceptor.service';

interface userDto {
  user: User;
  token: string;
}

interface newUser {
  email: string;
  name: string;
  password: string;
  username: string;
  bio: string;
  date_of_birth: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  TOKEN_KEY = 'auth-token';
  private user$ = new Subject<User>();
  private server_route = 'http://localhost:3000';

  private token?: string;
  public isLoggedIn: boolean = false;
  public isRegistered: boolean = false;
  public error: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    public jwtHelper: JwtHelperService
  ) {}

  private setUser(user: User) {
    this.user$.next(user);
  }

  public getToken() {
    let tmpToken = window.localStorage.getItem(this.TOKEN_KEY);
    if (tmpToken) {
      this.token = tmpToken;
      //console.log(typeof tmpToken);
    }
    return this.token;
  }

  private setToken(token: string) {
    window.localStorage.setItem(this.TOKEN_KEY, token);
  }

  private clearAuthData() {
    window.localStorage.removeItem(this.TOKEN_KEY);
  }

  public login(email: string, password: string, rememberMe?: boolean) {
    const loginCredentials = { email, password };
    //console.log('login credentials', loginCredentials);
    return this.http
      .post<userDto>(`${this.server_route}/api/users/login`, loginCredentials, {
        headers: InterceptorSkipHeader,
      })
      .pipe(
        switchMap(({ user, token }) => {
          this.clearAuthData();
          this.setUser(user);
          this.setToken(token);
          //console.log('This is authservice remmberMe: ', rememberMe);
          //console.log('user found', user.name);
          //console.log('Token: ', token);

          // const now = new Date();
          // now.setDate(now.getDate() + 1);
          // if (rememberMe) {
          //   const expiryDate = now.getTime() / 1000;
          //   console.log('this is the expiry date: ', expiryDate);
          // }
          this.isLoggedIn = true;
          return of(user);
        })
      );
  }

  public register(user: any) {
    console.log(user);
    return this.http
      .post(`${this.server_route}/api/users/register`, user, {
        headers: InterceptorSkipHeader,
      })
      .pipe(
        switchMap((savedUser) => {
          //console.log('This is savedUser', savedUser);
          //console.log('This is the type of savedUser', typeof savedUser);
          this.isRegistered = true;
          //console.log('Is user registered yet? - ', this.isRegistered);
          return of(savedUser);
        }),
        catchError((e) => {
          this.error = e.error;
          console.log('Server Error log: ', this.error);
          return throwError('Registration failed, please contact admin');
        })
      );
  }

  public getUser() {
    const token: any = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      let payload = window.atob(token.split('.')[1]);
      //console.log(JSON.parse(payload).name);
      return JSON.parse(payload);
    } else {
      return 'Please Sign In';
    }
  }

  public getUserName() {
    const user = this.getUser();
    if (user) {
      //console.log(user.name);
      return user.name;
    } else {
      return 'Please Sign In';
    }
  }

  public getUserId() {
    const user = this.getUser();
    if (user) {
      return user._id;
    } else {
      return 'Please Sign In';
    }
  }

  //SignOut User
  public logout() {
    this.clearAuthData();
    //onsole.log('User logged out successfully');
    window.location.reload();
    this.router.navigateByUrl('/');
  }

  //Checks Whether user is logged In and Authenticated
  public isAuthenticated(): boolean {
    const token: any = localStorage.getItem('auth-token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}
