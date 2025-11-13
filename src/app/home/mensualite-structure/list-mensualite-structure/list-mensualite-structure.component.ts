import { Component, OnDestroy, OnInit } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddMensualiteStructureComponent } from '../add-mensualite-structure/add-mensualite-structure.component';
  import { EditMensualiteStructureComponent } from '../edit-mensualite-structure/edit-mensualite-structure.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
import { MensualiteStructureTafType } from '../taf-type/mensualite-structure-taf-type';
  import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
  @Component({
    selector: 'app-list-mensualite-structure',
    standalone: true, // Composant autonome
    imports: [FormsModule,NgSelectModule,CommonModule], // Dépendances importées
    templateUrl: './list-mensualite-structure.component.html',
    styleUrls: ['./list-mensualite-structure.component.scss']
  })
  export class ListMensualiteStructureComponent implements OnInit, OnDestroy{
    loading_get_mensualite_structure = false
    loading_delete_mensualite_structure = false
    les_mensualite_structures: MensualiteStructureTafType[] = []
    list: MensualiteStructureTafType[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListMensualiteStructureComponent");
      this.get_mensualite_structure()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_mensualite_structure() {
      this.loading_get_mensualite_structure = true;
      this.api.taf_post("mensualite_structure/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_mensualite_structures = reponse.data
          console.log("Opération effectuée avec succés sur la table mensualite_structure. Réponse= ", reponse);
          this.filter_change();
        } else {
          console.log("L'opération sur la table mensualite_structure a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_mensualite_structure = false;
      }, (error: any) => {
        this.loading_get_mensualite_structure = false;
      })
    }
    filter_change(event?: any) {
      this.list = this.les_mensualite_structures.filter((one: any) => {
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
    delete_mensualite_structure (mensualite_structure : any){
      this.loading_delete_mensualite_structure = true;
      this.api.taf_post("mensualite_structure/delete", mensualite_structure,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table mensualite_structure . Réponse = ",reponse)
          this.get_mensualite_structure()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table mensualite_structure  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_mensualite_structure = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_mensualite_structure = false;
      })
    }
    openModal_add_mensualite_structure() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddMensualiteStructureComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_mensualite_structure()
        } else {

        }
      })
    }
    openModal_edit_mensualite_structure(one_mensualite_structure: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditMensualiteStructureComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.mensualite_structure_to_edit = one_mensualite_structure;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_mensualite_structure()
        } else {

        }
      })
    }
    trackById = (_: number, m: any) => m?.id_mensualite_structure ?? _;

  }