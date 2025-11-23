import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../../../service/api/api.service';
import { AddGalerieEnfantComponent } from '../add-galerie-enfant/add-galerie-enfant.component';
import { EditGalerieEnfantComponent } from '../edit-galerie-enfant/edit-galerie-enfant.component';
import { GalerieEnfantTafType } from '../taf-type/galerie-enfant-taf-type';

type GalerieGroup = { date: Date; key: string; carouselId: string; items: GalerieEnfantTafType[] };

@Component({
  selector: 'app-list-galerie-enfant',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './list-galerie-enfant.component.html',
  styleUrls: ['./list-galerie-enfant.component.scss']
})
export class ListGalerieEnfantComponent implements OnInit, OnDestroy, OnChanges {
  @Input() id_enfant = 0;                // si fourni -> mode "enfant", sinon -> mode "structure"

  // états chargement
  loading_get_galerie_enfant = false;
  loading_delete_galerie_enfant = false;

  // source brute (unique pour les 2 modes)
  private raw: GalerieEnfantTafType[] = [];

  // dérivés pour l’affichage
  list: GalerieEnfantTafType[] = [];
  groups: GalerieGroup[] = [];
  totalPhotos = 0;
  filter: any = { text: [] };

  // lightbox
  viewer = {
    open: false,
    group: null as GalerieGroup | null,
    index: 0,
    get current() { return this.group?.items?.[this.index] ?? null; }
  };

  // retry pour id_structure au refresh
  private structureRetry = 0;

  constructor(public api: ApiService, private modalService: NgbModal) {}

  // ----- helpers de mode -----
  get isStructureMode(): boolean { return !this.id_enfant; }

  ngOnInit(): void {
    console.groupCollapsed('ListGalerieEnfantComponent');
    this.loadAccordingToMode();
    console.log('Mode:', this.isStructureMode ? 'Structure' : 'Enfant', this.isStructureMode ? '' : `(#${this.id_enfant})`);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id_enfant'] && !changes['id_enfant'].firstChange) {
      this.loadAccordingToMode();
    }
  }

  ngOnDestroy(): void { console.groupEnd(); }

  // ========= Chargements =========

  private loadAccordingToMode() {
    this.resetLists();
    if (this.isStructureMode) this.get_galerie_enfant_structure();
    else this.get_galerie_enfant();
  }

  /** Récupération robuste de l'id_structure (user -> token -> localStorage) */
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
      // ignore
    }
    return null;
  }
 get_galerie_enfant() {
    if (!this.id_enfant) { this.resetLists(); return; }

    this.loading_get_galerie_enfant = true;
    this.api.taf_post('galerie_enfant/get', { id_enfant: this.id_enfant }, (reponse: any) => {
      this.loading_get_galerie_enfant = false;
      this.raw = reponse?.status ? (reponse.data || []) : [];
      console.log(`Galerie enfant (enfant #${this.id_enfant})`, this.raw);
      this.filter_change();
      if (!reponse?.status) this.api.Swal_error("Lecture de la galerie échouée");
    }, () => {
      this.loading_get_galerie_enfant = false;
      this.raw = [];
      this.filter_change();
    });
  }

  /** Mode structure (avec retry si user_connected pas encore hydraté) */
  private get_galerie_enfant_structure() {
    const id_structure = this.resolveIdStructure();
    if (!id_structure) {
      if (this.structureRetry < 8) {
        this.structureRetry++;
        setTimeout(() => this.get_galerie_enfant_structure(), 300);
      }
      return;
    }

    this.structureRetry = 0;
    this.loading_get_galerie_enfant = true;

    // ⚠️ adapte la clé selon ton endpoint (ex. { 'e.id_structure': id_structure } si jointure côté PHP)
    this.api.taf_post('galerie_enfant/get_galerie_enfant_structure', { id_structure }, (reponse: any) => {
      this.loading_get_galerie_enfant = false;
      this.raw = reponse?.status ? (reponse.data || []) : [];
      console.log(`Galerie enfant (structure #${id_structure})`, this.raw);
      this.filter_change();
      if (!reponse?.status) this.api.Swal_error("Lecture de la galerie structure échouée");
    }, () => {
      this.loading_get_galerie_enfant = false;
      this.raw = [];
      this.filter_change();
    });
  }

  private resetLists() {
    this.raw = [];
    this.list = [];
    this.groups = [];
    this.totalPhotos = 0;
  }

  // ========= Filtre & Groupes =========

  filter_change(event?: any) {
    const term = (event?.term || '').toLowerCase().replace(/\s/g, '');

    this.list = this.raw.filter((one: any) => {
      if (!term) return true;
      const hay = (
        (one.id_galerie_enfant ?? '') +
        (one.id_enfant ?? '') +
        (one.date_image ?? '') +
        (one.prenom_enfant ?? '') +
        (one.nom_enfant ?? '') +
        JSON.stringify(one)
      ).toLowerCase().replace(/\s/g, '');
      return hay.includes(term);
    });

    this.totalPhotos = this.list.length;
    this.groups = this.buildGroups(this.list);
  }

  private buildGroups(arr: GalerieEnfantTafType[]): GalerieGroup[] {
    const copy = [...arr].sort((a, b) => {
      const da = a?.date_image ? new Date(a.date_image).getTime() : 0;
      const db = b?.date_image ? new Date(b.date_image).getTime() : 0;
      return db - da; // récents d'abord
    });

    const map = new Map<string, GalerieEnfantTafType[]>();
    copy.forEach(it => {
      const key = (it?.date_image || '').slice(0, 10) || '0000-00-00';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(it);
    });

    return Array.from(map.entries()).map(([k, items], idx) => ({
      date: new Date(k),
      key: k,
      carouselId: `gal-carousel-${k.replace(/[^0-9]/g, '') || idx}`,
      items
    })).sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // ========= UI helpers =========
  trackByGroup = (_: number, g: GalerieGroup) => g.key;
  trackByPhoto = (_: number, it: GalerieEnfantTafType) => it.id_galerie_enfant;

  author(it: any): string {
    const prenom = it?.prenom_utilisateur || it?.created_by_prenom;
    const nom    = it?.nom_utilisateur    || it?.created_by_nom;
    if (prenom || nom) return `${prenom || ''} ${nom || ''}`.trim();
    if (it?.created_by) return `Utilisateur #${it.created_by}`;
    return '—';
  }

  // ========= CRUD =========
  delete_galerie_enfant(item: any) {
    this.loading_delete_galerie_enfant = true;
    this.api.taf_post('galerie_enfant/delete', item, (reponse: any) => {
      this.loading_delete_galerie_enfant = false;
      if (reponse?.status) {
        this.api.Swal_success('Suppression effectuée');
        this.loadAccordingToMode();
      } else {
        this.api.Swal_error("Suppression échouée");
      }
    }, () => this.loading_delete_galerie_enfant = false);
  }

  openModal_add_galerie_enfant() {
    const modalRef = this.modalService.open(AddGalerieEnfantComponent, {
      centered: true, scrollable: true, size: 'xl', backdrop: 'static'
    });
    if (!this.isStructureMode) modalRef.componentInstance.id_enfant = this.id_enfant;
    modalRef.result.then((res: any) => { if (res?.status) this.loadAccordingToMode(); });
  }

  openModal_edit_galerie_enfant(item: any) {
    const modalRef = this.modalService.open(EditGalerieEnfantComponent, {
      centered: true, scrollable: true, size: 'xl', backdrop: 'static'
    });
    modalRef.componentInstance.galerie_enfant_to_edit = item;
    modalRef.result.then((res: any) => { if (res?.status) this.loadAccordingToMode(); });
  }

  // ========= Lightbox =========
  openViewer(group: GalerieGroup, index: number) {
    this.viewer.group = group;
    this.viewer.index = index;
    this.viewer.open = true;
  }
  closeViewer() { this.viewer.open = false; }
  prev() {
    if (!this.viewer.group) return;
    const n = this.viewer.group.items.length;
    this.viewer.index = (this.viewer.index - 1 + n) % n;
  }
  next() {
    if (!this.viewer.group) return;
    const n = this.viewer.group.items.length;
    this.viewer.index = (this.viewer.index + 1) % n;
  }
}
