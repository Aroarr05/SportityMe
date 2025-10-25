import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Usuario, Rol } from '../../shared/models/usuario.model';

export interface LoginCredentials {
  email: string;
  contraseña: string;
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

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    this.loadingSubject.next(true);
    console.log('Iniciando login con BD:', { email: credentials.email });

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: AuthResponse) => {
        console.log('Login exitoso - Datos desde BD:', response.user);
        this.handleAuthentication(response);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Error en login con BD:', error);
        this.loadingSubject.next(false);
        return this.handleError(error);
      })
    );
  }

  register(userData: RegisterData): Observable<AuthResponse> {
    this.loadingSubject.next(true);
    console.log('Guardando usuario en BD:', {
      nombre: userData.nombre,
      email: userData.email
    });

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
        console.log('Usuario guardado en BD:', response.user);
        this.handleAuthentication(response);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Error guardando en BD:', error);
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

    console.log('Usuario autenticado desde BD:', response.user);
    localStorage.setItem('userData', JSON.stringify(response.user));
  }

  private loadCurrentUser(): void {
    const storedUser = localStorage.getItem('userData');
    console.log('🔄 loadCurrentUser() - storedUser:', storedUser);
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log('✅ Usuario parseado desde localStorage:', user);
        this.currentUserSubject.next(user);
        this.isLoggedInSubject.next(true);
      } catch (e) {
        console.error('Error parseando usuario cache:', e);
      }
    }

    this.http.get<Usuario>(`${this.apiUrl}/me`, {
      headers: this.getAuthHeaders()
    }).subscribe({
      next: (user) => {
        console.log('✅ Usuario cargado desde BD MySQL:', user);
        console.log('🔍 rol_id en respuesta:', user.rol_id);
        console.log('🔍 id en respuesta:', user.id);
        this.currentUserSubject.next(user);
        this.isLoggedInSubject.next(true);
        localStorage.setItem('userData', JSON.stringify(user));
      },
      error: (error) => {
        console.error('Error cargando usuario desde BD:', error);
        this.clearAuth();
      }
    });
  }

  getProfile(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/me`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(user => {
        console.log('Perfil completo desde BD:', user);
        this.currentUserSubject.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
      }),
      catchError(this.handleError)
    );
  }

  updateProfile(userData: Partial<Usuario>): Observable<Usuario> {
    console.log('Actualizando perfil en BD:', userData);

    return this.http.put<Usuario>(`${this.apiUrl}/profile`, userData, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(user => {
        console.log('Perfil actualizado en BD:', user);
        this.currentUserSubject.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    console.log('🚪 Cerrando sesión...');

    this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: this.getAuthHeaders()
    }).subscribe({
      next: () => {
        console.log('Sesión cerrada en servidor y BD');
      },
      error: (error) => {
        console.warn('Error al cerrar sesión en servidor:', error);
      },
      complete: () => {
        this.clearAuth();
      }
    });

    this.clearAuth();
  }

  private clearAuth(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.tokenSubject.next(null);
    this.loadingSubject.next(false);
    console.log('🧹 Datos de autenticación limpiados');
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getCurrentUser(): Usuario | null {
    const user = this.currentUserSubject.value;
    console.log('🔍 getCurrentUser() - Valor:', user);
    console.log('🔍 getCurrentUser() - Tipo:', typeof user);
    
    if (typeof user === 'string') {
      console.log('⚠️  currentUser es string, parseando desde localStorage...');
      try {
        const storedUser = localStorage.getItem('userData');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('✅ Usuario parseado desde localStorage:', parsedUser);
          this.currentUserSubject.next(parsedUser);
          return parsedUser;
        }
      } catch (e) {
        console.error('Error parseando usuario:', e);
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
    console.log('🔍 isAdmin() - Usuario:', user);
    console.log('🔍 isAdmin() - Tipo de usuario:', typeof user);
    
    if (typeof user === 'string') {
      console.log('❌ User es string, no objeto');
      return false;
    }
    
    if (!user) {
      console.log('❌ No hay usuario');
      return false;
    }

    if (user.nombre === 'Admin') {
      console.log('✅ Admin detectado por nombre');
      return true;
    }

    if (user.id === 1) {
      console.log('✅ Admin detectado por ID = 1');
      return true;
    }

    if (user.email === 'admin@sportifyme.com') {
      console.log('✅ Admin detectado por email');
      return true;
    }

    if (user.rol_id === 1) {
      console.log('✅ Admin detectado por rol_id');
      return true;
    }

    console.log('❌ No es admin');
    return false;
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

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Error de autenticación';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de conexión: ${error.error.message}`;
    } else {
      const status = error.status;
      const errorBody = error.error;

      console.log('Detalles del error BD:', { status, errorBody });

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

    console.error('Error de BD MySQL:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/forgot-password`, { email }).pipe(
      tap(() => console.log('Token de recuperación guardado en BD')),
      catchError(this.handleError)
    );
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, {
      token,
      newPassword
    }).pipe(
      tap(() => console.log('Contraseña actualizada en BD')),
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
      tap(() => console.log('Contraseña cambiada en BD')),
      catchError(this.handleError)
    );
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.post<{ exists: boolean }>(`${this.apiUrl}/check-email`, { email }).pipe(
      map(response => response.exists),
      tap(exists => console.log(`Verificación en BD - Email ${email} existe:`, exists)),
      catchError(this.handleError)
    );
  }

  getAllUsers(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${environment.apiUrl}/usuarios`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(users => console.log('Usuarios cargados desde BD:', users.length)),
      catchError(this.handleError)
    );
  }

  getUserById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${environment.apiUrl}/usuarios/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(user => console.log('Usuario por ID desde BD:', user)),
      catchError(this.handleError)
    );
  }

  updateLastLogin(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/update-last-login`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => console.log('Último login actualizado en BD')),
      catchError(this.handleError)
    );
  }

  getUserStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(stats => console.log('Estadísticas desde BD:', stats)),
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
      tap(roles => console.log('🎭 Roles disponibles en BD:', roles)),
      catchError(this.handleError)
    );
  }

  searchUsers(query: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${environment.apiUrl}/usuarios/search`, {
      params: { q: query },
      headers: this.getAuthHeaders()
    }).pipe(
      tap(users => console.log('🔍 Resultados búsqueda BD:', users)),
      catchError(this.handleError)
    );
  }
}