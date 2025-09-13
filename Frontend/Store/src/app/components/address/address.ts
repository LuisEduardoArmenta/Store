import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AddressService, Address as AddressInterface } from '../../services/address.service';

@Component({
  selector: 'app-address',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './address.html',
  styleUrl: './address.css'
})
export class Address implements OnInit {
  addresses: AddressInterface[] = [];
  showAddForm = false;
  editingAddress: AddressInterface | null = null;
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  // Formulario de nueva dirección
  newAddress: Omit<AddressInterface, 'id' | 'usuarioId' | 'createdAt' | 'updatedAt'> = {
    nombre: '',
    direccionCompleta: '',
    ciudad: '',
    estado: '',
    codigoPostal: '',
    pais: 'México',
    esPrincipal: false,
    telefono: '',
    referencias: ''
  };

  // Estados de México
  estadosMexico = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
    'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
    'Durango', 'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo',
    'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
    'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
    'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
  ];

  constructor(private addressService: AddressService) {}

  ngOnInit() {
    // Suscripción reactiva para refrescar la lista inmediatamente
    this.addressService.addresses$.subscribe(addresses => {
      this.addresses = addresses;
    });
    // Cargar al iniciar
    this.loadAddresses();
  }

  loadAddresses() {
    this.loading = true;
    this.addressService.getAddresses().subscribe({
      next: (addresses) => {
        this.addresses = addresses;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar direcciones:', error);
        this.showMessage('Error al cargar las direcciones', 'error');
        this.loading = false;
      }
    });
  }

  showAddAddressForm() {
    this.showAddForm = true;
    this.editingAddress = null;
    this.resetForm();
  }

  hideAddAddressForm() {
    this.showAddForm = false;
    this.editingAddress = null;
    this.resetForm();
  }

  editAddress(address: AddressInterface) {
    this.editingAddress = { ...address };
    this.newAddress = { ...address };
    this.showAddForm = true;
  }

  saveAddress() {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;

    if (this.editingAddress) {
      // Actualizar dirección existente
      this.addressService.updateAddress(this.editingAddress.id!, this.newAddress).subscribe({
        next: (response) => {
          this.showMessage('Dirección actualizada exitosamente', 'success');
          this.hideAddAddressForm();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al actualizar dirección:', error);
          this.showMessage('Error al actualizar la dirección', 'error');
          this.loading = false;
        }
      });
    } else {
      // Crear nueva dirección
      this.addressService.createAddress(this.newAddress).subscribe({
        next: (response) => {
          this.showMessage('Dirección creada exitosamente', 'success');
          this.hideAddAddressForm();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al crear dirección:', error);
          this.showMessage('Error al crear la dirección', 'error');
          this.loading = false;
        }
      });
    }
  }

  deleteAddress(address: AddressInterface) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
      return;
    }

    this.loading = true;
    this.addressService.deleteAddress(address.id!).subscribe({
      next: (response) => {
        this.showMessage('Dirección eliminada exitosamente', 'success');
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al eliminar dirección:', error);
        this.showMessage('Error al eliminar la dirección', 'error');
        this.loading = false;
      }
    });
  }

  setPrimaryAddress(address: AddressInterface) {
    this.loading = true;
    this.addressService.setPrimaryAddress(address.id!).subscribe({
      next: (response) => {
        this.showMessage('Dirección establecida como principal', 'success');
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al establecer dirección principal:', error);
        this.showMessage('Error al establecer la dirección principal', 'error');
        this.loading = false;
      }
    });
  }

  private validateForm(): boolean {
    if (!this.newAddress.nombre?.trim()) {
      this.showMessage('El nombre de la dirección es obligatorio', 'error');
      return false;
    }
    if (!this.newAddress.direccionCompleta?.trim()) {
      this.showMessage('La dirección completa es obligatoria', 'error');
      return false;
    }
    if (!this.newAddress.ciudad?.trim()) {
      this.showMessage('La ciudad es obligatoria', 'error');
      return false;
    }
    if (!this.newAddress.estado?.trim()) {
      this.showMessage('El estado es obligatorio', 'error');
      return false;
    }
    if (!this.newAddress.codigoPostal?.trim()) {
      this.showMessage('El código postal es obligatorio', 'error');
      return false;
    }
    return true;
  }

  private resetForm() {
    this.newAddress = {
      nombre: '',
      direccionCompleta: '',
      ciudad: '',
      estado: '',
      codigoPostal: '',
      pais: 'México',
      esPrincipal: false,
      telefono: '',
      referencias: ''
    };
  }

  private showMessage(text: string, type: 'success' | 'error') {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  get primaryAddress(): AddressInterface | undefined {
    return this.addresses.find(addr => addr.esPrincipal);
  }

  get secondaryAddresses(): AddressInterface[] {
    return this.addresses.filter(addr => !addr.esPrincipal);
  }
}
