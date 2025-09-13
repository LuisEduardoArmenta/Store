import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

// Validador personalizado para confirmar contraseña
export function passwordMatchValidator(control: AbstractControl): {[key: string]: any} | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { 'passwordMismatch': true };
  }
  return null;
}

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.css']
})
export class RegisterModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() switchToLogin = new EventEmitter<void>();
  @Output() registerSuccess = new EventEmitter<void>();

  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  acceptedTerms = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]{8,15}$/)]],
      fechaNacimiento: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator });
  }

  // Getters para fácil acceso a los campos del formulario
  get nombre() { return this.registerForm.get('nombre'); }
  get apellido() { return this.registerForm.get('apellido'); }
  get email() { return this.registerForm.get('email'); }
  get telefono() { return this.registerForm.get('telefono'); }
  get fechaNacimiento() { return this.registerForm.get('fechaNacimiento'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  onSubmit() {
    if (this.registerForm.valid && this.acceptedTerms && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const userData = {
        nombre: this.nombre?.value,
        apellido: this.apellido?.value,
        email: this.email?.value,
        telefono: this.telefono?.value,
        fechaNacimiento: this.fechaNacimiento?.value,
        password: this.password?.value
      };

      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response);
          this.isLoading = false;
          this.registerSuccess.emit();
          this.closeModal.emit();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error en registro:', error);
          this.errorMessage = error;
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      if (!this.acceptedTerms) {
        this.errorMessage = 'Debes aceptar los términos y condiciones';
      }
    }
  }

  onSwitchToLogin() {
    this.resetForm();
    this.switchToLogin.emit();
  }

  onClose() {
    this.resetForm();
    this.closeModal.emit();
  }

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onTermsChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.acceptedTerms = checkbox.checked;
    if (this.acceptedTerms) {
      this.errorMessage = '';
    }
  }

  private resetForm() {
    this.registerForm.reset();
    this.errorMessage = '';
    this.isLoading = false;
    this.showPassword = false;
    this.showConfirmPassword = false;
    this.acceptedTerms = false;
  }

  private markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  // Método para obtener mensajes de error específicos
  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} es requerido`;
      if (field.errors['email']) return 'Ingresa un correo electrónico válido';
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) return 'Ingresa un número de teléfono válido';
    }
    
    // Error de contraseñas no coinciden
    if (fieldName === 'confirmPassword' && this.registerForm.errors?.['passwordMismatch'] && this.confirmPassword?.touched) {
      return 'Las contraseñas no coinciden';
    }
    
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: {[key: string]: string} = {
      'nombre': 'El nombre',
      'apellido': 'El apellido',
      'email': 'El correo electrónico',
      'telefono': 'El teléfono',
      'fechaNacimiento': 'La fecha de nacimiento',
      'password': 'La contraseña',
      'confirmPassword': 'La confirmación de contraseña'
    };
    return labels[fieldName] || 'Este campo';
  }
}
