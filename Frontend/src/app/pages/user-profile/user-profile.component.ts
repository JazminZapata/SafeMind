import { Component, OnInit, OnDestroy } from '@angular/core';
import { SecurityService } from 'src/app/services/security.service';
import { User } from 'src/app/models/User';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

interface PerfilData {
  nombre: string;
  telefono: string;
  rol: string;
  institucion: string;
  carrera: string;
  sobre_mi: string;
}

interface Preferencias {
  notificaciones: boolean;
  tips: boolean;
  sesionesEmail: boolean;
  perfilPublico: boolean;
}

interface Estadisticas {
  sesiones: number;
  actividadesCompletadas: number;
  diasActivo: number;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: User;
  userPhotoURL: string = '';
  subscription: Subscription;

  perfil: PerfilData = {
    nombre: '',
    telefono: '',
    rol: 'estudiante',
    institucion: '',
    carrera: '',
    sobre_mi: ''
  };

  preferencias: Preferencias = {
    notificaciones: true,
    tips: true,
    sesionesEmail: true,
    perfilPublico: true
  };

  estadisticas: Estadisticas = {
    sesiones: 5,
    actividadesCompletadas: 23,
    diasActivo: 14
  };

  constructor(private securityService: SecurityService) { }

  ngOnInit() {
    this.subscription = this.securityService.getUser().subscribe(data => {
      this.user = data;
      
      if (data && data.photoURL) {
        this.userPhotoURL = data.photoURL;
      } else {
        this.userPhotoURL = '';
      }

      // Cargar datos del perfil
      if (data && data.name) {
        this.perfil.nombre = data.name;
      }
    });

    this.loadPerfilData();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadPerfilData() {
    // Datos de ejemplo - en produccion vendrian del backend
    this.perfil = {
      nombre: this.user?.name || '',
      telefono: '+57 300 123 4567',
      rol: 'estudiante',
      institucion: 'Universidad Nacional',
      carrera: 'Ingenieria de Sistemas',
      sobre_mi: 'Estudiante de ultimo semestre interesado en tecnologia y bienestar mental.'
    };
  }

  guardarPerfil() {
    // En produccion, enviar al backend
    console.log('Guardando perfil:', this.perfil);
    console.log('Preferencias:', this.preferencias);

    Swal.fire({
      icon: 'success',
      title: 'Perfil actualizado',
      text: 'Tus cambios han sido guardados exitosamente',
      timer: 2000,
      showConfirmButton: false
    });
  }
}
