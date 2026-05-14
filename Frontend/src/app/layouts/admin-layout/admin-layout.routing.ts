import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
<<<<<<< HEAD
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
=======
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
>>>>>>> safemind-web-app
import { AuthenticationGuard } from 'src/app/guards/authentication.guard';


export const AdminLayoutRoutes: Routes = [
<<<<<<< HEAD
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
=======
    { path: 'dashboard', component: DashboardComponent },
    { path: 'user-profile', component: UserProfileComponent },
>>>>>>> safemind-web-app
    {
        path: '',
        children: [
            {
<<<<<<< HEAD
                path: 'theaters',
                canActivate:[AuthenticationGuard],
                loadChildren: () => import('src/app/pages/theaters/theaters.module').then(m => m.TheatersModule)
=======
                path: 'chat',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/chat/chat.module').then(m => m.ChatModule)
            },
            {
                path: 'horario',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/horario/horario.module').then(m => m.HorarioModule)
            },
            {
                path: 'profesionales',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/profesionales/profesionales.module').then(m => m.ProfesionalesModule)
            },
            {
                path: 'sesiones',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/sesiones/sesiones.module').then(m => m.SesionesModule)
>>>>>>> safemind-web-app
            }
        ]
    }
];
