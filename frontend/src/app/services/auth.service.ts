import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, AuthResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenSubject = new BehaviorSubject<string | null>(this.getTokenFromStorage());
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(username: string, email: string, password: string, role: string = 'Employee'): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
      username,
      email,
      password,
      role,
    }).pipe(
      map(response => {
        if (response.token) {
          this.storeToken(response.token);
          this.storeUser(response.user);
          this.currentUserSubject.next(response.user);
          this.tokenSubject.next(response.token);
        }
        return response;
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      map(response => {
        if (response.token) {
          this.storeToken(response.token);
          this.storeUser(response.user);
          this.currentUserSubject.next(response.user);
          this.tokenSubject.next(response.token);
        }
        return response;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  getAllUsers(role?: string): Observable<any> {
    let url = `${this.apiUrl}/users`;
    if (role) {
      url += `?role=${role}`;
    }
    return this.http.get(url);
  }

  assignTeamMembers(userId: string, teamMemberIds: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign-team-members`, { userId, teamMemberIds });
  }

  private storeToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private getTokenFromStorage(): string | null {
    return localStorage.getItem('token');
  }

  private storeUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return this.getTokenFromStorage();
  }

  isAuthenticated(): boolean {
    return !!this.getTokenFromStorage();
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}
