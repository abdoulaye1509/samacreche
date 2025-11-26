import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common'; // Ajout de DatePipe
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../service/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail-facturation',
  // Ajout de CommonModule, CurrencyPipe, DatePipe pour les directives et les pipes
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './detail-facturation.component.html',
  styleUrl: './detail-facturation.component.scss'
})
export class DetailFacturationComponent implements OnInit, OnDestroy {

  loading_get_detail_facturation: boolean = false;
  details: any = null;
  id_facturation: number = 0

  constructor(
    public api: ApiService,
    private modalService: NgbModal,
    private router: Router,
    private a_route: ActivatedRoute
  ) {
    // Récupération de l'ID de la facture depuis les paramètres de route
    a_route.params.subscribe((params: any) => {
      if (params["id_facturation"]) {
        this.id_facturation = params["id_facturation"]
      }
    })
  }

  ngOnInit(): void {
    console.groupCollapsed("DetailFacturationComponent");
    console.log("id de la facture", this.id_facturation)
    this.get_facturation()
  }

  ngOnDestroy(): void {
    console.groupEnd();
  }

  get_facturation() {
    this.loading_get_detail_facturation = true;

    this.api.taf_post_object(
      'facturation/get_one',
      { id_facturation: this.id_facturation },
      (reponse: any) => {
        this.loading_get_detail_facturation = false;

        if (reponse.status) {

          // 1. Récupérer le bon objet facture
          const rawData = reponse.data;
          const factureData = Array.isArray(rawData) ? rawData[0] : rawData;

          if (!factureData) {
            this.details = null;
            return;
          }

          // 2. Construire le tableau des prestations
          factureData.prestations = [];

          // 🔹 Mensualité
          const montantMensualite = parseFloat(factureData.montant_mensualite) || 0;
          const remiseMensPct = parseFloat(factureData.remise_mensualite_pct) || 0;
          const remiseMensualite = montantMensualite * remiseMensPct / 100;

          if (montantMensualite > 0) {
            const montantLigne = montantMensualite - remiseMensualite;

            factureData.prestations.push({
              reference: factureData.reference_mensualite || 'MENS',
              designation: factureData.libelle_facturation || 'Mensualité (Frais de scolarité)',
              quantite: 1,
              prix_unitaire: montantMensualite,
              remise_pct: remiseMensPct,
              remise_montant: remiseMensualite,
              montant_ht: montantLigne
            });
          }

          // 🔹 Cantine
          const montantCantine = parseFloat(factureData.montant_cantine) || 0;
          const remiseCantPct = parseFloat(factureData.remise_cantine_pct) || 0;
          const remiseCantine = montantCantine * remiseCantPct / 100;

          if (factureData.cantine === 'abonné' && montantCantine > 0) {
            const montantLigne = montantCantine - remiseCantine;

            factureData.prestations.push({
              reference: 'CANT',
              designation: 'Cantine (Abonnement mensuel)',
              quantite: 1,
              prix_unitaire: montantCantine,
              remise_pct: remiseCantPct,
              remise_montant: remiseCantine,
              montant_ht: montantLigne
            });
          }

          // 🔹 Recalcule le total à partir des lignes
          factureData.montant_total = factureData.prestations
            .reduce((sum: number, l: any) => sum + (l.montant_ht || 0), 0);

          this.details = factureData;

          console.log('Détails de la facture structurés =', this.details);

        } else {
          console.log("L'opération sur la table facturation a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué");
        }
      },
      (error: any) => {
        this.loading_get_detail_facturation = false;
        this.api.Swal_error("Erreur de communication avec le serveur.");
      }
    );
  }
  // Convertit un nombre en toutes lettres (simplifié, jusqu'aux millions)
  numberToWordsFr(n: number): string {
    const units = [
      'zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six',
      'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize',
      'quatorze', 'quinze', 'seize'
    ];

    const tens = [
      '', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'
    ];

    const below100 = (num: number): string => {
      if (num < 17) return units[num];
      if (num < 20) return 'dix-' + units[num - 10];

      if (num < 70) {
        const t = Math.floor(num / 10);
        const u = num % 10;
        const base = tens[t];
        if (u === 0) return base;
        if (u === 1) return base + ' et un';
        return base + '-' + units[u];
      }

      if (num < 80) {
        // 70–79 = 60 + 10..19
        const rest = num - 60;
        if (rest === 11) return 'soixante et onze';
        return 'soixante-' + below100(rest);
      }

      // 80–99
      const rest = num - 80;
      if (num === 80) return 'quatre-vingts';
      if (rest === 1) return 'quatre-vingt-un';
      return 'quatre-vingt-' + below100(rest);
    };

    const below1000 = (num: number): string => {
      if (num < 100) return below100(num);
      const h = Math.floor(num / 100);
      const r = num % 100;
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

    if (millions > 0) {
      words.push(millions === 1 ? 'un million' : below1000(millions) + ' millions');
    }

    if (thousands > 0) {
      words.push(thousands === 1 ? 'mille' : below1000(thousands) + ' mille');
    }

    if (rest > 0) {
      words.push(below1000(rest));
    }

    return words.join(' ') + ' francs CFA';
  }

  // Wrapper pour le template
  getMontantTotalEnLettres(): string {
    if (!this.details || !this.details.montant_total) return '';
    const montant = Math.round(parseFloat(this.details.montant_total));
    return this.numberToWordsFr(montant);
  }
  // Bouton "Retour"
  goBack(): void {
    // Retour au niveau de route précédent
    this.router.navigate(['../'], { relativeTo: this.a_route });

    // Si tu as une route fixe, tu peux utiliser à la place :
    // this.router.navigate(['/home/facturation']);
  }

  // Bouton "Exporter en PDF"
  downloadPdf(): void {
    // Ouvre la boîte de dialogue impression => l'utilisateur peut choisir "Enregistrer en PDF"
    window.print();
  }

}