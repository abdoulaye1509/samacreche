import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListLoginComponent } from './login/list-login/list-login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  { path: "", component: LandingPageComponent },
  { path: "login", component: ListLoginComponent },
  { path: "Accueil", component: LandingPageComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }