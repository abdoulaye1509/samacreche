import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-detail-honoraire',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './detail-honoraire.component.html',
  styleUrl: './detail-honoraire.component.scss'
})
export class DetailHonoraireComponent implements OnInit, OnDestroy {
  loading_get_detail_honoraire = false;
  details: any = null;
  id_honoraire = 0;

  constructor(
    public api: ApiService,
    private router: Router,
    private a_route: ActivatedRoute
  ) {
    this.a_route.params.subscribe((p: any) => {
      if (p['id_honoraire']) this.id_honoraire = +p['id_honoraire'];
    });
  }

  ngOnInit(): void {
    console.groupCollapsed('DetailHonoraireComponent');
    this.get_honoraire();
  }
  ngOnDestroy(): void { console.groupEnd(); }

  get_honoraire() {
    this.loading_get_detail_honoraire = true;

    this.api.taf_post_object(
      'honoraire/get_one',
      { 'h.id_honoraire': this.id_honoraire },
      (reponse: any) => {
        this.loading_get_detail_honoraire = false;

        if (!reponse?.status) {
          this.api.Swal_error("L'opération a échoué");
          return;
        }

        const raw = reponse.data;
        const one = Array.isArray(raw) ? raw[0] : raw;
        if (!one) { this.details = null; return; }

        // Normalisations numériques
        one.montant_recu = Number(one.montant_recu ?? 0);
        one.montant_brut = Number(one.montant_brut ?? 0);
        one.brs          = Number(one.brs ?? 0);

        this.details = one;
      },
      () => {
        this.loading_get_detail_honoraire = false;
        this.api.Swal_error('Erreur de communication avec le serveur.');
      }
    );
  }

  /** N° de fiche affiché (ex: HR-0022) */
  numeroFiche(): string {
    const id = this.details?.id_honoraire;
    return 'HR-' + String(id ?? '').padStart(4, '0');
  }

  /** Affichage du nom complet de l’employé */
  fullname(): string {
    const p = (this.details?.prenom_utilisateur || '').trim();
    const n = (this.details?.nom_utilisateur || '').trim();
    return (p || n) ? `${p} ${n}`.trim() : `Utilisateur #${this.details?.id_utilisateur}`;
  }

  // ---- Montant en toutes lettres (CFA)
  numberToWordsFr(n: number): string {
    const units = ['zéro','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize'];
    const tens  = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'];

    const below100 = (x: number): string => {
      if (x < 17) return units[x];
      if (x < 20) return 'dix-' + units[x - 10];
      if (x < 70) {
        const t = Math.floor(x / 10), u = x % 10, base = tens[t];
        if (u === 0) return base;
        if (u === 1) return base + ' et un';
        return base + '-' + units[u];
      }
      if (x < 80) {
        const r = x - 60;
        if (r === 11) return 'soixante et onze';
        return 'soixante-' + below100(r);
      }
      const r = x - 80;
      if (x === 80) return 'quatre-vingts';
      if (r === 1) return 'quatre-vingt-un';
      return 'quatre-vingt-' + below100(r);
    };

    const below1000 = (x: number): string => {
      if (x < 100) return below100(x);
      const h = Math.floor(x / 100), r = x % 100;
      let res = h === 1 ? 'cent' : units[h] + ' cent';
      if (r === 0 && h > 1) res += 's';
      if (r > 0) res += ' ' + below100(r);
      return res;
    };

    if (n === 0) return 'zéro franc CFA';
    let words: string[] = [];
    const millions = Math.floor(n / 1_000_000);
    const thousands = Math.floor((n % 1_000_000) / 1000);
    const rest = n % 1000;

    if (millions) words.push(millions === 1 ? 'un million' : below1000(millions) + ' millions');
    if (thousands) words.push(thousands === 1 ? 'mille' : below1000(thousands) + ' mille');
    if (rest) words.push(below1000(rest));

    return words.join(' ') + ' francs CFA';
  }

  getNetEnLettres(): string {
    const n = Math.round(Number(this.details?.montant_recu || 0));
    return this.numberToWordsFr(n);
  }

  // Actions
  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.a_route });
  }
  downloadPdf(): void { window.print(); }
}
