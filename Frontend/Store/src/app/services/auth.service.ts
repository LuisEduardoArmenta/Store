import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
  fechaNacimiento?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  usuario: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/auth';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('currentUser');
    let parsedUser = null;
    
    try {
      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        parsedUser = JSON.parse(savedUser);
      }
    } catch (error) {
      console.warn('Error parsing saved user from localStorage:', error);
      // Limpiar localStorage si hay datos corruptos
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
    
    this.currentUserSubject = new BehaviorSubject<User | null>(parsedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    return !!this.currentUserValue && !!this.getToken();
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getHttpOptions() {
    const token = this.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      })
    };
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        map(response => {
          // Guardar usuario y token en localStorage
          localStorage.setItem('currentUser', JSON.stringify(response.usuario));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.usuario);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        map(response => {
          // Después del registro, también logear automáticamente
          localStorage.setItem('currentUser', JSON.stringify(response.usuario));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.usuario);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    // Eliminar datos del localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  // Método para limpiar localStorage corrupto
  clearStorage(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    console.log('localStorage cleared');
  }

  // Método para verificar si el token es válido
  verifyToken(): Observable<boolean> {
    if (!this.getToken()) {
      return throwError('No token found');
    }

    return this.http.get(`${this.API_URL}/verify`, this.getHttpOptions())
      .pipe(
        map(() => true),
        catchError(() => {
          this.logout();
          return throwError('Token invalid');
        })
      );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado';
    
    if (error.error) {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error.message) {
        errorMessage = error.error.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('Error en AuthService:', error);
    return throwError(errorMessage);
  }
}
