import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

export const InterceptorSkip = 'X-Skip-Interceptor';
//Custom header for filtering out routes which dosen't require token authorization.
//Add the header to any routes which doesn't need any authorization to access.
export const InterceptorSkipHeader = new HttpHeaders({
  'X-Skip-Interceptor': '',
});

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken: any = this.authService.getToken();
    //console.log(typeof authToken);

    //Check header for InterceptorSkipHeader
    //InterceptorSkipHeader checks if the requested route needs token authorization
    if (req.headers.has(InterceptorSkip)) {
      const headers = req.headers.delete(InterceptorSkip);
      return next.handle(req.clone({ headers }));
    }

    if (!authToken) {
      console.log('No Token Found');
      this.router.navigateByUrl('/login');
    }
    const authRequest = req.clone({
      setHeaders: {
        'auth-token': authToken,
      },
    });
    return next.handle(authRequest);
  }
}
