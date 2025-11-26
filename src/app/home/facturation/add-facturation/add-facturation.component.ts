import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApiService } from '../../../service/api/api.service';

@Component({
  selector: 'app-add-facturation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './add-facturation.component.html',
  styleUrls: ['./add-facturation.component.scss']
})
export class AddFacturationComponent implements OnInit, OnDestroy {
  reactiveForm_add_facturation!: FormGroup;
  submitted = false;

  loading_add_facturation = false;
  loading_get_details_add_facturation_form = false;

  form_details: any = {};

  constructor(
    private fb: FormBuilder,
    public api: ApiService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    console.groupCollapsed('AddFacturationComponent');
    this.init_form();
    this.get_details_add_facturation_form();

    // 🔒 garantie de déclenchement, même si `(change)` ne feu pas
    this.f.id_enfant.valueChanges.subscribe((id: number) => {
      if (id) this.onSelectEnfant(id);
    });
  }
  ngOnDestroy(): void { console.groupEnd(); }

  private todayISO(): string {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }
  private thisMonth(): string {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${d.getFullYear()}-${m}`;
  }

  init_form() {
    this.reactiveForm_add_facturation = this.fb.group({
      id_enfant: ['', Validators.required],

      // infos facture
      mois_facture: [this.thisMonth(), Validators.required],
      date_facturation: [this.todayISO(), Validators.required],
      libelle_facturation: ['', Validators.required],


      // montants
      montant_mensualite: [0, [Validators.required, Validators.min(0)]],
      montant_cantine: [0, [Validators.required, Validators.min(0)]],
      // remises en %
      remise_mensualite_pct: [0, [Validators.min(0), Validators.max(100)]],
      remise_cantine_pct: [0, [Validators.min(0), Validators.max(100)]],
      montant_total: [{ value: 0, disabled: false }, [Validators.required, Validators.min(0)]],

      // méta
      cantine: [''], // "abonné" / "pas abonné"
      id_statut_facture: [null],
    });

    // auto libellé quand le mois change
    this.f.mois_facture.valueChanges.subscribe((ym: string) => {
      const label = ym ? `Mensualité ${this.formatMoisHumain(ym)}` : 'Mensualité';
      if (!this.f.libelle_facturation.value || this.f.libelle_facturation.pristine) {
        this.f.libelle_facturation.setValue(label);
      }
    });

    // total en live
    this.reactiveForm_add_facturation.valueChanges.subscribe(() => this.recalcTotal());
  }

  // accès rapide
  get f(): any { return this.reactiveForm_add_facturation.controls; }

  private toNumber(v: any): number {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  }

  // recalcTotal() {
  //   const mensu = this.toNumber(this.f.montant_mensualite.value);
  //   const cant = this.toNumber(this.f.montant_cantine.value);
  //   this.f.montant_total.setValue(mensu + cant, { emitEvent: false });
  // }
  recalcTotal() {
    const mensu = this.toNumber(this.f.montant_mensualite.value);
    const cant = this.toNumber(this.f.montant_cantine.value);

    const tauxMensu = this.toNumber(this.f.remise_mensualite_pct.value);
    const tauxCant = this.toNumber(this.f.remise_cantine_pct.value);

    // borne de sécurité 0–100
    const tMensu = Math.min(Math.max(tauxMensu, 0), 100);
    const tCant = Math.min(Math.max(tauxCant, 0), 100);

    const netMensu = Math.round(mensu * (1 - tMensu / 100));
    const netCant = Math.round(cant * (1 - tCant / 100));

    this.f.montant_total.setValue(netMensu + netCant, { emitEvent: false });
  }

  private formatMoisHumain(ym: string): string {
    // "2025-11" -> "Novembre 2025"
    try {
      const [y, m] = ym.split('-').map(Number);
      const d = new Date(y, (m - 1) || 0, 1);
      return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    } catch {
      return ym;
    }
  }

  // onSelectEnfant(id_enfant: number) {
  //   if (!id_enfant) return;

  //   // Récupère la mensualité + cantine de l’enfant
  //   const payload = {
  //     id_enfant,
  //     id_structure: this.api?.user_connected?.id_structure ?? null
  //   };
  //   this.api.taf_post_object('facturation/get_enfant_billing', payload, (rep: any) => {
  //     if (rep?.status) {
  //       const info = rep.data || {};
  //       // montants
  //       this.f.montant_mensualite.setValue(Number(info.montant_mensualite || 0));
  //       this.f.montant_cantine.setValue(Number(info.montant_cantine || 0));
  //       this.f.cantine.setValue(info.cantine || '');
  //       // libellé si vide
  //       const ym = this.f.mois_facture.value;
  //       if (!this.f.libelle_facturation.value) {
  //         this.f.libelle_facturation.setValue(`Mensualité ${this.formatMoisHumain(ym)}`);
  //       }
  //       this.recalcTotal();
  //     } else {
  //       this.api.Swal_error("Impossible de récupérer la fiche de l'enfant");
  //     }
  //   }, () => { });
  // }

  // ---------- Submit ----------
  onSelectEnfant(enfant: any) {
    const id_enfant =
      typeof enfant === 'number'
        ? enfant
        : enfant?.id_enfant;

    if (!id_enfant) return;

    const payload = {
      id_enfant,
      id_structure: this.api?.user_connected?.id_structure ?? null
    };

    this.api.taf_post_object('facturation/get_enfant_billing', payload, (rep: any) => {
      if (rep?.status) {
        const info = rep.data || {};

        const mensu = Number(info.montant_mensualite || 0);
        const cant = Number(info.montant_cantine || 0);
        const statut = info.cantine || '';

        this.f.montant_mensualite.setValue(mensu);
        this.f.montant_cantine.setValue(cant);
        this.f.cantine.setValue(statut);

        // si pas abonné, tu peux forcer 0 :
        if (statut !== 'abonné') {
          this.f.montant_cantine.setValue(0);
        }

        const ym = this.f.mois_facture.value;
        if (!this.f.libelle_facturation.value) {
          this.f.libelle_facturation.setValue(`Mensualité ${this.formatMoisHumain(ym)}`);
        }

        this.recalcTotal();
      } else {
        // en cas d’erreur, on nettoie les champs pour éviter de garder l’ancienne valeur
        this.f.montant_mensualite.setValue(0);
        this.f.montant_cantine.setValue(0);
        this.f.cantine.setValue('');
        this.recalcTotal();
        this.api.Swal_error("Impossible de récupérer la fiche de l'enfant");
      }
    }, () => {
      this.f.montant_mensualite.setValue(0);
      this.f.montant_cantine.setValue(0);
      this.f.cantine.setValue('');
      this.recalcTotal();
    });
  }

  onSubmit_add_facturation() {
    this.submitted = true;

    if (this.reactiveForm_add_facturation.invalid) return;
    this.recalcTotal(); // 🧮 sécurité
    const facturation = { ...this.reactiveForm_add_facturation.getRawValue() };
    facturation.created_by = this.api.user_connected.id_utilisateur;  // (corrigé: created_by)
    facturation.id_structure = this.api.user_connected.id_structure;

    this.add_facturation(facturation);
  }

  add_facturation(facturation: any) {
    this.loading_add_facturation = true;
    this.api.taf_post('facturation/add_2', facturation, (reponse: any) => {
      this.loading_add_facturation = false;
      if (reponse?.status) {
        this.onReset_add_facturation();
        this.api.Swal_success('Facture enregistrée');
        this.activeModal.close(reponse);
      } else {
        this.api.Swal_error("L'opération a échoué");
      }
    }, () => this.loading_add_facturation = false);
  }

  onReset_add_facturation() {
    this.submitted = false;
    this.reactiveForm_add_facturation.reset({
      id_enfant: '',
      mois_facture: this.thisMonth(),
      date_facturation: this.todayISO(),
      libelle_facturation: '',
      montant_mensualite: 0,
      montant_cantine: 0,
      remise_mensualite_pct: 0,   // 👈 nouveau
      remise_cantine_pct: 0,      // 👈 nouveau
      montant_total: 0,
      cantine: '',
      id_statut_facture: null,
      numero_facture: ''
    });
  }

  // ---------- Form details ----------
  get_details_add_facturation_form() {
    this.loading_get_details_add_facturation_form = true;

    // On récupère la liste des enfants (+ éventuellement la liste des statuts)
    this.api.taf_post_object(
      'facturation/get_form_details2',
      { id_structure: this.api.user_connected.id_structure },
      (reponse: any) => {
        this.loading_get_details_add_facturation_form = false;
        if (reponse?.status) {
          this.form_details = reponse.data || {};
        } else {
          this.api.Swal_error("Impossible de charger les données de formulaire");
        }
      },
      () => this.loading_get_details_add_facturation_form = false
    );
  }
}
