
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-error-alert',
  templateUrl: './error-alert.component.html',
  imports: [CommonModule]
})

export class ErrorAlertComponent {
  @Input() message: string = '';
}