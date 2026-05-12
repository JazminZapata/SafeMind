import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { AuthenticationGuard } from 'src/app/guards/authentication.guard';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'user-profile', component: UserProfileComponent },
    {
        path: '',
        children: [
            {
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
            }
        ]
    }
];
