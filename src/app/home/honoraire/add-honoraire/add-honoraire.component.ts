import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApiService } from '../../../service/api/api.service';

@Component({
  selector: 'app-add-honoraire',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './add-honoraire.component.html',
  styleUrls: ['./add-honoraire.component.scss']
})
export class AddHonoraireComponent implements OnInit, OnDestroy {
  reactiveForm_add_honoraire!: FormGroup;
  submitted = false;

  loading_add_honoraire = false;
  loading_get_details_add_honoraire_form = false;

  form_details: any = {};

  constructor(
    private fb: FormBuilder,
    public api: ApiService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    console.groupCollapsed('AddHonoraireComponent');
    this.init_form();
    this.get_details_add_honoraire_form();
  }
  ngOnDestroy(): void { console.groupEnd(); }

  private todayISO(): string {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }
  private moisHumain(dateISO: string): string {
    try {
      const d = new Date(dateISO);
      return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    } catch { return ''; }
  }

 init_form() {
  this.reactiveForm_add_honoraire = this.fb.group({
    id_utilisateur: ['', Validators.required],
    date_honoraire: [this.todayISO(), Validators.required],
    libelle_honoraire: ['', Validators.required],
    montant_recu: [0, [Validators.required, Validators.min(0)]],
    id_statut_honoraire: [null]    // <-- nouveau
  });

  this.f.date_honoraire.valueChanges.subscribe((d: string) => {
    if (!this.f.libelle_honoraire.value || this.f.libelle_honoraire.pristine) {
      this.f.libelle_honoraire.setValue(`Honoraire ${this.moisHumain(d)}`);
    }
  });
}


  // accès rapide
  get f(): any { return this.reactiveForm_add_honoraire.controls; }

onSubmit_add_honoraire() {
  this.submitted = true;
  if (this.reactiveForm_add_honoraire.invalid) return;

  // Sécurise : convertit l’affichage "25 000" -> 25000
  const val = this.f.montant_recu.value;
  const numeric = (typeof val === 'number')
    ? val
    : this.api.unformatMontant(String(val), ' ', ',');
  this.f.montant_recu.setValue(Number.isFinite(numeric) ? numeric : 0, { emitEvent: false });

  const honoraire = { ...this.reactiveForm_add_honoraire.getRawValue() };
  honoraire.created_by   = this.api.user_connected.id_utilisateur;
  honoraire.id_structure = this.api.user_connected.id_structure;

  this.add_honoraire(honoraire);
}

  onReset_add_honoraire() {
    this.submitted = false;
    this.reactiveForm_add_honoraire.reset({
      id_utilisateur: '',
      date_honoraire: this.todayISO(),
      libelle_honoraire: '',
      montant_recu: 0,
      id_statut_honoraire: null
    });
  }

  add_honoraire(honoraire: any) {
    this.loading_add_honoraire = true;
    this.api.taf_post('honoraire/add_2', honoraire, (reponse: any) => {
      this.loading_add_honoraire = false;
      if (reponse?.status) {
        this.onReset_add_honoraire();
        this.api.Swal_success('Honoraire enregistré');
        this.activeModal.close(reponse);
      } else {
        this.api.Swal_error("L'opération a échoué");
      }
    }, () => this.loading_add_honoraire = false);
  }

  get_details_add_honoraire_form() {
    this.loading_get_details_add_honoraire_form = true;
    this.api.taf_post_object(
      'honoraire/get_form_details',
      { 'u.id_structure': this.api.user_connected.id_structure },
      (reponse: any) => {
        this.loading_get_details_add_honoraire_form = false;
        if (reponse?.status) {
          // attendu: { les_utilisateurs: [...], les_statut_honoraires: [...] }
          this.form_details = reponse.data || {};
        } else {
          this.api.Swal_error("Impossible de charger les données de formulaire");
        }
      },
      () => this.loading_get_details_add_honoraire_form = false
    );
  }
}
