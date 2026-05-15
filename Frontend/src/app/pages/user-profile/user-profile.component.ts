import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: any = {
    name: 'Usuario',
    email: 'usuario@email.com',
    provider: 'Google'
  };

  userPhotoURL: string = '';

  estadisticas = {
    sesiones: 0,
    actividadesCompletadas: 0,
    diasActivo: 0
  };

  perfil = {
    nombre: '',
    telefono: '',
    rol: '',
    institucion: '',
    carrera: '',
    sobre_mi: ''
  };

  preferencias = {
    notificaciones: true,
    tips: true,
    sesionesEmail: true,
    perfilPublico: false
  };

  constructor() { }

  ngOnInit() {
  }

  guardarPerfil() {
    console.log('Perfil guardado');
  }

}