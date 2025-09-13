import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  user: User | null = null;
  editMode = false;
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  // Formulario de edición
  editForm: Partial<User> = {};

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.user = this.authService.currentUserValue;
    if (this.user) {
      this.editForm = { ...this.user };
      // Convertir fecha para input date
      if (this.user.fechaNacimiento) {
        this.editForm.fechaNacimiento = new Date(this.user.fechaNacimiento).toISOString().split('T')[0];
      }
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      // Si cancelamos, restauramos los datos originales
      this.loadUserProfile();
    }
    this.message = '';
  }

  saveProfile() {
    if (!this.editForm.nombre || !this.editForm.apellido || !this.editForm.email || !this.editForm.telefono) {
      this.showMessage('Todos los campos son obligatorios', 'error');
      return;
    }

    this.loading = true;
    
    // TODO: Implementar actualización de perfil en el backend
    console.log('Datos a actualizar:', this.editForm);
    
    // Simulación temporal
    setTimeout(() => {
      this.loading = false;
      this.editMode = false;
      this.showMessage('Perfil actualizado exitosamente', 'success');
      
      // Actualizar los datos del usuario
      if (this.user && this.editForm) {
        Object.assign(this.user, this.editForm);
      }
    }, 1000);
  }

  private showMessage(text: string, type: 'success' | 'error') {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  calculateAge(dateString?: string): number | null {
    if (!dateString) return null;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
