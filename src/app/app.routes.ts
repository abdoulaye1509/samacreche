import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth/auth.guard';
import { HomeComponent } from './home/home/home.component';
import { PublicComponent } from './public/public/public.component';

export const routes: Routes = [
  // { path: "", pathMatch: "full", redirectTo: "public" },
  {
    path: "",
    component: PublicComponent,
    children: [
      {
        path: "",
        loadChildren: () => import("./public/public.module").then((m) => m.PublicModule)
      }
    ],
  },
  {
    path: "home",
    component: HomeComponent,
    children: [
      {
        path: "",
        loadChildren: () => import("./home/home.module").then((m) => m.HomeModule)
      }
    ],
    canActivate: [AuthGuard]
  },

];
