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
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(
    private toastMessage: MatSnackBar,
    private translate: TranslateService
  ) {}
  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(httpRequest).pipe(
      tap((event: any) => {
        if (event?.body?.message) {
          const message = this.translate.instant(event.body.message);
          const action = this.translate.instant('common.buttons.close');
          this.toastMessage.open(message, action, {
            panelClass: ['mat-toolbar', 'mat-warn'],
          });
        }
      }),
      catchError((err) => {
        switch (err.status) {
          case 401:
            localStorage.removeItem('token');
        }
        if (err.error.message) {
          const message = this.translate.instant(err.error.message);
          const action = this.translate.instant('common.buttons.close');
          this.toastMessage.open(message, action, {
            panelClass: ['mat-toolbar', 'mat-warn'],
          });
        }
        throw err;
      })
    );
  }
}
