import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(body: any): Observable<any> {
    return this.http.post('api/login', body);
  }

  logout(): Observable<any> {
    return this.http.post('api/logout', {});
  }

  register(body: any): Observable<any> {
    return this.http.post('api/register', body);
  }
}
