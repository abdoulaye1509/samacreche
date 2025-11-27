import { Component, OnDestroy, OnInit } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddPrivilegeComponent } from '../add-privilege/add-privilege.component';
  import { EditPrivilegeComponent } from '../edit-privilege/edit-privilege.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
import { PrivilegeTafType } from '../taf-type/privilege-taf-type';
  import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
  @Component({
    selector: 'app-list-privilege',
    standalone: true, // Composant autonome
    imports: [FormsModule,NgSelectModule,CommonModule], // Dépendances importées
    templateUrl: './list-privilege.component.html',
    styleUrls: ['./list-privilege.component.scss']
  })
  export class ListPrivilegeComponent implements OnInit, OnDestroy{
    loading_get_privilege = false
    loading_delete_privilege = false
    les_privileges: PrivilegeTafType[] = []
    list: PrivilegeTafType[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListPrivilegeComponent");
      this.get_privilege()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_privilege() {
      this.loading_get_privilege = true;
      this.api.taf_post("privilege/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_privileges = reponse.data
          console.log("Opération effectuée avec succés sur la table privilege. Réponse= ", reponse);
          this.filter_change();
        } else {
          console.log("L'opération sur la table privilege a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_privilege = false;
      }, (error: any) => {
        this.loading_get_privilege = false;
      })
    }
    filter_change(event?: any) {
      this.list = this.les_privileges.filter((one: any) => {
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
    delete_privilege (privilege : any){
      this.loading_delete_privilege = true;
      this.api.taf_post("privilege/delete", privilege,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table privilege . Réponse = ",reponse)
          this.get_privilege()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table privilege  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_privilege = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_privilege = false;
      })
    }
    openModal_add_privilege() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "xl"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddPrivilegeComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_privilege()
        } else {

        }
      })
    }
    openModal_edit_privilege(one_privilege: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "xl"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditPrivilegeComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.privilege_to_edit = one_privilege;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_privilege()
        } else {

        }
      })
    }
  }