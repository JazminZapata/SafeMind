import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class OrderNotificationService {
  constructor() {}

  async initialize(): Promise<void> {
    // Inicializar el servicio de notificaciones
    console.log("Inicializando OrderNotificationService");
  }

  async startMonitoring(): Promise<void> {
    // Iniciar monitoreo de nuevos pedidos
    console.log("Iniciando monitoreo de pedidos");
  }

  stopMonitoring(): void {
    // Detener monitoreo
    console.log("Deteniendo monitoreo de pedidos");
  }
}
