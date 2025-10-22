import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading: boolean = false;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', Validators.required] 
    });
  }
  
  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';

      const loginData = {
        email: this.loginForm.get('email')?.value || '',
        contraseña: this.loginForm.get('contraseña')?.value || '' 
      };
      
      this.authService.login(loginData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/desafios']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.message || 'Error al iniciar sesión. Verifica tus credenciales.';
          console.error('Error al iniciar sesión', err);
        }
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }
  goBack() {
  this.router.navigate(['/']);}
}