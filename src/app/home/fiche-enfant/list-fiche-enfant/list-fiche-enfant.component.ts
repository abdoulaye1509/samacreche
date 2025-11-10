import { Component, OnDestroy, OnInit } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddFicheEnfantComponent } from '../add-fiche-enfant/add-fiche-enfant.component';
  import { EditFicheEnfantComponent } from '../edit-fiche-enfant/edit-fiche-enfant.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
import { FicheEnfantTafType } from '../taf-type/fiche-enfant-taf-type';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-fiche-enfant',
    standalone: true, // Composant autonome
    imports: [FormsModule,NgSelectModule], // Dépendances importées
    templateUrl: './list-fiche-enfant.component.html',
    styleUrls: ['./list-fiche-enfant.component.scss']
  })
  export class ListFicheEnfantComponent implements OnInit, OnDestroy{
    loading_get_fiche_enfant = false
    loading_delete_fiche_enfant = false
    les_fiche_enfants: FicheEnfantTafType[] = []
    list: FicheEnfantTafType[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListFicheEnfantComponent");
      this.get_fiche_enfant()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_fiche_enfant() {
      this.loading_get_fiche_enfant = true;
      this.api.taf_post("fiche_enfant/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_fiche_enfants = reponse.data
          console.log("Opération effectuée avec succés sur la table fiche_enfant. Réponse= ", reponse);
          this.filter_change();
        } else {
          console.log("L'opération sur la table fiche_enfant a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_fiche_enfant = false;
      }, (error: any) => {
        this.loading_get_fiche_enfant = false;
      })
    }
    filter_change(event?: any) {
      this.list = this.les_fiche_enfants.filter((one: any) => {
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
    delete_fiche_enfant (fiche_enfant : any){
      this.loading_delete_fiche_enfant = true;
      this.api.taf_post("fiche_enfant/delete", fiche_enfant,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table fiche_enfant . Réponse = ",reponse)
          this.get_fiche_enfant()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table fiche_enfant  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_fiche_enfant = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_fiche_enfant = false;
      })
    }
    openModal_add_fiche_enfant() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddFicheEnfantComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_fiche_enfant()
        } else {

        }
      })
    }
    openModal_edit_fiche_enfant(one_fiche_enfant: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditFicheEnfantComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.fiche_enfant_to_edit = one_fiche_enfant;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_fiche_enfant()
        } else {

        }
      })
    }
  }