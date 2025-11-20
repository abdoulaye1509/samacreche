import { Component, Input, OnInit } from '@angular/core';
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
export class ListActiviteComponent implements OnInit {
  @Input() id_enfant = 0;

  loading_get_activite = false;
  loading_get_activite_structure = false;

  selected_activite: any;
  activite: ActiviteTafType[] = [];

  /** stocke l'id structure quand dispo */
  private id_structure: number | null = null;

  /** retry court pour attendre l'hydratation de ApiService après refresh */
  private structureRetry = 0;
  private readonly maxRetries = 10;       // ~10 tentatives
  private readonly retryDelayMs = 250;    // 250 ms entre tentatives

  constructor(public api: ApiService, private modalService: NgbModal) {
    // Garantit que la liste existe pour le template dès le premier rendu
    if (!Array.isArray(this.api.les_activites_structures)) {
      this.api.les_activites_structures = [];
    }
  }

  ngOnInit(): void {
    this.get_activite();             // par enfant
    this.initStructureThenLoad();    // par structure (avec retry si besoin)
  }

  /** ————————————  INIT STRUCTURE + CHARGEMENT  ———————————— */
  private initStructureThenLoad(): void {
    this.id_structure = this.resolveIdStructure();

    if (!this.id_structure) {
      // ApiService pas encore hydraté (ex: refresh) → on retry un court moment
      if (this.structureRetry++ < this.maxRetries) {
        setTimeout(() => this.initStructureThenLoad(), this.retryDelayMs);
      }
      return;
    }

    // id disponible → on charge
    this.get_activite_structure();
  }

  /** Récupère un id_structure de façon safe (user_connected -> token -> localStorage) */
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
    } catch {
      /* no-op */
    }

    return null;
  }

  /** ————————————  APPELS API  ———————————— */
  get_activite(): void {
    if (!this.id_enfant) return;
    const params = { 'a.id_enfant': this.id_enfant };

    this.loading_get_activite = true;
    this.api.taf_post_object(
      'activite/get',
      params,
      (res: any) => {
        this.loading_get_activite = false;
        if (res?.status) {
          this.api.les_activites = res.data || [];
        }
      },
      () => (this.loading_get_activite = false)
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
        if (res?.status) {
          this.api.les_activites_structures = res.data || [];
        }
      },
      () => (this.loading_get_activite_structure = false)
    );
  }

  /** ————————————  MODALS  ———————————— */
  openModal_add_activite(): void {
    const modalRef = this.modalService.open(AddActiviteComponent, {
      centered: true,
      scrollable: true,
      size: 'xl',
      backdrop: 'static'
    });

    modalRef.componentInstance.id_enfant = this.id_enfant;

    modalRef.result.then((result: any) => {
      if (result?.status) {
        this.get_activite();
        this.get_activite_structure();
      }
    }).catch(() => { /* dismiss */ });
  }

  openModal_edit_activite(one_activite: any): void {
    const modalRef = this.modalService.open(EditActiviteComponent, {
      centered: true,
      scrollable: true,
      size: 'xl',
      backdrop: 'static'
    });

    modalRef.componentInstance.activite_to_edit = one_activite;

    modalRef.result.then((result: any) => {
      if (result?.status) {
        this.get_activite();
        this.get_activite_structure();
      }
    }).catch(() => { /* dismiss */ });
  }

  openModal_details_activite(one_activite: any): void {
    const modalRef = this.modalService.open(DetailActiviteComponent, {
      centered: true,
      scrollable: true,
      size: 'xl',
      backdrop: 'static'
    });

    modalRef.componentInstance.selected_activite = one_activite;

    modalRef.result.then((result: any) => {
      if (result?.status) {
        this.get_activite();
        this.get_activite_structure();
      }
    }).catch(() => { /* dismiss */ });
  }

  /** ————————————  UTILS  ———————————— */
  trackById = (_: number, item: any) => item?.id_activite ?? _;
}
