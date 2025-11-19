import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import { AddParentComponent } from '../add-parent/add-parent.component';
import { EditParentComponent } from '../edit-parent/edit-parent.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ParentTafType } from '../taf-type/parent-taf-type';
import { FormsModule } from '@angular/forms';
import { DetailParentComponent } from '../detail-parent/detail-parent.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-list-parent',
  standalone: true, // Composant autonome
  imports: [FormsModule, NgSelectModule,CommonModule,RouterLink], // Dépendances importées
  templateUrl: './list-parent.component.html',
  styleUrls: ['./list-parent.component.scss']
})
export class ListParentComponent implements OnInit, OnDestroy {
  loading_get_parent = false
  loading_delete_parent = false
  les_parents: ParentTafType[] = []
  list: ParentTafType[] = []
  filter: any = {
    text: [],
  };
  viewMode: 'cards' | 'list' | 'table' = 'cards';
  @Input() parent_to_detail: any;
  constructor(public api: ApiService, private modalService: NgbModal) {

  }
  ngOnInit(): void {
    console.groupCollapsed("ListParentComponent");
    this.get_parent()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  get_parent() {
    this.loading_get_parent = true;
    this.api.taf_post("parent/get", {}, (reponse: any) => {
      if (reponse.status) {
        this.les_parents = reponse.data
        console.log("Opération effectuée avec succés sur la table parent. Réponse= ", reponse);
        this.filter_change();
      } else {
        console.log("L'opération sur la table parent a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_parent = false;
    }, (error: any) => {
      this.loading_get_parent = false;
    })
  }
  filter_change(event?: any) {
    this.list = this.les_parents.filter((one: any) => {
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
  delete_parent(parent: any) {
    this.loading_delete_parent = true;
    this.api.taf_post("parent/delete", parent, (reponse: any) => {
      //when success
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table parent . Réponse = ", reponse)
        this.get_parent()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table parent  a échoué. Réponse = ", reponse)
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_delete_parent = false;
    },
      (error: any) => {
        //when error
        console.log("Erreur inconnue! ", error)
        this.loading_delete_parent = false;
      })
  }
  openModal_add_parent() {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(AddParentComponent, { ...options, backdrop: 'static' })
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_parent()
      } else {

      }
    })
  }
  openModal_edit_parent(one_parent: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(EditParentComponent, { ...options, backdrop: 'static', })
    modalRef.componentInstance.parent_to_edit = one_parent;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_parent()
      } else {

      }
    })
  }
  openModal_detail_parent(one_parent: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "xl"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(DetailParentComponent, { ...options, backdrop: 'static', })
    modalRef.componentInstance.parent_to_detail = one_parent;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_parent()
      } else {

      }
    })
  }
  // TrackBy performant
  trackParent = (_: number, p: any) => p?.id_parent ?? p;

  // Nom complet
  fullName(p: any): string {
    return `${p?.prenom_parent ?? ''} ${p?.nom_parent ?? ''}`.trim();
  }
  // Initiales pour l’avatar (P.N)
  initials(p: any): string {
    const a = (p?.prenom_parent ?? '').trim();
    const b = (p?.nom_parent ?? '').trim();
    const i1 = a ? a[0].toUpperCase() : '';
    const i2 = b ? b[0].toUpperCase() : '';
    return (i1 + i2) || 'P';
  }
}