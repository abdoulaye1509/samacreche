import { Component, Input, OnDestroy, OnInit } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddFacturationComponent } from '../add-facturation/add-facturation.component';
  import { EditFacturationComponent } from '../edit-facturation/edit-facturation.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
import { FacturationTafType } from '../taf-type/facturation-taf-type';
  import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
  @Component({
    selector: 'app-list-facturation',
    standalone: true, // Composant autonome
    imports: [FormsModule,NgSelectModule,RouterLink,CommonModule], // Dépendances importées
    templateUrl: './list-facturation.component.html',
    styleUrls: ['./list-facturation.component.scss']
  })
  export class ListFacturationComponent implements OnInit, OnDestroy{
    loading_get_facturation = false
    loading_delete_facturation = false
    les_facturations: FacturationTafType[] = []
    list: FacturationTafType[] = []
    filter: any = {
      text: [],
    };
    @Input()
    id_facturation: number | null = null;
    constructor(public api: ApiService,private modalService: NgbModal,private router: Router) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListFacturationComponent");
      this.get_facturation()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
  get_facturation() {
  this.loading_get_facturation = true;

  try {
    const id_structure = this.api?.user_connected?.id_structure ?? null;

    if (!id_structure) {
      // 1) Soit on attend que l’api soit prête (voir option B ci-dessous)
      // 2) Soit on stoppe le spinner + on retente un peu plus tard
      this.loading_get_facturation = false;
      console.warn('[facturation] id_structure manquant au reload; attente du profil…');
      setTimeout(() => this.get_facturation(), 150); // petit retry
      return;
    }

    this.api.taf_post_object(
      'facturation/get',
      { 'f.id_structure': id_structure },
      (reponse: any) => {
        this.loading_get_facturation = false; // <— stop spinner
        if (reponse?.status) {
          this.les_facturations = reponse.data || [];
          this.filter_change();
        } else {
          this.api.Swal_error("L'opération a échoué");
        }
      },
      () => (this.loading_get_facturation = false) // <— stop spinner même en erreur
    );
  } catch (e) {
    this.loading_get_facturation = false; // <— ne jamais laisser le spinner
    console.error(e);
  }
}

    filter_change(event?: any) {
      this.list = this.les_facturations.filter((one: any) => {
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
    delete_facturation (facturation : any){
      this.loading_delete_facturation = true;
      this.api.taf_post("facturation/delete", facturation,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table facturation . Réponse = ",reponse)
          this.get_facturation()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table facturation  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_facturation = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_facturation = false;
      })
    }
    openModal_add_facturation() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddFacturationComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_facturation()
        } else {

        }
      })
    }
    openModal_edit_facturation(one_facturation: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditFacturationComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.facturation_to_edit = one_facturation;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_facturation()
        } else {

        }
      })
    }
    money(v: any): string {
    const n = Number(v || 0);
    return n.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' CFA';
  }

  fullname(f: any): string {
    // si ta requête GET joint 'enfant', on l’affiche; sinon fallback
    const p = (f?.prenom_enfant || '').trim();
    const n = (f?.nom_enfant || '').trim();
    return (p || n) ? `${p} ${n}`.trim() : `Enfant #${f.id_enfant}`;
  }

  statusClass(f: any): string {
    // colorise le badge selon le libellé (optionnel)
    const lib = (f?.libelle_statut_facture || '').toLowerCase();
    if (lib.includes('pay')) return 'bg-success-subtle text-success';
    if (lib.includes('emise')) return 'bg-primary-subtle text-primary';
    if (lib.includes('brouillon')) return 'bg-warning-subtle text-warning';
    if (lib.includes('annul')) return 'bg-danger-subtle text-danger';
    return 'bg-light text-secondary';
  }
  }