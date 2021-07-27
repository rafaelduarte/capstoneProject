import { HttpClient, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Subject, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { User } from '../models/user.model';
import { error } from '@angular/compiler/src/util';

interface userDto {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  TOKEN_KEY = 'auth-token';
  private user$ = new Subject<User>();
  private server_route = 'http://localhost:3000';

  private token!: string;
  public isLoggedIn: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    public jwtHelper: JwtHelperService
  ) {}

  private setUser(user: User) {
    this.user$.next(user);
  }

  public getToken() {
    window.localStorage.getItem(this.TOKEN_KEY);
    return this.token;
  }

  private setToken(token: string) {
    window.localStorage.setItem(this.TOKEN_KEY, token);
  }

  private clearAuthData() {
    window.localStorage.removeItem(this.TOKEN_KEY);
  }

  public login(email: string, password: string) {
    const loginCredentials = { email, password };
    //console.log('login credentials', loginCredentials);
    return this.http
      .post<userDto>(`${this.server_route}/api/users/login`, loginCredentials)
      .pipe(
        switchMap(({ user, token }) => {
          this.clearAuthData();
          this.setUser(user);
          this.setToken(token);
          //console.log('user found', user.username);
          //console.log('Token: ', token);
          this.isLoggedIn = true;
          return of(user);
        })
        // catchError((err) => {
        //   console.log(
        //     'Your login details could not be verified. Please try again',
        //     err
        //   );
        //   return throwError(
        //     'Your login details could not be verified. Please try again'
        //   );
        // })
      )
      .subscribe(
        (res) => {
          this.getUserName();
        },
        (err) => {
          console.log(err);
        }
      );
  }

  public getUser() {
    const token: any = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      let payload = window.atob(token.split('.')[1]);
      //console.log(JSON.parse(payload).name);
      return JSON.parse(payload);
    } else {
      return 'Please Sign IN';
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

  public register(user: any) {
    return this.http
      .post<any>(this.server_route + '/users/register', user)
      .pipe(
        switchMap((savedUser) => {
          this.setUser(savedUser);
          //console.log('User registered successfully', savedUser);
          return of(savedUser);
        }),
        catchError((e) => {
          //console.log('Server error occured', e);
          return throwError('Registration failed please contact admin');
        })
      );
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