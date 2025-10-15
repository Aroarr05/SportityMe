import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Usuario, Rol } from '../../shared/models/usuario.model';

// Interfaces para autenticación - ALINEADAS CON TU BD
export interface LoginCredentials {
  email: string;
  contraseña: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  contraseña: string;
  confirmPassword?: string;
  // Campos opcionales de tu BD
  avatarUrl?: string;
  biografia?: string;
  ubicacion?: string;
  fechaNacimiento?: string;
  genero?: 'masculino' | 'femenino' | 'otro' | 'no_especificado';
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

  // Propiedades públicas como observables
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable(); // ✅ SOLO UNA DEFINICIÓN

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  /**
   * Headers con autenticación para requests protegidos
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Inicializa el estado de autenticación al cargar el servicio
   */
  private initializeAuth(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      this.loadCurrentUser();
    } else {
      this.clearAuth();
    }
  }

  /**
   * Verifica si existe un token en localStorage
   */
  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Obtiene el token del localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Verifica si el token está expirado
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = payload.exp * 1000;
      return Date.now() > expiration;
    } catch (error) {
      return true;
    }
  }

  /**
   * Login de usuario - CONECTADO A TU BD MYSQL
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    this.loadingSubject.next(true);
    console.log('🔐 Iniciando login con BD:', { email: credentials.email });
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: AuthResponse) => {
        console.log('✅ Login exitoso - Datos desde BD:', response.user);
        this.handleAuthentication(response);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('❌ Error en login con BD:', error);
        this.loadingSubject.next(false);
        return this.handleError(error);
      })
    );
  }

  /**
   * Registro de nuevo usuario - GUARDADO EN TU BD MYSQL
   */
  register(userData: RegisterData): Observable<AuthResponse> {
    this.loadingSubject.next(true);
    console.log('📝 Guardando usuario en BD:', { 
      nombre: userData.nombre, 
      email: userData.email 
    });
    
    // Preparar datos para tu BD MySQL
    const userForDB = {
      nombre: userData.nombre,
      email: userData.email,
      contraseña: userData.contraseña, // Se encriptará en el backend
      // Campos con valores por defecto según tu BD
      rol: 'usuario', // Valor por defecto de tu BD
      fecha_registro: new Date().toISOString(),
      // Campos opcionales
      avatar_url: userData.avatarUrl || null,
      biografia: userData.biografia || null,
      ubicacion: userData.ubicacion || null,
      fecha_nacimiento: userData.fechaNacimiento || null,
      genero: userData.genero || null,
      peso: userData.peso || null,
      altura: userData.altura || null
    };
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userForDB).pipe(
      tap((response: AuthResponse) => {
        console.log('✅ Usuario guardado en BD:', response.user);
        this.handleAuthentication(response);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('❌ Error guardando en BD:', error);
        this.loadingSubject.next(false);
        return this.handleError(error);
      })
    );
  }

  /**
   * Maneja la respuesta de autenticación exitosa
   */
  private handleAuthentication(response: AuthResponse): void {
    // Guardar token en localStorage
    localStorage.setItem('authToken', response.token);
    
    // Actualizar subjects
    this.tokenSubject.next(response.token);
    this.currentUserSubject.next(response.user);
    this.isLoggedInSubject.next(true);
    
    console.log('👤 Usuario autenticado desde BD:', response.user);
    
    // Guardar datos del usuario en localStorage para recuperación rápida
    localStorage.setItem('userData', JSON.stringify(response.user));
  }

  /**
   * Carga el usuario actual desde tu BD MySQL
   */
  private loadCurrentUser(): void {
    // Primero intentar cargar desde cache
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        this.isLoggedInSubject.next(true);
        console.log('👤 Usuario cargado desde cache:', user.nombre);
      } catch (e) {
        console.error('Error parseando usuario cache:', e);
      }
    }

    // Siempre cargar datos frescos desde la BD
    this.http.get<Usuario>(`${this.apiUrl}/me`, { 
      headers: this.getAuthHeaders() 
    }).subscribe({
      next: (user) => {
        console.log('👤 Usuario cargado desde BD MySQL:', user);
        this.currentUserSubject.next(user);
        this.isLoggedInSubject.next(true);
        localStorage.setItem('userData', JSON.stringify(user));
      },
      error: (error) => {
        console.error('❌ Error cargando usuario desde BD:', error);
        this.clearAuth();
      }
    });
  }

  /**
   * Obtiene el perfil completo del usuario desde la BD
   */
  getProfile(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/me`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      tap(user => {
        console.log('📋 Perfil completo desde BD:', user);
        this.currentUserSubject.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza el perfil del usuario en la BD
   */
  updateProfile(userData: Partial<Usuario>): Observable<Usuario> {
    console.log('✏️ Actualizando perfil en BD:', userData);
    
    return this.http.put<Usuario>(`${this.apiUrl}/profile`, userData, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      tap(user => {
        console.log('✅ Perfil actualizado en BD:', user);
        this.currentUserSubject.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    console.log('🚪 Cerrando sesión...');
    
    // Llamar al backend para actualizar último login en BD
    this.http.post(`${this.apiUrl}/logout`, {}, { 
      headers: this.getAuthHeaders() 
    }).subscribe({
      next: () => {
        console.log('✅ Sesión cerrada en servidor y BD');
      },
      error: (error) => {
        console.warn('⚠️ Error al cerrar sesión en servidor:', error);
      },
      complete: () => {
        this.clearAuth();
      }
    });
    
    this.clearAuth();
  }

  /**
   * Limpia todos los datos de autenticación
   */
  private clearAuth(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.tokenSubject.next(null);
    this.loadingSubject.next(false);
    console.log('🧹 Datos de autenticación limpiados');
  }

  /**
   * Verifica si el usuario está autenticado (método síncrono)
   */
  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  /**
   * Obtiene el usuario actual (síncrono)
   */
  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  /**
   * Actualiza los datos del usuario actual
   */
  updateCurrentUser(user: Usuario): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: Rol | string): boolean {
    const user = this.getCurrentUser();
    return user?.rol === role;
  }

  /**
   * Verifica si el usuario tiene al menos uno de los roles especificados
   */
  hasAnyRole(roles: (Rol | string)[]): boolean {
    const user = this.getCurrentUser();
    return roles.some(role => user?.rol === role);
  }

  /**
   * Verifica si el usuario es administrador
   */
  isAdmin(): boolean {
    return this.hasRole(Rol.ADMIN);
  }

  /**
   * Verifica si el usuario es moderador
   */
  isModerador(): boolean {
    return this.hasRole(Rol.MODERADOR);
  }

  /**
   * Verifica si el usuario es usuario normal
   */
  isUsuario(): boolean {
    return this.hasRole(Rol.USUARIO);
  }

  /**
   * Verifica si está cargando (síncrono)
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  /**
   * Manejo centralizado de errores - MEJORADO para BD MySQL
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Error de autenticación';
    
    console.log('🔍 Analizando error desde BD:', error);
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error de conexión: ${error.error.message}`;
    } else {
      // Error del lado del servidor - específico para tu BD MySQL
      const status = error.status;
      const errorBody = error.error;
      
      console.log('📊 Detalles del error BD:', { status, errorBody });
      
      // Manejar errores específicos de MySQL/Spring Boot
      if (errorBody && typeof errorBody === 'object') {
        // Errores de validación de Spring Boot
        if (errorBody.errors) {
          const validationErrors = errorBody.errors.map((err: any) => err.defaultMessage).join(', ');
          errorMessage = `Errores de validación: ${validationErrors}`;
        } else if (errorBody.message) {
          errorMessage = errorBody.message;
        } else if (errorBody.error) {
          errorMessage = errorBody.error;
        }
      } else if (typeof errorBody === 'string') {
        // Si el error es texto plano
        try {
          const parsedError = JSON.parse(errorBody);
          errorMessage = parsedError.message || parsedError.error || errorMessage;
        } catch (e) {
          errorMessage = errorBody || errorMessage;
        }
      }
      
      // Mensajes específicos por código de estado - relacionados con BD
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
    
    console.error('❌ Error de BD MySQL:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Solicitar recuperación de contraseña - GUARDA TOKEN EN BD
   */
  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/forgot-password`, { email }).pipe(
      tap(() => console.log('📧 Token de recuperación guardado en BD')),
      catchError(this.handleError)
    );
  }

  /**
   * Restablecer contraseña - ACTUALIZA BD
   */
  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, {
      token,
      newPassword
    }).pipe(
      tap(() => console.log('✅ Contraseña actualizada en BD')),
      catchError(this.handleError)
    );
  }

  /**
   * Cambiar contraseña del usuario actual - ACTUALIZA BD
   */
  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/change-password`, {
      currentPassword,
      newPassword
    }, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      tap(() => console.log('✅ Contraseña cambiada en BD')),
      catchError(this.handleError)
    );
  }

  /**
   * Verificar si el email existe en la BD
   */
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.post<{ exists: boolean }>(`${this.apiUrl}/check-email`, { email }).pipe(
      map(response => response.exists),
      tap(exists => console.log(`📧 Verificación en BD - Email ${email} existe:`, exists)),
      catchError(this.handleError)
    );
  }

  /**
   * Obtener todos los usuarios desde la BD (solo admin)
   */
  getAllUsers(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${environment.apiUrl}/usuarios`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      tap(users => console.log('👥 Usuarios cargados desde BD:', users.length)),
      catchError(this.handleError)
    );
  }

  /**
   * Obtener usuario por ID desde la BD
   */
  getUserById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${environment.apiUrl}/usuarios/${id}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      tap(user => console.log('👤 Usuario por ID desde BD:', user)),
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar último login en BD
   */
  updateLastLogin(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/update-last-login`, {}, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      tap(() => console.log('🕐 Último login actualizado en BD')),
      catchError(this.handleError)
    );
  }

  /**
   * Obtener estadísticas del usuario desde BD
   */
  getUserStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      tap(stats => console.log('📊 Estadísticas desde BD:', stats)),
      catchError(this.handleError)
    );
  }

  /**
   * Verificar estado de autenticación con la BD
   */
  checkAuthStatus(): Observable<boolean> {
    return this.http.get<{ authenticated: boolean }>(`${this.apiUrl}/status`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      map(response => response.authenticated),
      tap(authenticated => {
        console.log('🔍 Estado de autenticación en BD:', authenticated);
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

  /**
   * Obtener roles disponibles desde la BD
   */
  getAvailableRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/roles`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      tap(roles => console.log('🎭 Roles disponibles en BD:', roles)),
      catchError(this.handleError)
    );
  }

  /**
   * Buscar usuarios en la BD
   */
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