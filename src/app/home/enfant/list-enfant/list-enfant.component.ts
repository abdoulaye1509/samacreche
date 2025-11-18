import { Component, Input, OnDestroy, OnInit } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddEnfantComponent } from '../add-enfant/add-enfant.component';
  import { EditEnfantComponent } from '../edit-enfant/edit-enfant.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
import { EnfantTafType } from '../taf-type/enfant-taf-type';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailEnfantComponent } from '../detail-enfant/detail-enfant.component';
import { CommonModule } from '@angular/common';
  @Component({
    selector: 'app-list-enfant',
    standalone: true, // Composant autonome
    imports: [FormsModule,NgSelectModule,CommonModule,DetailEnfantComponent,AddEnfantComponent,EditEnfantComponent,ReactiveFormsModule], // Dépendances importées
    templateUrl: './list-enfant.component.html',
    styleUrls: ['./list-enfant.component.scss']
  })
  export class ListEnfantComponent implements OnInit, OnDestroy{
    loading_get_enfant = false
    loading_delete_enfant = false
    les_enfants: EnfantTafType[] = []
    list: EnfantTafType[] = []
    filter: any = {
      text: [],
    };
    @Input() enfant_to_view !: EnfantTafType;
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListEnfantComponent");
      this.get_enfant()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_enfant() {
      this.loading_get_enfant = true;
      this.api.taf_post("enfant/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_enfants = reponse.data
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
    delete_enfant (enfant : any){
      this.loading_delete_enfant = true;
      this.api.taf_post("enfant/delete", enfant,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table enfant . Réponse = ",reponse)
          this.get_enfant()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table enfant  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_enfant = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_enfant = false;
      })
    }
    openModal_add_enfant() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "xl"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddEnfantComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_enfant()
        } else {

        }
      })
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
      modalRef.componentInstance.enfant_to_view = one_enfant;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_enfant()
        } else {

        }
      })
    }
     // url photo avec fallback
  photoUrl(e: any): string {
    const src = e?.photo_enfant ? this.api.resolveFileUrl(e.photo_enfant) : '';
    return src || this.api.placeholderLogo;
  }

  onImgError(ev: Event) {
    (ev.target as HTMLImageElement).src = this.api.placeholderLogo;
  }

  // âge “X ans” à partir d’une date (YYYY-MM-DD)
  ageFrom(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(+d)) return '';
    const now = new Date();
    let a = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
    return a + ' ans';
  }

  }