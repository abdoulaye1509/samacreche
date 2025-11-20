import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../service/api/api.service';

@Component({
  selector: 'app-add-activite',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, NgClass],
  templateUrl: './add-activite.component.html',
  styleUrls: ['./add-activite.component.scss']
})
export class AddActiviteComponent implements OnInit {
  @Input() id_enfant = 0;
  @Input() enfant: any | null = null;

  form: any[] = [];
  date_activite = '';
  heure_activite = '';

  loading_add_activite = false;
  loading_get_activite = false;
  loading_info_structure = false;
  loading_info_enfant = false;

  info_structure: any = {};
  info_enfant: any = {};

  qPresets = [60, 90, 120, 150, 180];
  biberonTypes = ['Lait infantile', 'Lait maternel', 'Eau'];
  notePresets: string[] = [
    'A tout bu',
    'A bien bu',
    'A bu la moitié',
    'A peu bu',
    'Refusé',
    'Régurgitations',
    'Endormi en buvant'
  ];

  /** MAP d'icônes Bootstrap par rubrique */
  private rubriqueIcons: Record<string, string> = {
    // titres exacts utilisés dans ton JSON
    'Arrivée': 'bi-door-open text-primary',
    'Repas': 'bi-egg-fried text-danger',                 // utilisé pour tes deux rubriques "Repas"
    'Biberons': 'bi-cup-straw text-info',               // fallback neutre (bottle n’existe pas partout)
    'Repos': 'bi-moon-stars text-warning',
    'Activités de la Journée': 'bi-palette text-success',
    'Composition des repas': 'bi-basket text-secondary'
  };

  constructor(public api: ApiService, public activeModal: NgbActiveModal) {
    this.form = JSON.parse(JSON.stringify(api.form));
  }

  ngOnInit(): void {
    const now = new Date();
    this.date_activite = now.toISOString().slice(0, 10);
    this.heure_activite = now.toTimeString().slice(0, 5);

    this.get_info_structure();
    if (!this.enfant) this.get_info_enfant();
  }

  // enfant pour le header
  get child() { return this.enfant || this.info_enfant || null; }

  // date fusionnée header
  get formattedArriveeDate(): Date | null {
    if (!this.date_activite) return null;
    const d = new Date(this.date_activite);
    const m = /^(\d{2}):(\d{2})/.exec(this.heure_activite || '');
    if (m) d.setHours(+m[1], +m[2], 0, 0);
    return d;
  }

  // données structure pour la carte
  get headerInfo() {
    return (this as any).info_structure?.structure || null;
  }

  // lien maps
  toMapsLink(address?: string): string {
    const a = (address ?? '').toString().trim();
    return a ? `https://maps.google.com/?q=${encodeURIComponent(a)}` : '';
  }

  // style des boutons "Temps"
  tempsBtnClass(optionName: string, selected: boolean): string {
    if (!selected) return 'btn-outline-secondary';
    switch (optionName) {
      case 'Bon':   return 'btn-success';
      case 'Moyen': return 'btn-warning';
      case 'Agité': return 'btn-danger';
      default:      return 'btn-primary';
    }
  }

  /** Retourne la classe d’icône pour une rubrique (avec fallback) */
  rubriqueIconClass(title: string | undefined | null): string {
    const t = (title || '').trim();
    if (!t) return 'bi-folder2-open text-secondary';
    return this.rubriqueIcons[t] || 'bi-folder2-open text-secondary';
  }

  // API
  get_info_structure() {
    this.loading_info_structure = true;
    const id_structure = this.api.user_connected?.id_structure || this.api.token?.user_connected?.id_structure;
    this.api.taf_post_object(
      'structure/get_form_details',
      { id_structure },
      (r: any) => { if (r?.status) this.info_structure = r.data; this.loading_info_structure = false; },
      () => { this.loading_info_structure = false; }
    );
  }

  get_info_enfant() {
    if (!this.id_enfant) return;
    this.loading_info_enfant = true;
    this.api.taf_post_object(
      'enfant/get_2',
      { id_enfant: this.id_enfant },
      (r: any) => { if (r?.status) this.info_enfant = r.data; this.loading_info_enfant = false; },
      () => { this.loading_info_enfant = false; }
    );
  }

  // UI & biberons
  get disabled(): boolean {
    return this.loading_add_activite || !this.date_activite || !this.id_enfant;
  }
  form_change() {}

  newBiberonItem(): any {
    const now = new Date();
    const mm = String(Math.round(now.getMinutes() / 5) * 5).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    return { heure: `${hh}:${mm}`, quantite: 120, type: 'Lait infantile', note: '' };
  }

  addBiberon(rubrique: any) {
    const ligne = rubrique?.lignes?.[0];
    if (!ligne) return;
    if (!Array.isArray(ligne.items)) ligne.items = [];
    ligne.items.push(this.newBiberonItem());
  }

  removeBiberon(rubrique: any, i: number) {
    const ligne = rubrique?.lignes?.[0];
    if (!ligne?.items) return;
    ligne.items.splice(i, 1);
  }

  setNote(item: any, note: string) {
    item.note = note;
    if (item.note_libre && note !== '__AUTRE__') item.note_libre = '';
  }

  // submit
  valider() {
    const data = {
      created_by: (this.api.user_connected?.id_utilisateur || this.api.token.user_connected.id_utilisateur),
      id_structure: (this.api.user_connected?.id_structure || this.api.token.user_connected.id_structure),
      id_enfant: this.id_enfant,
      date_activite: this.date_activite,
      heure_activite: this.heure_activite || null,
      contenu: JSON.stringify(this.form)
    };
    this.add_activite(data);
  }

  add_activite(payload: any) {
    this.loading_add_activite = true;
    this.api.taf_post('activite/add', payload,
      (r: any) => {
        this.loading_add_activite = false;
        r?.status
          ? (this.api.Swal_success('Opération éffectuée avec succès'), this.activeModal.close(r))
          : this.api.Swal_error("L'opération a échoué");
      },
      () => { this.loading_add_activite = false; }
    );
  }

  reset() {
    this.date_activite = '';
    this.heure_activite = '';
    this.form = JSON.parse(JSON.stringify(this.api.form));
  }
}
