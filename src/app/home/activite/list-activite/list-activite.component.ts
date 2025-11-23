import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../../../service/api/api.service';
import { AddActiviteComponent } from '../add-activite/add-activite.component';
import { EditActiviteComponent } from '../edit-activite/edit-activite.component';
import { DetailActiviteComponent } from '../detail-activite/detail-activite.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ActiviteTafType } from '../taf-type/activite-taf-type';

@Component({
  selector: 'app-list-activite',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgSelectModule, DetailActiviteComponent],
  templateUrl: './list-activite.component.html',
  styleUrls: ['./list-activite.component.scss']
})
export class ListActiviteComponent implements OnInit, OnChanges {
  @Input() id_enfant = 0;

  loading_get_activite = false;
  loading_get_activite_structure = false;

  /** stocke l'id structure quand dispo */
  private id_structure: number | null = null;

  /** retry court pour attendre l'hydratation de ApiService après refresh */
  private structureRetry = 0;
  private readonly maxRetries = 10;
  private readonly retryDelayMs = 250;

  constructor(public api: ApiService, private modalService: NgbModal) {
    // évite les erreurs template au premier rendu
    if (!Array.isArray(this.api.les_activites)) this.api.les_activites = [];
    if (!Array.isArray(this.api.les_activites_structures)) this.api.les_activites_structures = [];
  }

  // ---- helpers de mode / états ----
  get isStructureMode(): boolean { return !this.id_enfant; }
  get isLoading(): boolean {
    return this.isStructureMode ? this.loading_get_activite_structure : this.loading_get_activite;
  }
  get listActivites(): any[] {
    return this.isStructureMode ? (this.api.les_activites_structures || []) : (this.api.les_activites || []);
  }
  get total(): number { return this.listActivites.length; }

  ngOnInit(): void {
    if (this.isStructureMode) this.initStructureThenLoad();
    else this.get_activite();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id_enfant'] && !changes['id_enfant'].firstChange) {
      if (this.isStructureMode) this.initStructureThenLoad();
      else this.get_activite();
    }
  }

  /** ——— INIT STRUCTURE + LOAD ——— */
  private initStructureThenLoad(): void {
    this.id_structure = this.resolveIdStructure();

    if (!this.id_structure) {
      if (this.structureRetry++ < this.maxRetries) {
        setTimeout(() => this.initStructureThenLoad(), this.retryDelayMs);
      }
      return;
    }
    this.structureRetry = 0;
    this.get_activite_structure();
  }

  /** récupère id_structure de façon safe (user -> token -> localStorage) */
  private resolveIdStructure(): number | null {
    const fromUser = this.api?.user_connected?.id_structure;
    if (fromUser) return fromUser;

    const fromToken = this.api?.token?.user_connected?.id_structure;
    if (fromToken) return fromToken;

    try {
      const raw = localStorage.getItem('token');
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed?.user_connected?.id_structure ?? null;
      }
    } catch {}
    return null;
  }

  /** ——— APPELS API ——— */
  get_activite(): void {
    if (!this.id_enfant) return;
    this.loading_get_activite = true;

    // ⚠️ côté backend, assure-toi que la clé supportée est bien "a.id_enfant" OU "id_enfant"
    const params = { 'a.id_enfant': this.id_enfant };
    this.api.taf_post_object(
      'activite/get',
      params,
      (res: any) => {
        this.loading_get_activite = false;
        if (res?.status) this.api.les_activites = res.data || [];
        else this.api.les_activites = [];
      },
      () => { this.loading_get_activite = false; this.api.les_activites = []; }
    );
  }

  get_activite_structure(): void {
    if (!this.id_structure) return;

    this.loading_get_activite_structure = true;
    this.api.taf_post_object(
      'activite/get_activite_structure',
      { 'a.id_structure': this.id_structure },
      (res: any) => {
        this.loading_get_activite_structure = false;
        if (res?.status) this.api.les_activites_structures = res.data || [];
        else this.api.les_activites_structures = [];
      },
      () => { this.loading_get_activite_structure = false; this.api.les_activites_structures = []; }
    );
  }

  /** ——— MODALS ——— */
  openModal_add_activite(): void {
    const modalRef = this.modalService.open(AddActiviteComponent, {
      centered: true, scrollable: true, size: 'xl', backdrop: 'static'
    });
    modalRef.componentInstance.id_enfant = this.id_enfant;

    modalRef.result.then((result: any) => {
      if (result?.status) this.isStructureMode ? this.get_activite_structure() : this.get_activite();
    }).catch(() => {});
  }

  openModal_edit_activite(one_activite: any): void {
    const modalRef = this.modalService.open(EditActiviteComponent, {
      centered: true, scrollable: true, size: 'xl', backdrop: 'static'
    });
    modalRef.componentInstance.activite_to_edit = one_activite;

    modalRef.result.then((result: any) => {
      if (result?.status) this.isStructureMode ? this.get_activite_structure() : this.get_activite();
    }).catch(() => {});
  }

  openModal_details_activite(one_activite: any): void {
    const modalRef = this.modalService.open(DetailActiviteComponent, {
      centered: true, scrollable: true, size: 'xl', backdrop: 'static'
    });
    modalRef.componentInstance.selected_activite = one_activite;

    modalRef.result.then((result: any) => {
      if (result?.status) this.isStructureMode ? this.get_activite_structure() : this.get_activite();
    }).catch(() => {});
  }

  /** ——— UTILS ——— */
  trackById = (_: number, item: any) => item?.id_activite ?? _;
}
