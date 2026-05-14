import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service';
import { SesionService } from 'src/app/services/sesion.service';
import { MensajeService } from 'src/app/services/mensaje.service';
import { ProfesionalService } from 'src/app/services/profesional.service';
import { Sesion } from 'src/app/models/Sesion';
import { Mensaje } from 'src/app/models/Mensaje';
import { Profesional } from 'src/app/models/Profesional';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer: ElementRef;

  user: User;
  sesiones: Sesion[] = [];
  sesionActiva: Sesion | null = null;
  mensajes: Mensaje[] = [];
  profesionales: Profesional[] = [];
  
  nuevoMensaje: string = '';
  isLoading: boolean = false;
  showNuevaSesion: boolean = false;
  profesionalSeleccionado: number | null = null;
  temaSesion: string = '';
  
  private shouldScroll: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private securityService: SecurityService,
    private sesionService: SesionService,
    private mensajeService: MensajeService,
    private profesionalService: ProfesionalService
  ) { }

  ngOnInit() {
    this.user = this.securityService.activeUserSession;
    this.loadSesiones();
    this.loadProfesionales();
    
    // Verificar si viene con una sesion especifica
    this.route.queryParams.subscribe(params => {
      if (params['sesion']) {
        this.selectSesionById(parseInt(params['sesion']));
      }
    });
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  ngOnDestroy() {
    // Cleanup si es necesario
  }

  loadSesiones() {
    // Por ahora usamos datos de ejemplo
    this.sesiones = [
      {
        id: 1,
        tema: 'Manejo del estres',
        estado: 'activa',
        created_at: new Date().toISOString(),
        profesional: {
          id: 1,
          especialidad: 'Psicologia',
          persona: {
            nombre: 'Dra. Maria Garcia',
            foto_url: ''
          }
        }
      },
      {
        id: 2,
        tema: 'Organizacion del tiempo',
        estado: 'cerrada',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        profesional: {
          id: 2,
          especialidad: 'Coaching academico',
          persona: {
            nombre: 'Dr. Carlos Lopez',
            foto_url: ''
          }
        }
      }
    ];
    
    // Seleccionar la primera sesion activa
    const sesionActiva = this.sesiones.find(s => s.estado === 'activa');
    if (sesionActiva) {
      this.selectSesion(sesionActiva);
    }
  }

  loadProfesionales() {
    // Por ahora usamos datos de ejemplo
    this.profesionales = [
      {
        id: 1,
        especialidad: 'Psicologia Clinica',
        disponibilidad: { lunes: '8:00 - 12:00', miercoles: '14:00 - 18:00' },
        persona: {
          id: 1,
          nombre: 'Dra. Maria Garcia',
          correo: 'maria.garcia@safemind.com',
          foto_url: ''
        }
      },
      {
        id: 2,
        especialidad: 'Coaching Academico',
        disponibilidad: { martes: '9:00 - 13:00', jueves: '15:00 - 19:00' },
        persona: {
          id: 2,
          nombre: 'Dr. Carlos Lopez',
          correo: 'carlos.lopez@safemind.com',
          foto_url: ''
        }
      },
      {
        id: 3,
        especialidad: 'Orientacion Vocacional',
        disponibilidad: { lunes: '14:00 - 18:00', viernes: '8:00 - 12:00' },
        persona: {
          id: 3,
          nombre: 'Lic. Ana Martinez',
          correo: 'ana.martinez@safemind.com',
          foto_url: ''
        }
      }
    ];
  }

  selectSesion(sesion: Sesion) {
    this.sesionActiva = sesion;
    this.loadMensajes(sesion.id);
  }

  selectSesionById(id: number) {
    const sesion = this.sesiones.find(s => s.id === id);
    if (sesion) {
      this.selectSesion(sesion);
    }
  }

  loadMensajes(sesionId: number) {
    // Por ahora usamos datos de ejemplo
    this.mensajes = [
      {
        id: 1,
        sesion_id: sesionId,
        remitente_id: 1,
        contenido: 'Hola, bienvenido a SafeMind. Estoy aqui para ayudarte. Cuentame, como te has sentido ultimamente?',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        remitente: {
          id: 1,
          nombre: 'Dra. Maria Garcia',
          rol: 'profesional'
        }
      },
      {
        id: 2,
        sesion_id: sesionId,
        remitente_id: 2,
        contenido: 'Hola doctora, gracias por atenderme. He estado sintiendo mucho estres por los examenes.',
        created_at: new Date(Date.now() - 3500000).toISOString(),
        remitente: {
          id: 2,
          nombre: this.user?.name || 'Usuario',
          rol: 'estudiante'
        }
      },
      {
        id: 3,
        sesion_id: sesionId,
        remitente_id: 1,
        contenido: 'Entiendo perfectamente. El estres academico es muy comun entre estudiantes. Hablemos sobre algunas tecnicas que pueden ayudarte a manejarlo mejor.',
        created_at: new Date(Date.now() - 3400000).toISOString(),
        remitente: {
          id: 1,
          nombre: 'Dra. Maria Garcia',
          rol: 'profesional'
        }
      }
    ];
    this.shouldScroll = true;
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim() || !this.sesionActiva) return;

    const mensaje: Mensaje = {
      id: this.mensajes.length + 1,
      sesion_id: this.sesionActiva.id,
      remitente_id: parseInt(this.user?.id?.toString() || '0'),
      contenido: this.nuevoMensaje.trim(),
      created_at: new Date().toISOString(),
      remitente: {
        id: parseInt(this.user?.id?.toString() || '0'),
        nombre: this.user?.name || 'Usuario',
        rol: 'estudiante'
      }
    };

    this.mensajes.push(mensaje);
    this.nuevoMensaje = '';
    this.shouldScroll = true;

    // Simular respuesta del profesional
    setTimeout(() => {
      this.simularRespuesta();
    }, 1500);
  }

  private simularRespuesta() {
    const respuestas = [
      'Gracias por compartir eso conmigo. Es importante que hablemos sobre como te sientes.',
      'Entiendo. Vamos a trabajar juntos en encontrar estrategias que funcionen para ti.',
      'Eso es muy valido. Muchos estudiantes pasan por situaciones similares.',
      'Me alegra que confies en mi para hablar de esto. Como te gustaria que abordemos este tema?'
    ];

    const respuesta: Mensaje = {
      id: this.mensajes.length + 1,
      sesion_id: this.sesionActiva?.id,
      remitente_id: 1,
      contenido: respuestas[Math.floor(Math.random() * respuestas.length)],
      created_at: new Date().toISOString(),
      remitente: {
        id: 1,
        nombre: this.sesionActiva?.profesional?.persona?.nombre || 'Profesional',
        rol: 'profesional'
      }
    };

    this.mensajes.push(respuesta);
    this.shouldScroll = true;
  }

  crearNuevaSesion() {
    if (!this.profesionalSeleccionado) return;

    this.isLoading = true;

    // Simular creacion de sesion
    setTimeout(() => {
      const profesional = this.profesionales.find(p => p.id === this.profesionalSeleccionado);
      const nuevaSesion: Sesion = {
        id: this.sesiones.length + 1,
        estudiante_id: parseInt(this.user?.id?.toString() || '0'),
        profesional_id: this.profesionalSeleccionado,
        tema: this.temaSesion || 'Sesion de apoyo',
        estado: 'activa',
        created_at: new Date().toISOString(),
        profesional: profesional
      };

      this.sesiones.unshift(nuevaSesion);
      this.selectSesion(nuevaSesion);
      this.showNuevaSesion = false;
      this.profesionalSeleccionado = null;
      this.temaSesion = '';
      this.isLoading = false;
    }, 1000);
  }

  cerrarSesion(sesion: Sesion) {
    sesion.estado = 'cerrada';
    if (this.sesionActiva?.id === sesion.id) {
      this.sesionActiva = null;
      this.mensajes = [];
    }
  }

  isOwnMessage(mensaje: Mensaje): boolean {
    return mensaje.remitente?.rol === 'estudiante';
  }

  private scrollToBottom() {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) { }
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviarMensaje();
    }
  }
}
