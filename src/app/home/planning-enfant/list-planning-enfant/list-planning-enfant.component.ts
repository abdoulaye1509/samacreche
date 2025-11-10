import { Component, OnDestroy, OnInit } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddPlanningEnfantComponent } from '../add-planning-enfant/add-planning-enfant.component';
  import { EditPlanningEnfantComponent } from '../edit-planning-enfant/edit-planning-enfant.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
import { PlanningEnfantTafType } from '../taf-type/planning-enfant-taf-type';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-planning-enfant',
    standalone: true, // Composant autonome
    imports: [FormsModule,NgSelectModule], // Dépendances importées
    templateUrl: './list-planning-enfant.component.html',
    styleUrls: ['./list-planning-enfant.component.scss']
  })
  export class ListPlanningEnfantComponent implements OnInit, OnDestroy{
    loading_get_planning_enfant = false
    loading_delete_planning_enfant = false
    les_planning_enfants: PlanningEnfantTafType[] = []
    list: PlanningEnfantTafType[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListPlanningEnfantComponent");
      this.get_planning_enfant()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_planning_enfant() {
      this.loading_get_planning_enfant = true;
      this.api.taf_post("planning_enfant/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_planning_enfants = reponse.data
          console.log("Opération effectuée avec succés sur la table planning_enfant. Réponse= ", reponse);
          this.filter_change();
        } else {
          console.log("L'opération sur la table planning_enfant a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_planning_enfant = false;
      }, (error: any) => {
        this.loading_get_planning_enfant = false;
      })
    }
    filter_change(event?: any) {
      this.list = this.les_planning_enfants.filter((one: any) => {
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
    delete_planning_enfant (planning_enfant : any){
      this.loading_delete_planning_enfant = true;
      this.api.taf_post("planning_enfant/delete", planning_enfant,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table planning_enfant . Réponse = ",reponse)
          this.get_planning_enfant()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table planning_enfant  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_planning_enfant = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_planning_enfant = false;
      })
    }
    openModal_add_planning_enfant() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddPlanningEnfantComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_planning_enfant()
        } else {

        }
      })
    }
    openModal_edit_planning_enfant(one_planning_enfant: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditPlanningEnfantComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.planning_enfant_to_edit = one_planning_enfant;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_planning_enfant()
        } else {

        }
      })
    }
  }