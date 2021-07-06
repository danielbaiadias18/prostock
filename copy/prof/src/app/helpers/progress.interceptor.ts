import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoadingProgressService } from '../custom-components/loading-bar/loading-bar.component';

@Injectable()
export class ProgressInterceptor implements HttpInterceptor {

  constructor(private progress: LoadingProgressService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.reportProgress) {
      // only intercept when the request is configured to report its progress
      return next.handle(req).pipe(
        tap((event: HttpEvent<any>) => {

          if (event.type === HttpEventType.UploadProgress) {
            // here we get the updated progress values, call your service or what ever here
            this.progress.currentProgress = Math.round(event.loaded / event.total * 100);
          } else if (event.type === HttpEventType.Response) {
            this.progress.currentProgress = null;
          }
        }, error => {
          this.progress.currentProgress = null;
        })
      );
    } else {
      return next.handle(req);
    }
  }
}
