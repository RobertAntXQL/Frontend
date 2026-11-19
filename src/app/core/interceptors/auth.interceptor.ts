import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const isBackend = req.url.startsWith(`${environment.apiUrl}/api/`);
  const isLogin = req.url.includes('/api/auth/login');
  const token = auth.getToken();
  const request = isBackend && !isLogin && token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (isBackend && !isLogin && error.status === 401) {
        auth.logoutAndRedirect();
      }
      return throwError(() => error);
    })
  );
};
