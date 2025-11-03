import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Usuario, Rol } from '../../shared/models/usuario.model';

export interface LoginCredentials {
  email: string;
  password: string; 
}

export interface RegisterData {
  nombre: string;
  email: string;
  contraseña: string;
  confirmPassword?: string;
  avatar_url?: string;
  biografia?: string;
  ubicacion?: string;
  fecha_nacimiento?: string;
  genero?: 'MASCULINO' | 'FEMENINO' | 'OTRO' | 'NO_ESPECIFICADO';
  peso?: number;
  altura?: number;
}

export interface AuthResponse {
  token: string;
  user: Usuario;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  private tokenSubject = new BehaviorSubject<string | null>(this.getToken());
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private initializeAuth(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      this.loadCurrentUser();
    } else {
      this.clearAuth();
    }
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = payload.exp * 1000;
      return Date.now() > expiration;
    } catch (error) {
      return true;
    }
  }

  register(userData: RegisterData): Observable<AuthResponse> {
    this.loadingSubject.next(true);

    const userForDB = {
      nombre: userData.nombre,
      email: userData.email,
      contraseña: userData.contraseña,
      rol_id: 2,
      avatar_url: userData.avatar_url || null,
      biografia: userData.biografia || null,
      ubicacion: userData.ubicacion || null,
      fecha_nacimiento: userData.fecha_nacimiento || null,
      genero: userData.genero || null,
      peso: userData.peso || null,
      altura: userData.altura || null
    };

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userForDB).pipe(
      tap((response: AuthResponse) => {
        this.handleAuthentication(response);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return this.handleError(error);
      })
    );
  }

  private handleAuthentication(response: AuthResponse): void {
    localStorage.setItem('authToken', response.token);
    this.tokenSubject.next(response.token);
    this.currentUserSubject.next(response.user);
    this.isLoggedInSubject.next(true);
    localStorage.setItem('userData', JSON.stringify(response.user));
  }

  private loadCurrentUser(): void {
    const storedUser = localStorage.getItem('userData');

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        this.isLoggedInSubject.next(true);
      } catch (e) {
        // Silently handle parse error
      }
    }

    this.http.get<Usuario>(`${this.apiUrl}/me`, {
      headers: this.getAuthHeaders()
    }).subscribe({
      next: (user) => {
        this.currentUserSubject.next(user);
        this.isLoggedInSubject.next(true);
        localStorage.setItem('userData', JSON.stringify(user));
      },
      error: () => {
        this.clearAuth();
      }
    });
  }

  getProfile(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/me`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
      }),
      catchError(this.handleError)
    );
  }

  updateProfile(userData: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/profile`, userData, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
      }),
      catchError(this.handleError)
    );
  }

  logout(): Observable<any> {
    const token = this.getToken();

    this.clearAuth();

    if (!token) {
      return new Observable(subscriber => {
        subscriber.next(null);
        subscriber.complete();
      });
    }

    return this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(() => {
        return new Observable(subscriber => {
          subscriber.next(null);
          subscriber.complete();
        });
      })
    );
  }

  private clearAuth(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.tokenSubject.next(null);
    this.loadingSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getCurrentUser(): Usuario | null {
    const user = this.currentUserSubject.value;

    if (typeof user === 'string') {
      try {
        const storedUser = localStorage.getItem('userData');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          this.currentUserSubject.next(parsedUser);
          return parsedUser;
        }
      } catch (e) {
        return null;
      }
      return null;
    }

    return user;
  }

  updateCurrentUser(user: Usuario): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  hasRole(role: Rol | string): boolean {
    const user = this.getCurrentUser();

    if (typeof role === 'string' && Object.values(Rol).includes(role as Rol)) {
      const roleId = role === Rol.ADMIN ? 1 : 2;
      return user?.rol_id === roleId;
    }
    return false;
  }

  hasAnyRole(roles: (Rol | string)[]): boolean {
    const user = this.getCurrentUser();
    return roles.some(role => {
      if (typeof role === 'string' && Object.values(Rol).includes(role as Rol)) {
        const roleId = role === Rol.ADMIN ? 1 : 2;
        return user?.rol_id === roleId;
      }
      return false;
    });
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();

    if (typeof user === 'string' || !user) {
      return false;
    }

    return user.nombre === 'Admin' ||
      user.id === 1 ||
      user.email === 'admin@sportifyme.com' ||
      user.rol_id === 1;
  }

  isModerador(): boolean {
    return false;
  }

  isUsuario(): boolean {
    const user = this.getCurrentUser();
    return user?.rol_id === 2;
  }

  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  getRoleName(rolId: number): string {
    switch (rolId) {
      case 1: return Rol.ADMIN;
      case 2: return Rol.USUARIO;
      default: return 'DESCONOCIDO';
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    this.loadingSubject.next(true);

    const loginData = {
      email: credentials.email,
      password: credentials.password 
    };

    console.log('Credenciales enviadas al backend:', loginData);
    console.log('Email:', loginData.email);
    console.log('Password:', loginData.password);
    console.log('Tipo de password:', typeof loginData.password);
    console.log('Longitud password:', loginData.password?.length);


    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData).pipe(
      tap((response: AuthResponse) => {
        console.log('Respuesta del login:', response);
        this.handleAuthentication(response);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Error completo del login:', error);
        console.error('Status:', error.status);
        console.error('Mensaje:', error.message);
        console.error('Error body:', error.error);
        this.loadingSubject.next(false);
        return this.handleError(error);
      })
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Error de autenticación';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de conexión: ${error.error.message}`;
    } else {
      const status = error.status;
      const errorBody = error.error;

      if (errorBody && typeof errorBody === 'object') {
        if (errorBody.errors) {
          const validationErrors = errorBody.errors.map((err: any) => err.defaultMessage).join(', ');
          errorMessage = `Errores de validación: ${validationErrors}`;
        } else if (errorBody.message) {
          errorMessage = errorBody.message;
        } else if (errorBody.error) {
          errorMessage = errorBody.error;
        }
      } else if (typeof errorBody === 'string') {
        try {
          const parsedError = JSON.parse(errorBody);
          errorMessage = parsedError.message || parsedError.error || errorMessage;
        } catch (e) {
          errorMessage = errorBody || errorMessage;
        }
      }

      switch (status) {
        case 0:
          errorMessage = 'Error de conexión con la base de datos. Verifica tu conexión.';
          break;
        case 400:
          errorMessage = errorMessage || 'Datos inválidos para la base de datos.';
          break;
        case 401:
          errorMessage = errorMessage || 'Credenciales inválidas en la base de datos.';
          break;
        case 403:
          errorMessage = errorMessage || 'Acceso denegado a los recursos.';
          break;
        case 404:
          errorMessage = errorMessage || 'Usuario no encontrado en la base de datos.';
          break;
        case 409:
          errorMessage = errorMessage || 'El email ya existe en la base de datos.';
          break;
        case 422:
          errorMessage = errorMessage || 'Datos de entrada inválidos para la BD.';
          break;
        case 500:
          if (errorMessage.includes('ConstraintViolation') || errorMessage.includes('Duplicate entry')) {
            errorMessage = 'El email ya está registrado en la base de datos.';
          } else if (errorMessage.includes('SQL') || errorMessage.includes('database')) {
            errorMessage = 'Error en la base de datos. Por favor, intenta más tarde.';
          } else {
            errorMessage = 'Error interno del servidor de base de datos.';
          }
          break;
        case 502:
          errorMessage = 'Servidor de base de datos no disponible.';
          break;
        case 503:
          errorMessage = 'Base de datos en mantenimiento.';
          break;
        default:
          errorMessage = errorMessage || `Error del servidor (${status})`;
          break;
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/forgot-password`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, {
      token,
      newPassword
    }).pipe(
      catchError(this.handleError)
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/change-password`, {
      currentPassword,
      newPassword
    }, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.post<{ exists: boolean }>(`${this.apiUrl}/check-email`, { email }).pipe(
      map(response => response.exists),
      catchError(this.handleError)
    );
  }

  getAllUsers(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${environment.apiUrl}/usuarios`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getUserById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${environment.apiUrl}/usuarios/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateLastLogin(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/update-last-login`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getUserStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  checkAuthStatus(): Observable<boolean> {
    return this.http.get<{ authenticated: boolean }>(`${this.apiUrl}/status`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.authenticated),
      tap(authenticated => {
        if (!authenticated) {
          this.clearAuth();
        }
      }),
      catchError(error => {
        this.clearAuth();
        return throwError(() => error);
      })
    );
  }

  getAvailableRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/roles`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  searchUsers(query: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${environment.apiUrl}/usuarios/search`, {
      params: { q: query },
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }
}