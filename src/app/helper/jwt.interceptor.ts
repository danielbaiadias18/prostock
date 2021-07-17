import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    let currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.Token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.Token}`
        }
      });
    }

    return next.handle(request);
  }
}
