import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../service/api/api.service';
import { AddEnfantComponent } from '../../enfant/add-enfant/add-enfant.component';
import { EditEnfantComponent } from '../../enfant/edit-enfant/edit-enfant.component';
import { DetailEnfantComponent } from '../../enfant/detail-enfant/detail-enfant.component';
import { CommonModule } from '@angular/common';
import { AddEnfantParentComponent } from '../../enfant/add-enfant-parent/add-enfant-parent.component';

@Component({
  selector: 'app-detail-Parent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-Parent.component.html',
  styleUrl: './detail-Parent.component.scss'
})
export class DetailParentComponent {
  loading_get_enfant: boolean = false;
  les_enfants: any;
  list: any;
  loading_delete_enfant: boolean = false;
  parent_to_detail: any;
  @Input() set parent(value: any) {
    this.parent_to_detail = value;
  }
  constructor(public api: ApiService, private modalService: NgbModal,public activeModal: NgbActiveModal) {

  }
  ngOnInit(): void {
    console.groupCollapsed("DetailParentComponent");
    this.get_enfant()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  get_enfant() {
    console.log('get enfant for parent', this.parent_to_detail);
    console.log('id_parent', this.parent_to_detail.id_parent);

    this.loading_get_enfant = true;
    this.api.taf_post_object("enfant/get_mes_enfants", {id_parent: this.parent_to_detail.id_parent}, (reponse: any) => {
      if (reponse.status) {
        this.les_enfants = reponse.data
        console.log('mes enfants', this.les_enfants);
        console.log("Opération effectuée avec succés sur la table enfant. Réponse= ", reponse);
        this.filter_change();
      } else {
        console.log("L'opération sur la table enfant a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_enfant = false;
    }, (error: any) => {
      this.loading_get_enfant = false;
    })
  }
  filter_change(event?: any) {
    this.list = this.les_enfants.filter((one: any) => {
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
 openModal_add_enfant() {
  const options: any = { centered: true, scrollable: true, size: 'xl', backdrop: 'static' };
  const modalRef = this.modalService.open(AddEnfantParentComponent, options);

  // passe tout l’objet (utilisé pour l’affichage) et surtout l’id
  modalRef.componentInstance.id_parent = this.parent_to_detail?.id_parent;
  modalRef.componentInstance.parent_label =
    `${this.parent_to_detail?.prenom_parent ?? ''} ${this.parent_to_detail?.nom_parent ?? ''}`.trim();

  modalRef.result.then((result: any) => {
    if (result?.status) this.get_enfant();
  });
}

  openModal_edit_enfant(one_enfant: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "xl"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(EditEnfantComponent, { ...options, backdrop: 'static', })
    modalRef.componentInstance.enfant_to_edit = one_enfant;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_enfant()
      } else {

      }
    })
  }
  openModal_detail_enfant(one_enfant: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "xl"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(DetailEnfantComponent, { ...options, backdrop: 'static', })
    modalRef.componentInstance.enfant_to_detail = one_enfant;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_enfant()
      } else {

      }
    })
  }
trackEnfant = (_: number, e: any) => e?.id_enfant ?? e;

}
