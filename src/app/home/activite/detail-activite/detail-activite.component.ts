import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../service/api/api.service';

@Component({
  selector: 'app-detail-activite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-activite.component.html',
  styleUrl: './detail-activite.component.scss'
})
export class DetailActiviteComponent implements OnInit, OnDestroy {
  @Input() selected_activite: any;
  form: any[] = [];

  /** Icônes par rubrique (mêmes choix que dans add) */
  private rubriqueIcons: Record<string, string> = {
    'Arrivée': 'bi-door-open text-primary',
    'Repas': 'bi-egg-fried text-danger',
    'Biberons': 'bi-cup-straw text-info',
    'Repos': 'bi-moon-stars text-warning',
    'Activités de la Journée': 'bi-palette text-success',
    'Composition des repas': 'bi-basket text-secondary'
  };

  constructor(public api: ApiService, @Optional() public activeModal?: NgbActiveModal) {}

  ngOnInit(): void {
    console.groupCollapsed('DetailActiviteComponent');
    this.form = this.safeParse(this.selected_activite?.contenu) ?? [];
    console.log('Selected activite:', this.selected_activite);
    console.log('Parsed form content:', this.form);
    console.groupEnd();
  }

  ngOnDestroy(): void {}

  // --- Utils ---
  private safeParse(src: any): any[] {
    try {
      if (!src) return [];
      return typeof src === 'string' ? JSON.parse(src) : src;
    } catch {
      return [];
    }
  }

  get formattedArriveeDate(): Date | null {
    if (!this.selected_activite?.date_activite) return null;
    const d = new Date(this.selected_activite.date_activite);

    const h = this.selected_activite?.heure_activite;
    if (!h || typeof h !== 'string') return d;

    const m = /^(\d{2}):(\d{2})/.exec(h);
    if (!m) return d;

    d.setHours(+m[1], +m[2], 0, 0);
    return d;
  }

  toMapsLink(address?: string): string {
    const a = (address ?? '').toString().trim();
    return a ? `https://maps.google.com/?q=${encodeURIComponent(a)}` : '';
  }

  rubriqueIconClass(title?: string | null): string {
    const t = (title || '').trim();
    return t ? (this.rubriqueIcons[t] || 'bi-folder2-open text-secondary')
             : 'bi-folder2-open text-secondary';
  }

  // --- Détection/lecture Biberons (nouveau + ancien schéma) ---
  getRubriqueType(rubrique: any): 'biberons' | '' {
    if (!rubrique) return '';
    const lignes = Array.isArray(rubrique.lignes) ? rubrique.lignes : [];
    if (lignes.some((l: any) => l?.type === 'biberons')) return 'biberons';
    const biberonRows = lignes.filter((l: any) => (l?.titre || '').toLowerCase() === 'biberons');
    return biberonRows.length ? 'biberons' : '';
  }

  extractBiberons(rubrique: any): Array<{ heure?: string; quantite?: any; type?: string; note?: string; note_libre?: string }> {
    if (!rubrique) return [];
    const lignes = Array.isArray(rubrique.lignes) ? rubrique.lignes : [];

    // Nouveau schéma
    const withItems = lignes.find((l: any) => Array.isArray(l?.items));
    if (withItems) return withItems.items || [];

    // Ancien schéma
    const rows = lignes.filter((l: any) => (l?.titre || '').toLowerCase() === 'biberons');
    if (rows.length) {
      const heures = rows[0]?.options || [];
      const quantites = rows[1]?.options || [];
      const max = Math.max(heures.length, quantites.length);

      const out: any[] = [];
      for (let i = 0; i < max; i++) {
        out.push({
          heure: heures[i]?.value || '',
          quantite: quantites[i]?.value || '',
          type: '',
          note: ''
        });
      }
      return out.filter(x => x.heure || x.quantite || x.type || x.note);
    }
    return [];
  }

  // --- Rendu "Temps" (lecture) ---
  tempsBadgeClass(val: string): string {
    switch (val) {
      case 'Bon':   return 'text-bg-success';
      case 'Moyen': return 'text-bg-warning';
      case 'Agité': return 'text-bg-danger';
      default:      return 'text-bg-secondary';
    }
  }
  labelTemps(val: string): string {
    switch (val) {
      case 'Bon':   return '🙂 Bon';
      case 'Moyen': return '😐 Moyen';
      case 'Agité': return '😣 Agité';
      default:      return val || '—';
    }
  }
}
