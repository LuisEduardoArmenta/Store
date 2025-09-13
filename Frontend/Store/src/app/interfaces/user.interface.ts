export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: string;
  fechaNacimiento?: string; // Usamos string para consistencia con el backend
  createdAt?: string;
  updatedAt?: string;
}
