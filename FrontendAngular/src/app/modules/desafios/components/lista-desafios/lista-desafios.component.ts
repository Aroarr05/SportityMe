import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DesafiosService } from '../../services/desafios.service';
import { Desafio } from '../../../../shared/models';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../../../shared/components/error-alert/error-alert.component';

@Component({
  standalone: true,
  selector: 'app-lista-desafios',
  templateUrl: './lista-desafios.component.html',
  styleUrls: ['./lista-desafios.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    ErrorAlertComponent
  ]
})

export class ListaDesafiosComponent implements OnInit {
  desafios: Desafio[] = [];
  loading = true;
  error: string | null = null;

  constructor(private desafiosService: DesafiosService) { }

  ngOnInit(): void {
    this.cargarDesafios();
  }

  cargarDesafios(): void {
    this.loading = true;
    this.error = null;
    
    this.desafiosService.obtenerDesafios().subscribe({
      next: (desafios) => {
        this.desafios = desafios;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los desafíos. Por favor, inténtalo de nuevo más tarde.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}