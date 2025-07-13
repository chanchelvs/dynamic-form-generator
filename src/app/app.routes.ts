import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Routes } from '@angular/router';


export const routes: Routes = [ { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
{ path: 'dashboard', component: DashboardComponent }];
