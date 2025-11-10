import { Component, OnDestroy, OnInit } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddPlanningEquipeComponent } from '../add-planning-equipe/add-planning-equipe.component';
  import { EditPlanningEquipeComponent } from '../edit-planning-equipe/edit-planning-equipe.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
import { PlanningEquipeTafType } from '../taf-type/planning-equipe-taf-type';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-planning-equipe',
    standalone: true, // Composant autonome
    imports: [FormsModule,NgSelectModule], // Dépendances importées
    templateUrl: './list-planning-equipe.component.html',
    styleUrls: ['./list-planning-equipe.component.scss']
  })
  export class ListPlanningEquipeComponent implements OnInit, OnDestroy{
    loading_get_planning_equipe = false
    loading_delete_planning_equipe = false
    les_planning_equipes: PlanningEquipeTafType[] = []
    list: PlanningEquipeTafType[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListPlanningEquipeComponent");
      this.get_planning_equipe()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_planning_equipe() {
      this.loading_get_planning_equipe = true;
      this.api.taf_post("planning_equipe/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_planning_equipes = reponse.data
          console.log("Opération effectuée avec succés sur la table planning_equipe. Réponse= ", reponse);
          this.filter_change();
        } else {
          console.log("L'opération sur la table planning_equipe a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_planning_equipe = false;
      }, (error: any) => {
        this.loading_get_planning_equipe = false;
      })
    }
    filter_change(event?: any) {
      this.list = this.les_planning_equipes.filter((one: any) => {
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
    delete_planning_equipe (planning_equipe : any){
      this.loading_delete_planning_equipe = true;
      this.api.taf_post("planning_equipe/delete", planning_equipe,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table planning_equipe . Réponse = ",reponse)
          this.get_planning_equipe()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table planning_equipe  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_planning_equipe = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_planning_equipe = false;
      })
    }
    openModal_add_planning_equipe() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddPlanningEquipeComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_planning_equipe()
        } else {

        }
      })
    }
    openModal_edit_planning_equipe(one_planning_equipe: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditPlanningEquipeComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.planning_equipe_to_edit = one_planning_equipe;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_planning_equipe()
        } else {

        }
      })
    }
  }