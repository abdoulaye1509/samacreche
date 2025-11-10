import { Component, OnDestroy, OnInit } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddStructureUtilisateurComponent } from '../add-structure-utilisateur/add-structure-utilisateur.component';
  import { EditStructureUtilisateurComponent } from '../edit-structure-utilisateur/edit-structure-utilisateur.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
import { StructureUtilisateurTafType } from '../taf-type/structure-utilisateur-taf-type';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-structure-utilisateur',
    standalone: true, // Composant autonome
    imports: [FormsModule,NgSelectModule], // Dépendances importées
    templateUrl: './list-structure-utilisateur.component.html',
    styleUrls: ['./list-structure-utilisateur.component.scss']
  })
  export class ListStructureUtilisateurComponent implements OnInit, OnDestroy{
    loading_get_structure_utilisateur = false
    loading_delete_structure_utilisateur = false
    les_structure_utilisateurs: StructureUtilisateurTafType[] = []
    list: StructureUtilisateurTafType[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListStructureUtilisateurComponent");
      this.get_structure_utilisateur()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_structure_utilisateur() {
      this.loading_get_structure_utilisateur = true;
      this.api.taf_post("structure_utilisateur/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_structure_utilisateurs = reponse.data
          console.log("Opération effectuée avec succés sur la table structure_utilisateur. Réponse= ", reponse);
          this.filter_change();
        } else {
          console.log("L'opération sur la table structure_utilisateur a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_structure_utilisateur = false;
      }, (error: any) => {
        this.loading_get_structure_utilisateur = false;
      })
    }
    filter_change(event?: any) {
      this.list = this.les_structure_utilisateurs.filter((one: any) => {
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
    delete_structure_utilisateur (structure_utilisateur : any){
      this.loading_delete_structure_utilisateur = true;
      this.api.taf_post("structure_utilisateur/delete", structure_utilisateur,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table structure_utilisateur . Réponse = ",reponse)
          this.get_structure_utilisateur()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table structure_utilisateur  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_structure_utilisateur = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_structure_utilisateur = false;
      })
    }
    openModal_add_structure_utilisateur() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddStructureUtilisateurComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_structure_utilisateur()
        } else {

        }
      })
    }
    openModal_edit_structure_utilisateur(one_structure_utilisateur: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditStructureUtilisateurComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.structure_utilisateur_to_edit = one_structure_utilisateur;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_structure_utilisateur()
        } else {

        }
      })
    }
  }