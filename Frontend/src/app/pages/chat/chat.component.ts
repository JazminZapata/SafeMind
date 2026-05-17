import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SecurityService } from "src/app/services/security.service";
import { SesionService } from "src/app/services/sesion.service";
import { MensajeService } from "src/app/services/mensaje.service";
import { ProfesionalService } from "src/app/services/profesional.service";
import { Sesion } from "src/app/models/Sesion";
import { Mensaje } from "src/app/models/Mensaje";
import { Profesional } from "src/app/models/Profesional";
import { User } from "src/app/models/User";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild("messagesContainer") private messagesContainer: ElementRef;

  user: User;
  sesiones: Sesion[] = [];
  sesionActiva: Sesion | null = null;
  mensajes: Mensaje[] = [];
  profesionales: Profesional[] = [];

  nuevoMensaje: string = "";
  isLoading: boolean = false;
  showNuevaSesion: boolean = false;
  profesionalSeleccionado: number | null = null;
  temaSesion: string = "";

  private shouldScroll: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private securityService: SecurityService,
    private sesionService: SesionService,
    private mensajeService: MensajeService,
    private profesionalService: ProfesionalService,
  ) {}

  ngOnInit() {
    this.user = this.securityService.activeUserSession;
    this.loadSesiones();
    this.loadProfesionales();

    this.route.queryParams.subscribe((params) => {
      if (params["sesion"] && this.sesiones.length > 0) {
        this.selectSesionById(parseInt(params["sesion"]));
      }
    });
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  ngOnDestroy() {}

  loadSesiones() {
    this.isLoading = true;
    this.sesionService.list().subscribe({
      next: (sesiones) => {
        this.sesiones = sesiones;
        this.isLoading = false;

        // Seleccionar primera sesion activa
        const sesionActiva = this.sesiones.find((s) => s.estado === "activa");
        if (sesionActiva) {
          this.selectSesion(sesionActiva);
        }

        // Si viene por queryParam
        this.route.queryParams.subscribe((params) => {
          if (params["sesion"]) {
            this.selectSesionById(parseInt(params["sesion"]));
          }
        });
      },
      error: (err) => {
        console.error("Error cargando sesiones:", err);
        this.isLoading = false;
      },
    });
  }

  loadProfesionales() {
    this.profesionalService.list().subscribe({
      next: (profesionales) => {
        this.profesionales = profesionales;
      },
      error: (err) => {
        console.error("Error cargando profesionales:", err);
      },
    });
  }

  selectSesion(sesion: Sesion) {
    this.sesionActiva = sesion;
    this.loadMensajes(sesion.id);
  }

  selectSesionById(id: number) {
    const sesion = this.sesiones.find((s) => s.id === id);
    if (sesion) {
      this.selectSesion(sesion);
    }
  }

  loadMensajes(sesionId: number) {
    this.mensajeService.getBySesion(sesionId).subscribe({
      next: (mensajes) => {
        this.mensajes = mensajes;
        this.shouldScroll = true;
      },
      error: (err) => {
        console.error("Error cargando mensajes:", err);
        this.mensajes = [];
      },
    });
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim() || !this.sesionActiva) return;

    const data = {
      sesion_id: this.sesionActiva.id,
      remitente_id: this.user?.id,
      contenido: this.nuevoMensaje.trim(),
    };

    this.mensajeService.create(data).subscribe({
      next: (mensaje) => {
        this.mensajes.push(mensaje);
        this.nuevoMensaje = "";
        this.shouldScroll = true;
      },
      error: (err) => {
        console.error("Error enviando mensaje:", err);
      },
    });
  }

  crearNuevaSesion() {
  if (!this.profesionalSeleccionado) return;
  this.isLoading = true;

  // Buscar el estudiante_id desde el backend
  const personaId = this.user?.id;

  const data = {
    estudiante_id: personaId,  // el backend buscará el estudiante por persona_id
    profesional_id: this.profesionalSeleccionado,
    tema: this.temaSesion || 'Sesion de apoyo'
  };

  this.sesionService.create(data).subscribe({
    next: (sesion) => {
      this.sesiones.unshift(sesion);
      this.selectSesion(sesion);
      this.showNuevaSesion = false;
      this.profesionalSeleccionado = null;
      this.temaSesion = '';
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error creando sesion:', err);
      this.isLoading = false;
    }
  });
}

  cerrarSesion(sesion: Sesion) {
    this.sesionService.cerrar(sesion.id).subscribe({
      next: (sesionActualizada) => {
        // Actualizar en la lista
        const index = this.sesiones.findIndex((s) => s.id === sesion.id);
        if (index !== -1) {
          this.sesiones[index] = sesionActualizada;
        }
        // Limpiar la sesion activa
        if (this.sesionActiva?.id === sesion.id) {
          this.sesionActiva = sesionActualizada;
        }
      },
      error: (err) => {
        console.error("Error cerrando sesion:", err);
      },
    });
  }

  isOwnMessage(mensaje: Mensaje): boolean {
    return mensaje.remitente_id === this.user?.id;
  }

  private scrollToBottom() {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.enviarMensaje();
    }
  }
}
