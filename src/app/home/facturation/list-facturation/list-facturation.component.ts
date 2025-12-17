import { Component, Input, OnDestroy, OnInit } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddFacturationComponent } from '../add-facturation/add-facturation.component';
  import { EditFacturationComponent } from '../edit-facturation/edit-facturation.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
import { FacturationTafType } from '../taf-type/facturation-taf-type';
  import { FormsModule } from '@angular/forms';
import {  RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
  @Component({
    selector: 'app-list-facturation',
    standalone: true, // Composant autonome
    imports: [FormsModule,NgSelectModule,RouterLink,CommonModule], // Dépendances importées
    templateUrl: './list-facturation.component.html',
    styleUrls: ['./list-facturation.component.scss']
  })
  export class ListFacturationComponent implements OnInit, OnDestroy{
    loading_get_facturation = false
    loading_delete_facturation = false
    les_facturations: FacturationTafType[] = []
    list: FacturationTafType[] = []
    filter: any = {
      text: [],
    };
    @Input()
    id_facturation: number | null = null;
  constructor(
    public api: ApiService,
    private modalService: NgbModal
  ) {}

  async ngOnInit(): Promise<void> {
    console.groupCollapsed('ListFacturationComponent');

    // ON ATTEND QUE user_connected SOIT CHARGÉ
    await this.api.ensure_user_connected();

    if (!this.api.user_connected?.id_structure) {
      this.api.Swal_error('Aucune structure associée à votre compte');
      console.groupEnd();
      return;
    }

    this.get_facturation();
  }

  ngOnDestroy(): void {
    console.groupEnd();
  }

  private get_facturation() {
    this.loading_get_facturation = true;
    console.log('Chargement des facturations pour la structure ID :', this.api.user_connected.id_structure);  
    this.api.taf_post_object(
      'facturation/get',
      { 'f.id_structure': this.api.user_connected.id_structure },
      (reponse: any) => {
        if (reponse?.status) {
          this.les_facturations = reponse.data || [];
          this.filter_change();
          console.log('Facturations chargées :', this.les_facturations.length);
        } else {
          this.api.Swal_error('Impossible de charger les facturations');
        }
        this.loading_get_facturation = false;
      },
      () => {
        this.loading_get_facturation = false;
        this.api.Swal_error('Erreur réseau');
      }
    );
  }

  filter_change(event?: any) {
    const term = event?.term?.toLowerCase() || '';
    this.list = term
      ? this.les_facturations.filter(one =>
          JSON.stringify(one).toLowerCase().includes(term)
        )
      : [...this.les_facturations];
  }

  delete_facturation(facturation: any) {
    this.loading_delete_facturation = true;
    this.api.taf_post('facturation/delete', facturation, (reponse: any) => {
      if (reponse.status) {
        this.api.Swal_success('Facturation supprimée avec succès');
        this.get_facturation();
      } else {
        this.api.Swal_error("L'opération a échoué");
      }
      this.loading_delete_facturation = false;
    }, () => {
      this.loading_delete_facturation = false;
    });
  }

  openModal_add_facturation() {
    const modalRef = this.modalService.open(AddFacturationComponent, {
      centered: true,
      scrollable: true,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.result.then(
      (result: any) => { if (result?.status) this.get_facturation(); },
      () => {}
    );
  }

  openModal_edit_facturation(one_facturation: any) {
    const modalRef = this.modalService.open(EditFacturationComponent, {
      centered: true,
      scrollable: true,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.facturation_to_edit = one_facturation;
    modalRef.result.then(
      (result: any) => { if (result?.status) this.get_facturation(); },
      () => {}
    );
  }

  // TES FONCTIONS SONT TOUJOURS LÀ (aucune supprimée)
  money(v: any): string {
    const n = Number(v || 0);
    return n.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' CFA';
  }

  fullname(f: any): string {
    const p = (f?.prenom_enfant || '').trim();
    const n = (f?.nom_enfant || '').trim();
    return (p || n) ? `${p} ${n}`.trim() : `Enfant #${f.id_enfant}`;
  }

  statusClass(f: any): string {
    const lib = (f?.libelle_statut_facture || '').toLowerCase();
    if (lib.includes('pay')) return 'bg-success-subtle text-success';
    if (lib.includes('emise')) return 'bg-primary-subtle text-primary';
    if (lib.includes('brouillon')) return 'bg-warning-subtle text-warning';
    if (lib.includes('annul')) return 'bg-danger-subtle text-danger';
    return 'bg-light text-secondary';
  }

  trackByFacturation(index: number, item: FacturationTafType): string | number {
    return item.id_facturation ?? index;
  }
}