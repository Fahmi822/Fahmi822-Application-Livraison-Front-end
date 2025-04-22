import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { LivreurDashboardComponent } from './components/livreur-dashboard/livreur-dashboard.component';
import { ListClientsComponent } from './components/admin/list-clients/list-clients.component';
import { ListLivreursComponent } from './components/admin/list-livreurs/list-livreurs.component';
import { AddLivreurComponent } from './components/admin/add-livreur/add-livreur.component';
import { CategoriesComponent } from './components/admin/categories/categories.component';
import { ProduitsComponent } from './components/admin/produits/produits.component';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Page d'accueil
  { path: 'login', component: LoginComponent }, // Page de connexion
  { path: 'register', component: RegisterComponent }, // Page d'inscription
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [RoleGuard], // Appliquer le garde
    data: { role: 'Admin' }, // Rôle requis
    children: [
      {
        path: 'add-livreur',component: AddLivreurComponent,},
      {
        path: 'list-clients',component: ListClientsComponent,},
      {
        path: 'list-livreurs',component: ListLivreursComponent,},
      { 
        path: 'categories', component: CategoriesComponent },
      {
        path: 'produits', component: ProduitsComponent },
      { 
        path: 'produits/categorie/:id', component: ProduitsComponent }
    ],
  },
  {
    path: 'client-dashboard',
    component: ClientDashboardComponent,
    canActivate: [RoleGuard], // Appliquer le garde
    data: { role: 'Client' }, // Rôle requis
  },
  {
    path: 'livreur-dashboard',
    component: LivreurDashboardComponent,
    canActivate: [RoleGuard], // Appliquer le garde
    data: { role: 'Livreur' }, // Rôle requis
  },
];