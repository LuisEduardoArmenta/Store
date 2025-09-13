import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Address {
  id?: number;
  usuarioId?: number;
  nombre: string;
  direccionCompleta: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  pais?: string;
  esPrincipal?: boolean;
  telefono?: string;
  referencias?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = 'http://localhost:3000/direcciones';
  private addressesSubject = new BehaviorSubject<Address[]>([]);
  public addresses$ = this.addressesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private handleError = (error: any): Observable<never> => {
    console.error('Error en AddressService:', error);
    throw error;
  };

  // Obtener todas las direcciones del usuario
  getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        tap((addresses) => {
          this.addressesSubject.next(addresses);
        }),
        catchError(this.handleError)
      );
  }

  // Crear nueva dirección
  createAddress(address: Omit<Address, 'id' | 'usuarioId' | 'createdAt' | 'updatedAt'>): Observable<any> {
    return this.http.post<any>(this.apiUrl, address, { headers: this.getHeaders() })
      .pipe(
        tap(() => {
          // Recargar direcciones después de crear
          this.getAddresses().subscribe();
        }),
        catchError(this.handleError)
      );
  }

  // Actualizar dirección
  updateAddress(id: number, address: Partial<Address>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, address, { headers: this.getHeaders() })
      .pipe(
        tap(() => {
          // Recargar direcciones después de actualizar
          this.getAddresses().subscribe();
        }),
        catchError(this.handleError)
      );
  }

  // Eliminar dirección
  deleteAddress(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(() => {
          // Recargar direcciones después de eliminar
          this.getAddresses().subscribe();
        }),
        catchError(this.handleError)
      );
  }

  // Establecer dirección como principal
  setPrimaryAddress(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/principal`, {}, { headers: this.getHeaders() })
      .pipe(
        tap(() => {
          // Recargar direcciones después de establecer como principal
          this.getAddresses().subscribe();
        }),
        catchError(this.handleError)
      );
  }

  // Obtener dirección principal
  getPrimaryAddress(): Address | null {
    const addresses = this.addressesSubject.value;
    return addresses.find(address => address.esPrincipal) || null;
  }

  // Obtener direcciones actuales sin hacer petición HTTP
  get currentAddresses(): Address[] {
    return this.addressesSubject.value;
  }
}
