import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthenticationService) {}
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      console.log('Bye');
      this.router.navigateByUrl('/login');
      return false;
    }
    console.log('Welcome');
    return true;
  }
}
