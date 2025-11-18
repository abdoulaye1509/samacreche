import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../service/api/api.service';
import { EnfantTafType } from '../taf-type/enfant-taf-type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-enfant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-enfant.component.html',
  styleUrl: './detail-enfant.component.scss'
})
export class DetailEnfantComponent {
  loading_get_enfant: boolean = false;
  les_enfants: any;
  les_parents: any;
  list: any;
  loading_delete_enfant: boolean = false;
  filter: any = {
    text: [],
  };
  @Input() enfant_to_view !: EnfantTafType;
  // Ajoute ces propriétés
  enfant: any = null;
  parents: any[] = [];
  constructor(public api: ApiService, private modalService: NgbModal,public activeModal: NgbActiveModal) {

  }
  ngOnInit(): void {
    console.groupCollapsed("ListEnfantComponent");
    this.get_enfant()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  get_enfant() {
    console.log("enfant_to view for detail:", this.enfant_to_view);
    this.loading_get_enfant = true;
    this.api.taf_post_object("enfant/get_2", { id_enfant: this.enfant_to_view.id_enfant }, (reponse: any) => {
      if (reponse.status) {
        const d = reponse.data;
        this.enfant = d;                         // objet enfant
        this.parents = Array.isArray(d.les_parents) ? d.les_parents : [];
        this.loading_get_enfant = false;
        return;
      }
      else {
        console.log("L'opération sur la table enfant a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_enfant = false;
    }, (error: any) => {
      this.loading_get_enfant = false;
    })
  }

  delete_enfant(enfant: any) {
    this.loading_delete_enfant = true;
    this.api.taf_post("enfant/delete", enfant, (reponse: any) => {
      //when success
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table enfant . Réponse = ", reponse)
        this.get_enfant()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table enfant  a échoué. Réponse = ", reponse)
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_delete_enfant = false;
    },
      (error: any) => {
        //when error
        console.log("Erreur inconnue! ", error)
        this.loading_delete_enfant = false;
      })
  }
}
