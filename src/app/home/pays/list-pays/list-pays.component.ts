import { Component, OnDestroy, OnInit } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddPaysComponent } from '../add-pays/add-pays.component';
  import { EditPaysComponent } from '../edit-pays/edit-pays.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
import { PaysTafType } from '../taf-type/pays-taf-type';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-pays',
    standalone: true, // Composant autonome
    imports: [FormsModule,NgSelectModule], // Dépendances importées
    templateUrl: './list-pays.component.html',
    styleUrls: ['./list-pays.component.scss']
  })
  export class ListPaysComponent implements OnInit, OnDestroy{
    loading_get_pays = false
    loading_delete_pays = false
    les_payss: PaysTafType[] = []
    list: PaysTafType[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListPaysComponent");
      this.get_pays()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_pays() {
      this.loading_get_pays = true;
      this.api.taf_post("pays/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_payss = reponse.data
          console.log("Opération effectuée avec succés sur la table pays. Réponse= ", reponse);
          this.filter_change();
        } else {
          console.log("L'opération sur la table pays a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_pays = false;
      }, (error: any) => {
        this.loading_get_pays = false;
      })
    }
    filter_change(event?: any) {
      this.list = this.les_payss.filter((one: any) => {
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
    delete_pays (pays : any){
      this.loading_delete_pays = true;
      this.api.taf_post("pays/delete", pays,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table pays . Réponse = ",reponse)
          this.get_pays()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table pays  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_pays = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_pays = false;
      })
    }
    openModal_add_pays() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddPaysComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_pays()
        } else {

        }
      })
    }
    openModal_edit_pays(one_pays: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditPaysComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.pays_to_edit = one_pays;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_pays()
        } else {

        }
      })
    }
  }