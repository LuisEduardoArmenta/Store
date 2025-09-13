import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LoginModalComponent } from '../../components/login-modal/login-modal.component';
import { RegisterModalComponent } from '../../components/register-modal/register-modal.component';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';


interface Service {
  icon: string;
  title: string;
  description: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, LoginModalComponent, RegisterModalComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  isMenuOpen = false;
  scrollY = 0;
  currentYear = new Date().getFullYear();
  private scrollListener?: () => void;

  // Modal states
  isLoginModalOpen = false;
  isRegisterModalOpen = false;
  isProfileSidebarOpen = false;
  currentUser: User | null = null;

  services: Service[] = [
    {
      icon: 'shirt',
      title: 'Ropa Formal',
      description: 'Trajes, camisas y pantalones elegantes para el hombre moderno y profesional.'
    },
    {
      icon: 'casual',
      title: 'Ropa Casual',
      description: 'Prendas cómodas y versátiles para el día a día, sin sacrificar el estilo.'
    },
    {
      icon: 'accessories',
      title: 'Accesorios',
      description: 'Complementos únicos que añaden personalidad y distinción a tu look.'
    },
    {
      icon: 'shoes',
      title: 'Calzado',
      description: 'Zapatos de calidad premium que combinan comodidad y elegancia.'
    },
    {
      icon: 'personal',
      title: 'Asesoría Personal',
      description: 'Consultoría de imagen personalizada para encontrar tu estilo perfecto.'
    },
    {
      icon: 'delivery',
      title: 'Entrega Rápida',
      description: 'Servicio de entrega express para que recibas tus prendas favoritas al instante.'
    }
  ];

  products: Product[] = [
    { 
      id: 1, 
      name: 'Traje Ejecutivo Premium', 
      price: '$599', 
      image: 'https://picsum.photos/600/800?random=1',
      category: 'Formal'
    },
    { 
      id: 2, 
      name: 'Camisa Oxford Clásica', 
      price: '$89', 
      image: 'https://picsum.photos/600/800?random=2',
      category: 'Camisas'
    },
    { 
      id: 3, 
      name: 'Blazer Casual Moderno', 
      price: '$299', 
      image: 'https://picsum.photos/600/800?random=3',
      category: 'Casual'
    },
    { 
      id: 4, 
      name: 'Zapatos Oxford Premium', 
      price: '$259', 
      image: 'https://picsum.photos/600/800?random=4',
      category: 'Calzado'
    },
    { 
      id: 5, 
      name: 'Reloj Clásico Elegante', 
      price: '$399', 
      image: 'https://picsum.photos/600/800?random=5',
      category: 'Accesorios'
    }
  ];

  testimonials: Testimonial[] = [
    {
      name: 'Carlos Mendoza',
      role: 'CEO, TechStart',
      content: 'ELEGANTE transformó completamente mi guardarropa profesional. La calidad y el estilo son incomparables.',
      rating: 5,
      avatar: 'https://picsum.photos/100/100?random=10'
    },
    {
      name: 'Roberto Silva',
      role: 'Director de Marketing',
      content: 'El servicio personalizado y la atención al detalle hacen que cada compra sea una experiencia única.',
      rating: 5,
      avatar: 'https://picsum.photos/100/100?random=11'
    },
    {
      name: 'Diego Ramírez',
      role: 'Arquitecto Senior',
      content: 'Encontré prendas que se adaptan perfectamente a mi estilo de vida profesional y personal.',
      rating: 5,
      avatar: 'https://picsum.photos/100/100?random=12'
    },
    {
      name: 'Miguel Torres',
      role: 'Consultor',
      content: 'La asesoría personalizada me ayudó a crear un guardarropa versátil y elegante.',
      rating: 5,
      avatar: 'https://picsum.photos/100/100?random=13'
    }
  ];

  teamMembers: TeamMember[] = [
    {
      name: 'Alejandro Ruiz',
      role: 'Director Creativo',
      image: 'https://picsum.photos/400/500?random=20'
    },
    {
      name: 'Sofia Martínez',
      role: 'Asesora de Imagen',
      image: 'https://picsum.photos/400/500?random=21'
    },
    {
      name: 'Luis García',
      role: 'Diseñador Senior',
      image: 'https://picsum.photos/400/500?random=22'
    },
    {
      name: 'Carmen López',
      role: 'Gerente de Tienda',
      image: 'https://picsum.photos/400/500?random=23'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.setupScrollListener();
    // Suscribirse al estado de autenticación
    this.authService.currentUser.subscribe(user => {
      console.log('Estado de usuario actualizado:', user);
      this.currentUser = user;
    });
    
    // Debug: verificar estado inicial
    console.log('Estado inicial de autenticación:', this.authService.isAuthenticated);
    console.log('Usuario actual:', this.authService.currentUserValue);
  }

  ngAfterViewInit() {
    // Cualquier inicialización después de que la vista esté lista
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  private setupScrollListener() {
    this.scrollListener = () => {
      this.scrollY = window.scrollY;
    };
    window.addEventListener('scroll', this.scrollListener);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.isMenuOpen = false; // Cerrar menú móvil después de navegar
    }
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getServiceIcon(iconName: string): string {
    const icons: { [key: string]: string } = {
      'shirt': 'M12 2l3.09 6.26L22 9l-5 4.87L18.18 22 12 18.27 5.82 22 7 13.87 2 9l6.91-.74L12 2z',
      'casual': 'M7 4V2a1 1 0 0 1 2 0v2h6V2a1 1 0 0 1 2 0v2h1a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1z',
      'accessories': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
      'shoes': 'M2 18h20v2H2v-2zm1.15-8.85L4 8.3V6c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v2.3l.85.85c.39.39.39 1.02 0 1.41L20 11.41V18H4v-6.59l-.85-.85c-.39-.39-.39-1.02 0-1.41z',
      'personal': 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
      'delivery': 'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z'
    };
    return icons[iconName] || icons['shirt'];
  }

  // Modal management methods
  openLoginModal() {
    this.isLoginModalOpen = true;
    this.isRegisterModalOpen = false;
  }

  openRegisterModal() {
    this.isRegisterModalOpen = true;
    this.isLoginModalOpen = false;
  }

  closeModals() {
    this.isLoginModalOpen = false;
    this.isRegisterModalOpen = false;
  }

  onSwitchToRegister() {
    this.isLoginModalOpen = false;
    this.isRegisterModalOpen = true;
  }

  onSwitchToLogin() {
    this.isRegisterModalOpen = false;
    this.isLoginModalOpen = true;
  }

  onLoginSuccess() {
    console.log('Login exitoso');
    console.log('Usuario después del login:', this.authService.currentUserValue);
    console.log('¿Está autenticado?', this.authService.isAuthenticated);
    // Forzar detección de cambios
    this.currentUser = this.authService.currentUserValue;
  }

  onRegisterSuccess() {
    console.log('Registro exitoso');
    console.log('Usuario después del registro:', this.authService.currentUserValue);
    console.log('¿Está autenticado?', this.authService.isAuthenticated);
    // Forzar detección de cambios
    this.currentUser = this.authService.currentUserValue;
  }

  logout() {
    this.authService.logout();
    this.closeProfileSidebar();
  }

  // Profile sidebar methods
  toggleProfileSidebar() {
    this.isProfileSidebarOpen = !this.isProfileSidebarOpen;
  }

  closeProfileSidebar() {
    this.isProfileSidebarOpen = false;
  }

  openProfileSection() {
    this.closeProfileSidebar();
    this.router.navigate(['/profile']);
  }

  openAddressSection() {
    this.closeProfileSidebar();
    this.router.navigate(['/addresses']);
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }
}
