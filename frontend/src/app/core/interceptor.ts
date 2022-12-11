import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';

@Injectable()
export class Interceptor implements HttpInterceptor {
  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(httpRequest).pipe(
      tap((event: HttpEvent<any>) => {}),
      catchError((err) => {
        switch (err.status) {
          case 401:
            localStorage.removeItem('token');
        }
        throw err;
      })
    );
  }
}
