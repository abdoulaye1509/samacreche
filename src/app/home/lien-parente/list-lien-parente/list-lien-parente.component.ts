import { Component, OnDestroy, OnInit } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddLienParenteComponent } from '../add-lien-parente/add-lien-parente.component';
  import { EditLienParenteComponent } from '../edit-lien-parente/edit-lien-parente.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
import { LienParenteTafType } from '../taf-type/lien-parente-taf-type';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-lien-parente',
    standalone: true, // Composant autonome
    imports: [FormsModule,NgSelectModule], // Dépendances importées
    templateUrl: './list-lien-parente.component.html',
    styleUrls: ['./list-lien-parente.component.scss']
  })
  export class ListLienParenteComponent implements OnInit, OnDestroy{
    loading_get_lien_parente = false
    loading_delete_lien_parente = false
    les_lien_parentes: LienParenteTafType[] = []
    list: LienParenteTafType[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListLienParenteComponent");
      this.get_lien_parente()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_lien_parente() {
      this.loading_get_lien_parente = true;
      this.api.taf_post("lien_parente/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_lien_parentes = reponse.data
          console.log("Opération effectuée avec succés sur la table lien_parente. Réponse= ", reponse);
          this.filter_change();
        } else {
          console.log("L'opération sur la table lien_parente a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_lien_parente = false;
      }, (error: any) => {
        this.loading_get_lien_parente = false;
      })
    }
    filter_change(event?: any) {
      this.list = this.les_lien_parentes.filter((one: any) => {
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
    delete_lien_parente (lien_parente : any){
      this.loading_delete_lien_parente = true;
      this.api.taf_post("lien_parente/delete", lien_parente,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table lien_parente . Réponse = ",reponse)
          this.get_lien_parente()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table lien_parente  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_lien_parente = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_lien_parente = false;
      })
    }
    openModal_add_lien_parente() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddLienParenteComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_lien_parente()
        } else {

        }
      })
    }
    openModal_edit_lien_parente(one_lien_parente: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditLienParenteComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.lien_parente_to_edit = one_lien_parente;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_lien_parente()
        } else {

        }
      })
    }
  }