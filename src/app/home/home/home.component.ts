import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { ApiService } from '../../service/api/api.service';

@Component({
  selector: 'app-home',
  standalone: true, // Composant autonome
  imports: [RouterModule, NgbDropdownModule, SidebarComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user_connected: any;
  constructor(private api: ApiService) {
    // api.custom_menu();
  }
  ngOnInit(): void {
    // this.user_connected = this.api.token.user_connected
    // console.log("user_connected dans home", this.user_connected);
    let id_utilisateur = this.api.token.user_connected.id_utilisateur;
    this.get_utilisateur();

  }
  // récuperer les informations de l'utilisateur connectés
  // user_connected(){

  // }
  get_utilisateur() {
    console.log("id_utilisateur dans get_utilisateur", this.api.token.user_connected.id_utilisateur);
    this.api.loading_get_utilisateur = true;
    this.api.taf_post_object('utilisateur/auth', { 'u.id_utilisateur': this.api.token.user_connected.id_utilisateur },
      async (reponse: any) => {
       
        if (reponse.status) {
          // const droits = this.normalizeLesDroits(reponse?.data?.action);
          // this.api.les_droits = droits;
          // console.log('droits dans home = ', this.api.les_droits);
          // await this.api.save_on_local_storage("les_droits", droits);
          // this.api.custom_menu();
          // 🔹 1) Mémoriser l'utilisateur dans le service
          this.api.user_connected = reponse.data;
          console.log('utilisateur/auth= ', this.api.user_connected);

          // 🔹 2) Sauvegarder en local (IndexedDB) pour les prochains rechargements
          await this.api.save_on_local_storage('user_connected', reponse.data);

          // 🔹 3) (optionnel mais pratique) mettre à jour infos.current_structure
          this.api.infos.current_structure = {
            id_structure: reponse.data.id_structure,
            nom_structure: reponse.data.nom_structure,
            adresse_structure: reponse.data.adresse_structure,
            telephone_structure: reponse.data.telephone_structure,
            logo_structure: reponse.data.logo_structure,
            id_statut_structure: reponse.data.id_statut_structure,
            nom_court: reponse.data.nom_court,
          };
          await this.api.save_on_local_storage('infos', this.api.infos);

          setTimeout(() => {
            this.api.loading_get_utilisateur = false;
          }, 500);
        }

        else {
          console.log("L'opération sur la table utilisateur a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué");
          this.api.loading_get_utilisateur = false;
        }
      },
      (error: any) => {
        this.api.loading_get_utilisateur = false;
      }
    );
  }
  private normalizeLesDroits(raw: any): any[] {
    if (Array.isArray(raw)) return raw;

    if (raw && typeof raw === 'object' && 'les_droits' in raw) {
      try {
        let v: any = (raw as any).les_droits;            // { les_droits: '..."' }
        let first = typeof v === 'string' ? JSON.parse(v) : v;
        return Array.isArray(first)
          ? first
          : (typeof first === 'string' ? JSON.parse(first) : []);
      } catch { return []; }
    }

    if (typeof raw === 'string') {
      try {
        const first = JSON.parse(raw);                   // string JSON
        return Array.isArray(first)
          ? first
          : (typeof first === 'string' ? JSON.parse(first) : []);
      } catch { return []; }
    }

    return [];
  }
}
