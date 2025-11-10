import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ApiService } from '../../service/api/api.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private api: ApiService, private routage: Router) { }

  async canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    var infos = await this.api.get_from_local_storage("infos")
    console.log("infos on guard= ", infos);
    const token = await this.api.get_token();
    if (token) {
      await this.api.update_data_from_token();
      if (!this.api.token.is_expired) {
        await this.api.ensure_infos();   // crée/charge infos + reconstruit le menu
        this.api.custom_menu();          // sécurité
        return true;
      }
    }
    this.routage.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}