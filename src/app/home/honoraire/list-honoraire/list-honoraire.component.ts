import { Component, OnDestroy, OnInit } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddHonoraireComponent } from '../add-honoraire/add-honoraire.component';
  import { EditHonoraireComponent } from '../edit-honoraire/edit-honoraire.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
import { HonoraireTafType } from '../taf-type/honoraire-taf-type';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-honoraire',
    standalone: true, // Composant autonome
    imports: [FormsModule,NgSelectModule], // Dépendances importées
    templateUrl: './list-honoraire.component.html',
    styleUrls: ['./list-honoraire.component.scss']
  })
  export class ListHonoraireComponent implements OnInit, OnDestroy{
    loading_get_honoraire = false
    loading_delete_honoraire = false
    les_honoraires: HonoraireTafType[] = []
    list: HonoraireTafType[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListHonoraireComponent");
      this.get_honoraire()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_honoraire() {
      this.loading_get_honoraire = true;
      this.api.taf_post("honoraire/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_honoraires = reponse.data
          console.log("Opération effectuée avec succés sur la table honoraire. Réponse= ", reponse);
          this.filter_change();
        } else {
          console.log("L'opération sur la table honoraire a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_honoraire = false;
      }, (error: any) => {
        this.loading_get_honoraire = false;
      })
    }
    filter_change(event?: any) {
      this.list = this.les_honoraires.filter((one: any) => {
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
    delete_honoraire (honoraire : any){
      this.loading_delete_honoraire = true;
      this.api.taf_post("honoraire/delete", honoraire,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table honoraire . Réponse = ",reponse)
          this.get_honoraire()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table honoraire  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_honoraire = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_honoraire = false;
      })
    }
    openModal_add_honoraire() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddHonoraireComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_honoraire()
        } else {

        }
      })
    }
    openModal_edit_honoraire(one_honoraire: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditHonoraireComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.honoraire_to_edit = one_honoraire;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_honoraire()
        } else {

        }
      })
    }
  }