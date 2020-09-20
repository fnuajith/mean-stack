import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { AuthData } from './authData.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiURL + '/user/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private isAuthenticated = false;
  private userId: string;
  private tokenTimer: number;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getToken(): string {
    return this.token;
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getUserId(): string {
    return this.userId;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string): void {
    const authData: AuthData = {email: email, password: password};
    this.http.post(BACKEND_URL + 'signup', authData)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['/']);
      }, error => {
        console.log(error);
        this.authStatusListener.next(false);
      });
  }

  login(email: string, password: string): void {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, expiresInSeconds: number, userId: string}>(BACKEND_URL + 'login', authData)
      .subscribe(response => {
        const token = response.token;
        const expiresInSeconds = response.expiresInSeconds;
        this.token = token;
        if (token) {
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          this.setAuthTimer(expiresInSeconds);
          const expiresAtDate = new Date((new Date()).getTime() + expiresInSeconds * 1000);
          this.saveAuthData(token, expiresAtDate, this.userId);
          this.router.navigate(['/']);
        }
      }, error => {
        console.log(error);
        this.authStatusListener.next(false);
      });
  }

  autoAuthUser(): void {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const expiresIn = authInformation.expiresAt.getTime() - (new Date()).getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.authStatusListener.next(true);
      const expiresInSeconds = expiresIn / 1000;
      this.setAuthTimer(expiresInSeconds);
    }
  }

  logout(): void {
    this.isAuthenticated = false;
    this.token = null;
    this.userId = null;
    this.authStatusListener.next(false);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number): void {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expiresAt: Date, userId: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expiresAt', expiresAt.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('userId');
  }

  private getAuthData(): {token: string, expiresAt: Date, userId: string} {
    const token = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('expiresAt');
    const userId = localStorage.getItem('userId');
    if (!token || !expiresAt) {
      return;
    }
    return {
      token: token,
      expiresAt: new Date(expiresAt),
      userId: userId
    };
  }
}
