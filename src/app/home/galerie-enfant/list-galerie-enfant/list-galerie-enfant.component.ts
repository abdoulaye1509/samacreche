import { Component, OnDestroy, OnInit } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddGalerieEnfantComponent } from '../add-galerie-enfant/add-galerie-enfant.component';
  import { EditGalerieEnfantComponent } from '../edit-galerie-enfant/edit-galerie-enfant.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
import { GalerieEnfantTafType } from '../taf-type/galerie-enfant-taf-type';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-galerie-enfant',
    standalone: true, // Composant autonome
    imports: [FormsModule,NgSelectModule], // Dépendances importées
    templateUrl: './list-galerie-enfant.component.html',
    styleUrls: ['./list-galerie-enfant.component.scss']
  })
  export class ListGalerieEnfantComponent implements OnInit, OnDestroy{
    loading_get_galerie_enfant = false
    loading_delete_galerie_enfant = false
    les_galerie_enfants: GalerieEnfantTafType[] = []
    list: GalerieEnfantTafType[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListGalerieEnfantComponent");
      this.get_galerie_enfant()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_galerie_enfant() {
      this.loading_get_galerie_enfant = true;
      this.api.taf_post("galerie_enfant/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_galerie_enfants = reponse.data
          console.log("Opération effectuée avec succés sur la table galerie_enfant. Réponse= ", reponse);
          this.filter_change();
        } else {
          console.log("L'opération sur la table galerie_enfant a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_galerie_enfant = false;
      }, (error: any) => {
        this.loading_get_galerie_enfant = false;
      })
    }
    filter_change(event?: any) {
      this.list = this.les_galerie_enfants.filter((one: any) => {
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
    delete_galerie_enfant (galerie_enfant : any){
      this.loading_delete_galerie_enfant = true;
      this.api.taf_post("galerie_enfant/delete", galerie_enfant,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table galerie_enfant . Réponse = ",reponse)
          this.get_galerie_enfant()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table galerie_enfant  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_galerie_enfant = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_galerie_enfant = false;
      })
    }
    openModal_add_galerie_enfant() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddGalerieEnfantComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_galerie_enfant()
        } else {

        }
      })
    }
    openModal_edit_galerie_enfant(one_galerie_enfant: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditGalerieEnfantComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.galerie_enfant_to_edit = one_galerie_enfant;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_galerie_enfant()
        } else {

        }
      })
    }
  }