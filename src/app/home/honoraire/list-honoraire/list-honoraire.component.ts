import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import { AddHonoraireComponent } from '../add-honoraire/add-honoraire.component';
import { EditHonoraireComponent } from '../edit-honoraire/edit-honoraire.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HonoraireTafType } from '../taf-type/honoraire-taf-type';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-list-honoraire',
  standalone: true, // Composant autonome
  imports: [FormsModule, NgSelectModule, CommonModule,RouterLink], // Dépendances importées
  templateUrl: './list-honoraire.component.html',
  styleUrls: ['./list-honoraire.component.scss']
})
export class ListHonoraireComponent implements OnInit, OnDestroy {
  loading_get_honoraire = false
  loading_delete_honoraire = false
  les_honoraires: HonoraireTafType[] = []
  list: HonoraireTafType[] = []
  filter: any = {
    text: [],
  };
  @Input()
  id_honoraire: number | null = null;
  constructor(public api: ApiService, private modalService: NgbModal) {

  }
  ngOnInit(): void {
    console.groupCollapsed("ListHonoraireComponent");
    this.get_honoraire()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }

    get_honoraire() {
  this.loading_get_honoraire = true;

  try {
    const id_structure = this.api?.user_connected?.id_structure ?? null;

    if (!id_structure) {
      // 1) Soit on attend que l’api soit prête (voir option B ci-dessous)
      // 2) Soit on stoppe le spinner + on retente un peu plus tard
      this.loading_get_honoraire = false;
      console.warn('[honoraire] id_structure manquant au reload; attente du profil…');
      setTimeout(() => this.get_honoraire(), 150); // petit retry
      return;
    }

    this.api.taf_post_object(
      'honoraire/get',
      { 'id_structure': id_structure },
      (reponse: any) => {
        this.loading_get_honoraire = false; // <— stop spinner
        if (reponse?.status) {
          this.les_honoraires = reponse.data || [];
          this.filter_change();
        } else {
          this.api.Swal_error("L'opération a échoué");
        }
      },
      () => (this.loading_get_honoraire = false) // <— stop spinner même en erreur
    );
  } catch (e) {
    this.loading_get_honoraire = false; // <— ne jamais laisser le spinner
    console.error(e);
  }
}
  filter_change(event?: any) {
    this.list = this.les_honoraires.filter((one: any) => {
      let search = !event?.term || JSON.stringify(one).toLowerCase().replace(/s/g, '')
        .includes(event?.term?.toLowerCase().replace(/s/g, ''))
      // filtre complexe
      // let filtre_objet: any = {}
      // let text = !this.filter.text || this.filter.text.length == 0
      //   || this.filter.text.filter((one_filtre: string) => {
      //     let domaine = !one_filtre.startsWith('domaine_') || (one_filtre.startsWith('domaine_') && one_filtre.replace('domaine_', '') == one.id_domaine)
      //     let zone = !one_filtre.startsWith('zone_') || (one_filtre.startsWith('zone_') && one_filtre.replace('zone_', '') == one.id_zone)

      //     // Incrémenter les compteurs
      //     if (one_filtre.startsWith('domaine_')) filtre_objet.domaine_ = (filtre_objet.domaine_ || 0) + 1
      //     if (one_filtre.startsWith('zone_')) filtre_objet.zone_ = (filtre_objet.zone_ || 0) + 1
      //     return domaine && zone
      //   }).length >= Object.keys(filtre_objet).length

      return search// && text
    })
  }
  delete_honoraire(honoraire: any) {
    this.loading_delete_honoraire = true;
    this.api.taf_post("honoraire/delete", honoraire, (reponse: any) => {
      //when success
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table honoraire . Réponse = ", reponse)
        this.get_honoraire()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table honoraire  a échoué. Réponse = ", reponse)
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_delete_honoraire = false;
    },
      (error: any) => {
        //when error
        console.log("Erreur inconnue! ", error)
        this.loading_delete_honoraire = false;
      })
  }
  openModal_add_honoraire() {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "xl"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(AddHonoraireComponent, { ...options, backdrop: 'static' })
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_honoraire()
      } else {

      }
    })
  }
  openModal_edit_honoraire(one_honoraire: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "xl"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(EditHonoraireComponent, { ...options, backdrop: 'static', })
    modalRef.componentInstance.honoraire_to_edit = one_honoraire;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_honoraire()
      } else {

      }
    })
  }
  trackByHonoraire = (_: number, h: any) => h.id_honoraire;

  money(v: any): string {
    return (this.api.formatMontant(v, 0, ' ', ',') || '0') + ' CFA';
  }

  fullname(h: any): string {
    const p = (h?.prenom_utilisateur || '').trim();
    const n = (h?.nom_utilisateur || '').trim();
    return (p || n) ? `${p} ${n}`.trim() : `Utilisateur #${h?.id_utilisateur}`;
  }

}