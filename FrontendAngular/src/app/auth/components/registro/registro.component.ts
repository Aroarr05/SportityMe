import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;
  loading: boolean = false; 
  error: string = ''; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]], 
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }
  
  passwordMatchValidator(control: AbstractControl) {
    const contraseña = control.get('contraseña')?.value; 
    const confirmPassword = control.get('confirmPassword')?.value;
    
    if (contraseña !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }
  
  onSubmit() {
    if (this.registroForm.valid) {
      this.loading = true;
      this.error = '';

      const userData = {
        nombre: this.registroForm.get('nombre')?.value || '',
        email: this.registroForm.get('email')?.value || '',
        contraseña: this.registroForm.get('contraseña')?.value || ''
      };
      
      this.authService.register(userData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/desafios']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.message || 'Error en el registro. Por favor, intenta nuevamente.';
          console.error('Error en el registro', err);
        }
      });
    } else {
      Object.keys(this.registroForm.controls).forEach(key => {
        const control = this.registroForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}