import { Component, OnDestroy, OnInit } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddGroupeSanguinComponent } from '../add-groupe-sanguin/add-groupe-sanguin.component';
  import { EditGroupeSanguinComponent } from '../edit-groupe-sanguin/edit-groupe-sanguin.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
import { GroupeSanguinTafType } from '../taf-type/groupe-sanguin-taf-type';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-groupe-sanguin',
    standalone: true, // Composant autonome
    imports: [FormsModule,NgSelectModule], // Dépendances importées
    templateUrl: './list-groupe-sanguin.component.html',
    styleUrls: ['./list-groupe-sanguin.component.scss']
  })
  export class ListGroupeSanguinComponent implements OnInit, OnDestroy{
    loading_get_groupe_sanguin = false
    loading_delete_groupe_sanguin = false
    les_groupe_sanguins: GroupeSanguinTafType[] = []
    list: GroupeSanguinTafType[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListGroupeSanguinComponent");
      this.get_groupe_sanguin()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_groupe_sanguin() {
      this.loading_get_groupe_sanguin = true;
      this.api.taf_post("groupe_sanguin/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_groupe_sanguins = reponse.data
          console.log("Opération effectuée avec succés sur la table groupe_sanguin. Réponse= ", reponse);
          this.filter_change();
        } else {
          console.log("L'opération sur la table groupe_sanguin a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_groupe_sanguin = false;
      }, (error: any) => {
        this.loading_get_groupe_sanguin = false;
      })
    }
    filter_change(event?: any) {
      this.list = this.les_groupe_sanguins.filter((one: any) => {
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
    delete_groupe_sanguin (groupe_sanguin : any){
      this.loading_delete_groupe_sanguin = true;
      this.api.taf_post("groupe_sanguin/delete", groupe_sanguin,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table groupe_sanguin . Réponse = ",reponse)
          this.get_groupe_sanguin()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table groupe_sanguin  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_groupe_sanguin = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_groupe_sanguin = false;
      })
    }
    openModal_add_groupe_sanguin() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddGroupeSanguinComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_groupe_sanguin()
        } else {

        }
      })
    }
    openModal_edit_groupe_sanguin(one_groupe_sanguin: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditGroupeSanguinComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.groupe_sanguin_to_edit = one_groupe_sanguin;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_groupe_sanguin()
        } else {

        }
      })
    }
  }