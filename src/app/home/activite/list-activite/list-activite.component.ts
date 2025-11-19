import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import { AddActiviteComponent } from '../add-activite/add-activite.component';
import { EditActiviteComponent } from '../edit-activite/edit-activite.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ActiviteTafType } from '../taf-type/activite-taf-type';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DetailActiviteComponent } from '../detail-activite/detail-activite.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-list-activite',
  standalone: true, // Composant autonome
  imports: [FormsModule, NgSelectModule, RouterLink, DetailActiviteComponent, CommonModule], // Dépendances importées
  templateUrl: './list-activite.component.html',
  styleUrls: ['./list-activite.component.scss']
})
export class ListActiviteComponent implements OnInit {
  loading_get_activite = false
  selected_activite: any
  @Input()
  id_enfant = 0
  activite: ActiviteTafType[] = [];
  constructor(public api: ApiService, private modalService: NgbModal) {

  }

  ngOnInit(): void {
    // console.log("id_enfant =",this.id_enfant)
    this.get_activite();
  }
  get_activite() {
    let params = { id_enfant: this.id_enfant }// les conditions à mettre ici
    console.log("params =", params)
    this.loading_get_activite = true;
    this.api.taf_post_object("activite/get", params , (reponse: any) => {
      //when success
      if (reponse.status) {
        this.api.les_activites = reponse.data
        console.log("les_activites =", this.api.les_activites)
        console.log("Opération effectuée avec succés sur la table activite. Réponse= ", reponse);
      } else {
        console.log("L\'opération sur la table activite a échoué. Réponse= ", reponse);
      }
      this.loading_get_activite = false;
    },
      (error: any) => {
        //when error
        this.loading_get_activite = false;
        console.log("Erreur inconnue! ", error);
      })
  }
 
  openModal_add_activite() {
    const options = { centered: true, scrollable: true, size: 'xl', backdrop: 'static' as const };
    const modalRef = this.modalService.open(AddActiviteComponent, options);
    modalRef.componentInstance.id_enfant = this.id_enfant;            // ← important
    modalRef.result.then((result: any) => { if (result?.status) this.get_activite(); });
  }

  openModal_edit_activite(one_activite: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "xl"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(EditActiviteComponent, { ...options, backdrop: 'static', })
    modalRef.componentInstance.activite_to_edit = one_activite;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_activite()
      } else {

      }
    })
  }
  openModal_details_activite(one_activite: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "xl"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(DetailActiviteComponent, { ...options, backdrop: 'static', })
    modalRef.componentInstance.selected_activite = one_activite;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_activite()
      } else {

      }
    })
  }
}