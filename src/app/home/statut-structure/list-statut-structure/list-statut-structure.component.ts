import { Component, OnDestroy, OnInit } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddStatutStructureComponent } from '../add-statut-structure/add-statut-structure.component';
  import { EditStatutStructureComponent } from '../edit-statut-structure/edit-statut-structure.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
import { StatutStructureTafType } from '../taf-type/statut-structure-taf-type';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-statut-structure',
    standalone: true, // Composant autonome
    imports: [FormsModule,NgSelectModule], // Dépendances importées
    templateUrl: './list-statut-structure.component.html',
    styleUrls: ['./list-statut-structure.component.scss']
  })
  export class ListStatutStructureComponent implements OnInit, OnDestroy{
    loading_get_statut_structure = false
    loading_delete_statut_structure = false
    les_statut_structures: StatutStructureTafType[] = []
    list: StatutStructureTafType[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListStatutStructureComponent");
      this.get_statut_structure()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_statut_structure() {
      this.loading_get_statut_structure = true;
      this.api.taf_post("statut_structure/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_statut_structures = reponse.data
          console.log("Opération effectuée avec succés sur la table statut_structure. Réponse= ", reponse);
          this.filter_change();
        } else {
          console.log("L'opération sur la table statut_structure a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_statut_structure = false;
      }, (error: any) => {
        this.loading_get_statut_structure = false;
      })
    }
    filter_change(event?: any) {
      this.list = this.les_statut_structures.filter((one: any) => {
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
    delete_statut_structure (statut_structure : any){
      this.loading_delete_statut_structure = true;
      this.api.taf_post("statut_structure/delete", statut_structure,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table statut_structure . Réponse = ",reponse)
          this.get_statut_structure()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table statut_structure  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_statut_structure = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_statut_structure = false;
      })
    }
    openModal_add_statut_structure() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddStatutStructureComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_statut_structure()
        } else {

        }
      })
    }
    openModal_edit_statut_structure(one_statut_structure: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditStatutStructureComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.statut_structure_to_edit = one_statut_structure;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_statut_structure()
        } else {

        }
      })
    }
  }