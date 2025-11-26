import { Component, OnDestroy, OnInit } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddStructureComponent } from '../add-structure/add-structure.component';
  import { EditStructureComponent } from '../edit-structure/edit-structure.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
import { StructureTafType } from '../taf-type/structure-taf-type';
  import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
  @Component({
    selector: 'app-list-structure',
    standalone: true, // Composant autonome
    imports: [FormsModule,NgSelectModule,CommonModule], // Dépendances importées
    templateUrl: './list-structure.component.html',
    styleUrls: ['./list-structure.component.scss']
  })
  export class ListStructureComponent implements OnInit, OnDestroy{
    loading_get_structure = false
    loading_delete_structure = false
    les_structures: StructureTafType[] = []
    list: StructureTafType[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListStructureComponent");
      this.get_structure()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_structure() {
      this.loading_get_structure = true;
      this.api.taf_post("structure/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_structures = reponse.data
          console.log("Opération effectuée avec succés sur la table structure. Réponse= ", reponse);
          this.filter_change();
        } else {
          console.log("L'opération sur la table structure a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_structure = false;
      }, (error: any) => {
        this.loading_get_structure = false;
      })
    }
    filter_change(event?: any) {
      this.list = this.les_structures.filter((one: any) => {
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
    delete_structure (structure : any){
      this.loading_delete_structure = true;
      this.api.taf_post("structure/delete", structure,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table structure . Réponse = ",reponse)
          this.get_structure()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table structure  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_structure = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_structure = false;
      })
    }
    openModal_add_structure() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddStructureComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_structure()
        } else {

        }
      })
    }
    openModal_edit_structure(one_structure: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditStructureComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.structure_to_edit = one_structure;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_structure()
        } else {

        }
      })
    }
  }