import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { NoAuthGuard } from './auth/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/components/login/login.component').then(m => m.LoginComponent),
        canActivate: [NoAuthGuard]
      },
      {
        path: 'registro',
        loadComponent: () => import('./auth/components/registro/registro.component').then(m => m.RegistroComponent),
        canActivate: [NoAuthGuard]
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'desafios',
        children: [
          {
            path: '',
            loadComponent: () => import('./modules/desafios/components/lista-desafios/lista-desafios.component').then(m => m.ListaDesafiosComponent)
          },
          {
            path: 'crear',
            loadComponent: () => import('./modules/desafios/components/crear-desafio/crear-desafio.component').then(m => m.CrearDesafioComponent),
            canActivate: [AuthGuard]
          },
          {
            path: ':id',
            loadComponent: () => import('./modules/desafios/components/detalle-desafio/detalle-desafio.component').then(m => m.DetalleDesafioComponent)
          }
        ]
      },
      {
        path: 'progresos',
        children: [
          {
            path: '',
            loadComponent: () => import('./modules/progresos/components/mis-progresos/mis-progresos.component').then(m => m.MisProgresosComponent),
            canActivate: [AuthGuard]
          },
          {
            path: 'registrar',
            loadComponent: () => import('./modules/progresos/components/registrar-progreso/registrar-progreso.component').then(m => m.RegistrarProgresoComponent),
            canActivate: [AuthGuard]
          },
          {
            path: 'registrar/:desafioId',
            loadComponent: () => import('./modules/progresos/components/registrar-progreso/registrar-progreso.component').then(m => m.RegistrarProgresoComponent),
            canActivate: [AuthGuard]
          },
          { path: '', redirectTo: 'mis-progresos', pathMatch: 'full' }
        ]
      },
      {
        path: 'rankings',
        children: [
          {
            path: '',
            loadComponent: () => import('./modules/rankings/components/ranking-global/ranking-global.component').then(m => m.RankingGlobalComponent)
          },
          { path: '', redirectTo: 'global', pathMatch: 'full' }
        ]
      },
      {
        path: 'admin',
        children: [
          {
            path: 'usuarios',
            loadComponent: () => import('./modules/admin/components/gestion-usuarios/gestion-usuarios.component').then(m => m.GestionUsuariosComponent),
            canActivate: [AuthGuard]
          },
          {
            path: 'desafios',
            loadComponent: () => import('./modules/admin/components/gestion-desafios/gestion-desafios.component').then(m => m.GestionDesafiosComponent),
            canActivate: [AuthGuard] 
          },
          { path: '', redirectTo: 'usuarios', pathMatch: 'full' }
        ]
      },
      { path: '', redirectTo: 'desafios', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'desafios' }
];