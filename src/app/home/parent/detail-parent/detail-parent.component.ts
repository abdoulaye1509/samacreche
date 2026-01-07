import { Component, Input, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../../../service/api/api.service';
import { EditEnfantComponent } from '../../enfant/edit-enfant/edit-enfant.component';
import { AddEnfantParentComponent } from '../../enfant/add-enfant-parent/add-enfant-parent.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-parent',
  standalone: true,
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './detail-parent.component.html',
  styleUrl: './detail-parent.component.scss'
})
export class DetailParentComponent {
  loading_get_enfant = false;
  les_enfants: any[] = [];
  list: any[] = [];
  loading_delete_enfant = false;

  parent_to_detail: any;
  @Input() set parent(value: any) { this.parent_to_detail = value; }

  id_parent = 0;
parentInfo: any = null;
  constructor(
    public api: ApiService,
    public modalService: NgbModal,
    private route: ActivatedRoute,
    private location: Location,
    @Optional() public activeModal?: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(p => {
    const id = +p['id_parent'];
    if (id) {
      this.id_parent = id;
      this.get_parent();   // ← charge le parent
      this.get_enfant();   // ← charge ses enfants
    }
  });
  console.groupCollapsed("DetailParentComponent");
  }

  ngOnDestroy(): void { console.groupEnd(); }

  goBack() { this.location.back(); }

  get_enfant() {
    this.loading_get_enfant = true;
    this.api.taf_post_object("enfant/get_mes_enfants", { id_parent: this.id_parent }, (reponse: any) => {
      this.loading_get_enfant = false;
      if (reponse.status) {
        this.les_enfants = reponse.data || [];
        console.log("Enfants du parent", this.les_enfants);
        this.filter_change();
      } else {
        this.api.Swal_error("L'opération a échoué");
      }
    }, () => this.loading_get_enfant = false);
  }
get_parent() {
  // adapte l'endpoint à ton backend (souvent "parent/get")
  this.api.taf_post_object('parent/get', { id_parent: this.id_parent }, (rep: any) => {
    if (rep?.status) {
      // selon ton API: parfois c’est un tableau
      this.parentInfo = Array.isArray(rep.data) ? rep.data[0] : rep.data;
    }
  }, () => { /* ignore */ });
}
  filter_change(event?: any) {
    const term = (event?.term || '').toLowerCase().replace(/\s/g, '');
    this.list = !term ? [...this.les_enfants] :
      this.les_enfants.filter((one: any) =>
        JSON.stringify(one).toLowerCase().replace(/\s/g, '').includes(term)
      );
  }

  delete_enfant(enfant: any) {
    this.loading_delete_enfant = true;
    this.api.taf_post("enfant/delete", enfant, (reponse: any) => {
      this.loading_delete_enfant = false;
      if (reponse.status) {
        this.get_enfant();
        this.api.Swal_success("Opération éffectuée avec succès");
      } else {
        this.api.Swal_error("L'opération a échoué");
      }
    }, () => this.loading_delete_enfant = false);
  }

  openModal_add_enfant() {
    const options: any = { centered: true, scrollable: true, size: 'xl', backdrop: 'static' };
    const modalRef = this.modalService.open(AddEnfantParentComponent, options);
    modalRef.componentInstance.id_parent = this.parent_to_detail?.id_parent ?? this.id_parent;
    modalRef.componentInstance.parent_label =
      `${this.parent_to_detail?.prenom_parent ?? ''} ${this.parent_to_detail?.nom_parent ?? ''}`.trim();
    modalRef.result.then((result: any) => { if (result?.status) this.get_enfant(); });
  }

  openModal_edit_enfant(one_enfant: any) {
    const options: any = { centered: true, scrollable: true, size: 'xl', backdrop: 'static' };
    const modalRef = this.modalService.open(EditEnfantComponent, options);
    modalRef.componentInstance.enfant_to_edit = one_enfant;
    modalRef.result.then((result: any) => { if (result?.status) this.get_enfant(); });
  }

  // ==== helpers alignés avec la liste d’enfants ====
  photoUrl(e: any): string {
    const src = e?.photo_enfant ? this.api.resolveFileUrl(e.photo_enfant) : '';
    return src || this.api.placeholderLogo;
  }
  onImgError(ev: Event) { (ev.target as HTMLImageElement).src = this.api.placeholderLogo; }
  ageFrom(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr); if (isNaN(+d)) return '';
    const now = new Date();
    let a = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
    return a + ' ans';
  }

  trackEnfant = (_: number, e: any) => e?.id_enfant ?? e;
}
