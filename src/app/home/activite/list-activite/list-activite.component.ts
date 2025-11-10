import { Component, OnDestroy, OnInit } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddActiviteComponent } from '../add-activite/add-activite.component';
  import { EditActiviteComponent } from '../edit-activite/edit-activite.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
import { ActiviteTafType } from '../taf-type/activite-taf-type';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-activite',
    standalone: true, // Composant autonome
    imports: [FormsModule,NgSelectModule], // Dépendances importées
    templateUrl: './list-activite.component.html',
    styleUrls: ['./list-activite.component.scss']
  })
  export class ListActiviteComponent implements OnInit, OnDestroy{
    loading_get_activite = false
    loading_delete_activite = false
    les_activites: ActiviteTafType[] = []
    list: ActiviteTafType[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListActiviteComponent");
      this.get_activite()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_activite() {
      this.loading_get_activite = true;
      this.api.taf_post("activite/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_activites = reponse.data
          console.log("Opération effectuée avec succés sur la table activite. Réponse= ", reponse);
          this.filter_change();
        } else {
          console.log("L'opération sur la table activite a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_activite = false;
      }, (error: any) => {
        this.loading_get_activite = false;
      })
    }
    filter_change(event?: any) {
      this.list = this.les_activites.filter((one: any) => {
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
    delete_activite (activite : any){
      this.loading_delete_activite = true;
      this.api.taf_post("activite/delete", activite,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table activite . Réponse = ",reponse)
          this.get_activite()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table activite  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_activite = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_activite = false;
      })
    }
    openModal_add_activite() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddActiviteComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_activite()
        } else {

        }
      })
    }
    openModal_edit_activite(one_activite: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditActiviteComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.activite_to_edit = one_activite;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_activite()
        } else {

        }
      })
    }
  }