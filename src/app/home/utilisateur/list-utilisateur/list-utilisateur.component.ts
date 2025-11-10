import { Component, OnDestroy, OnInit } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddUtilisateurComponent } from '../add-utilisateur/add-utilisateur.component';
  import { EditUtilisateurComponent } from '../edit-utilisateur/edit-utilisateur.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
import { UtilisateurTafType } from '../taf-type/utilisateur-taf-type';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-utilisateur',
    standalone: true, // Composant autonome
    imports: [FormsModule,NgSelectModule], // Dépendances importées
    templateUrl: './list-utilisateur.component.html',
    styleUrls: ['./list-utilisateur.component.scss']
  })
  export class ListUtilisateurComponent implements OnInit, OnDestroy{
    loading_get_utilisateur = false
    loading_delete_utilisateur = false
    les_utilisateurs: UtilisateurTafType[] = []
    list: UtilisateurTafType[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListUtilisateurComponent");
      this.get_utilisateur()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_utilisateur() {
      this.loading_get_utilisateur = true;
      this.api.taf_post("utilisateur/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_utilisateurs = reponse.data
          console.log("Opération effectuée avec succés sur la table utilisateur. Réponse= ", reponse);
          this.filter_change();
        } else {
          console.log("L'opération sur la table utilisateur a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_utilisateur = false;
      }, (error: any) => {
        this.loading_get_utilisateur = false;
      })
    }
    filter_change(event?: any) {
      this.list = this.les_utilisateurs.filter((one: any) => {
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
    delete_utilisateur (utilisateur : any){
      this.loading_delete_utilisateur = true;
      this.api.taf_post("utilisateur/delete", utilisateur,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table utilisateur . Réponse = ",reponse)
          this.get_utilisateur()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table utilisateur  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_utilisateur = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_utilisateur = false;
      })
    }
    openModal_add_utilisateur() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddUtilisateurComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_utilisateur()
        } else {

        }
      })
    }
    openModal_edit_utilisateur(one_utilisateur: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditUtilisateurComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.utilisateur_to_edit = one_utilisateur;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_utilisateur()
        } else {

        }
      })
    }
  }