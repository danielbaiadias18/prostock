import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  public static lastRoute: string;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private modal: BsModalService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          if (!err.error)
            // auto logout if 401 response returned from api
            this.relogin();
          else {
            let body: iUnauthorized = err.error;
            if (body.needLogin) this.relogin();
            else {
              this.router.navigate(['/401']);
            }
          }
        } else if (err.status && err.status != 400) {
          ErrorInterceptor.lastRoute = this.router.url;
          this.router.navigate(['/erro']);
        }

        // const error = err.error.message || err.statusText;
        return throwError(err);
      })
    );
  }

  relogin() {
    this.authenticationService.logout();
    location.reload(true);
  }
}

interface iUnauthorized {
  needLogin: boolean;
}
