import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/services/security.service';
import { PersonaService } from 'src/app/services/persona.service';
import { SesionService } from 'src/app/services/sesion.service';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { Sesion } from 'src/app/models/Sesion';
import { Estudiante } from 'src/app/models/Estudiante';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: any = null;
  userPhotoURL: string = '';
  isUploadingPhoto: boolean = false;
  isLoadingStats: boolean = true;

  // Id del registro en la tabla estudiantes (distinto al persona_id)
  private estudianteId: number | null = null;

  estadisticas = {
    sesiones: 0,
    actividadesCompletadas: 0,
    diasActivo: 0
  };

  perfil = {
    nombre: '',
    telefono: '',
    rol: 'estudiante',
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

  constructor(
    private securityService: SecurityService,
    private personaService: PersonaService,
    private sesionService: SesionService,
    private estudianteService: EstudianteService
  ) {}

  ngOnInit() {
    this.user = this.securityService.activeUserSession;
    this.userPhotoURL = this.user?.foto_url || this.user?.photoURL || '';

    // Datos que viven en la tabla personas
    this.perfil.nombre   = this.user?.name    || '';
    this.perfil.telefono = this.user?.telefono || '';

    this.loadEstudianteData();
  }

  // ── Carga todos los datos del estudiante desde el backend ─────────────────

  private loadEstudianteData() {
    this.isLoadingStats = true;
    const personaId = this.user?.id;

    if (!personaId) {
      this.isLoadingStats = false;
      return;
    }

    // Busca el registro de estudiante usando el persona_id
    this.estudianteService.getByPersonaId(personaId).subscribe({
      next: (estudiante: Estudiante) => {

        // Guardar el id real del estudiante para usarlo al guardar
        this.estudianteId = estudiante.id;

        // Rellenar campos académicos con los datos guardados
        this.perfil.institucion = estudiante.institucion || '';
        this.perfil.carrera     = estudiante.carrera     || '';

        // Contar actividades del horario
        if (estudiante.horario) {
          let total = 0;
          Object.values(estudiante.horario).forEach((actividades: any) => {
            if (Array.isArray(actividades)) total += actividades.length;
          });
          this.estadisticas.actividadesCompletadas = total;
        }

        // Con el id real del estudiante traer sus sesiones
        this.sesionService.getByEstudiante(estudiante.id).subscribe({
          next: (sesiones: Sesion[]) => {
            this.estadisticas.sesiones   = sesiones.length;
            this.estadisticas.diasActivo = this.calcularDiasActivo(sesiones);
            this.isLoadingStats = false;
          },
          error: () => {
            this.isLoadingStats = false;
          }
        });
      },
      error: () => {
        // Usuario profesional o sin registro de estudiante aún
        this.isLoadingStats = false;
      }
    });
  }

  private calcularDiasActivo(sesiones: Sesion[]): number {
    if (!sesiones || sesiones.length === 0) return 0;
    const diasUnicos = new Set(
      sesiones
        .filter(s => !!s.created_at)
        .map(s => new Date(s.created_at).toDateString())
    );
    return diasUnicos.size;
  }

  // ── Guardar todos los campos del formulario ───────────────────────────────

  guardarPerfil() {
    const personaId = this.user?.id;
    if (!personaId) return;

    // 1. Guardar en tabla personas: nombre y teléfono
    const savePersona$ = this.personaService.update(personaId, {
      nombre:   this.perfil.nombre,
      telefono: this.perfil.telefono
    } as any);

    savePersona$.subscribe({
      next: () => {
        // Actualiza el nombre en la sesión local para que el sidebar lo refleje
        const updatedUser = {
          ...this.securityService.activeUserSession,
          name:     this.perfil.nombre,
          telefono: this.perfil.telefono
        };
        this.securityService.setUser(updatedUser);
        localStorage.setItem('sesion', JSON.stringify(updatedUser));
      },
      error: () => {}
    });

    // 2. Guardar en tabla estudiantes: institución y carrera
    if (this.estudianteId) {
      this.estudianteService.update(this.estudianteId, {
        institucion: this.perfil.institucion,
        carrera:     this.perfil.carrera
      } as any).subscribe({
        next: () => {},
        error: () => {}
      });
    }

    // Mensaje de éxito único al usuario
    Swal.fire({
      title: 'Perfil actualizado',
      text: 'Todos tus datos han sido guardados correctamente.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  }

  // ── Foto de perfil ────────────────────────────────────────────────────────

  triggerFileInput() {
    const input = document.getElementById('photoInput') as HTMLInputElement;
    if (input) input.click();
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      Swal.fire('Formato incorrecto', 'Por favor selecciona un archivo de imagen.', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire('Imagen muy grande', 'La imagen no puede superar los 2 MB.', 'error');
      return;
    }

    this.isUploadingPhoto = true;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const base64 = e.target?.result as string;
      this.userPhotoURL = base64;
      this.savePhoto(base64);
    };
    reader.readAsDataURL(file);
  }

  private savePhoto(base64: string) {
    const personaId = this.user?.id;

    if (!personaId) {
      this.isUploadingPhoto = false;
      Swal.fire('Error', 'No se pudo identificar al usuario.', 'error');
      return;
    }

    this.personaService.update(personaId, { foto_url: base64 } as any).subscribe({
      next: () => {
        this.isUploadingPhoto = false;

        const updatedUser = {
          ...this.securityService.activeUserSession,
          foto_url: base64
        };
        this.securityService.setUser(updatedUser);
        localStorage.setItem('sesion', JSON.stringify(updatedUser));

        Swal.fire({
          title: '¡Foto actualizada!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: () => {
        this.isUploadingPhoto = false;
        Swal.fire('Error', 'No se pudo guardar la foto. Intenta de nuevo.', 'error');
      }
    });
  }
}