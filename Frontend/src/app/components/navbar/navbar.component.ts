import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { SecurityService } from 'src/app/services/security.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  public focus: boolean;
  public listTitles: any[];
  public location: Location;

  user: User & { foto_url?: string } = null;
  private subscription: Subscription;

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    public securityService: SecurityService
  ) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);

    this.subscription = this.securityService.getUser().subscribe(data => {
      this.user = data as any;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  logout() {
    this.securityService.logout();
    this.router.navigate(['/login']);
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }
    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }
}