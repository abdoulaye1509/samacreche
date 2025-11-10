import { Component, OnDestroy, OnInit } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddParentEnfantComponent } from '../add-parent-enfant/add-parent-enfant.component';
  import { EditParentEnfantComponent } from '../edit-parent-enfant/edit-parent-enfant.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
import { ParentEnfantTafType } from '../taf-type/parent-enfant-taf-type';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-parent-enfant',
    standalone: true, // Composant autonome
    imports: [FormsModule,NgSelectModule], // Dépendances importées
    templateUrl: './list-parent-enfant.component.html',
    styleUrls: ['./list-parent-enfant.component.scss']
  })
  export class ListParentEnfantComponent implements OnInit, OnDestroy{
    loading_get_parent_enfant = false
    loading_delete_parent_enfant = false
    les_parent_enfants: ParentEnfantTafType[] = []
    list: ParentEnfantTafType[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListParentEnfantComponent");
      this.get_parent_enfant()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_parent_enfant() {
      this.loading_get_parent_enfant = true;
      this.api.taf_post("parent_enfant/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_parent_enfants = reponse.data
          console.log("Opération effectuée avec succés sur la table parent_enfant. Réponse= ", reponse);
          this.filter_change();
        } else {
          console.log("L'opération sur la table parent_enfant a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_parent_enfant = false;
      }, (error: any) => {
        this.loading_get_parent_enfant = false;
      })
    }
    filter_change(event?: any) {
      this.list = this.les_parent_enfants.filter((one: any) => {
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
    delete_parent_enfant (parent_enfant : any){
      this.loading_delete_parent_enfant = true;
      this.api.taf_post("parent_enfant/delete", parent_enfant,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table parent_enfant . Réponse = ",reponse)
          this.get_parent_enfant()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table parent_enfant  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_parent_enfant = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_parent_enfant = false;
      })
    }
    openModal_add_parent_enfant() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddParentEnfantComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_parent_enfant()
        } else {

        }
      })
    }
    openModal_edit_parent_enfant(one_parent_enfant: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditParentEnfantComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.parent_enfant_to_edit = one_parent_enfant;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_parent_enfant()
        } else {

        }
      })
    }
  }