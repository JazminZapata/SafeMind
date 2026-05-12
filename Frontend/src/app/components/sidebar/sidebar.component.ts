import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User';
import { SecurityService } from 'src/app/services/security.service';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: '/chat', title: 'Chat',  icon: 'ni-chat-round text-success', class: '' },
    { path: '/horario', title: 'Mi Horario',  icon: 'ni-calendar-grid-58 text-info', class: '' },
    { path: '/profesionales', title: 'Profesionales',  icon: 'ni-badge text-purple', class: '' },
    { path: '/sesiones', title: 'Mis Sesiones',  icon: 'ni-collection text-orange', class: '' },
    { path: '/user-profile', title: 'Mi Perfil', icon: 'ni-single-02 text-yellow', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;
  user: User;
  subscription:Subscription;

  constructor(private router: Router,
  public securityService:SecurityService) {

      this.subscription = this.securityService.getUser().subscribe(data => {
      this.user = data;
    })
   }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
}
