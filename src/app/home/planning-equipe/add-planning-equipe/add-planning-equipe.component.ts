import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApiService } from '../../../service/api/api.service';

type PlanningEquipe = {
  id_planning_equipe?: number;
  id_utilisateur: number | null;
  id_structure?: number | null;
  titre_planning_equipe: string;
  description_planning_equipe?: string;
  date_debut: string;   // YYYY-MM-DD
  date_fin: string;     // YYYY-MM-DD
  heure_debut?: string; // HH:mm
  heure_fin?: string;   // HH:mm
  couleur?: string;     // #RRGGBB
};

@Component({
  selector: 'app-add-planning-equipe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './add-planning-equipe.component.html',
  styleUrls: ['./add-planning-equipe.component.scss']
})
export class AddPlanningEquipeComponent implements OnInit, OnDestroy {
  @Input() defaults?: Partial<PlanningEquipe>;     // pré-remplissage (sélection calendrier)
  @Input() id_utilisateur?: number;               // si tu veux forcer un user (optionnel)

  reactiveForm_add_planning_equipe!: FormGroup;
  submitted = false;
  loading_add_planning_equipe = false;
  loading_get_details_add_planning_equipe_form = false;
  form_details: any = { utilisateurs: [] };

  constructor(
    private fb: FormBuilder,
    public api: ApiService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    console.groupCollapsed('AddPlanningEquipeComponent');
    this.init_form();
    this.get_details_add_planning_equipe_form();
    this.patch_defaults();
  }
  ngOnDestroy(): void { console.groupEnd(); }

  init_form() {
    this.reactiveForm_add_planning_equipe = this.fb.group({
      id_utilisateur: ['',[Validators.required]],
      titre_planning_equipe: ['', [Validators.required, Validators.maxLength(150)]],
      description_planning_equipe: [''],
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required],
      heure_debut: [''],
      heure_fin: [''],
      couleur: ['#0d6efd', Validators.required],
    });
  }

  patch_defaults() {
    const d = this.defaults || {};
    if (this.id_utilisateur) d.id_utilisateur = this.id_utilisateur;
    if (!d.id_utilisateur && this.api?.user_connected?.id_utilisateur) {
      d.id_utilisateur = this.api.user_connected.id_utilisateur;
    }
    if (Object.keys(d).length) this.reactiveForm_add_planning_equipe.patchValue(d);
  }

  // accès rapide
  get f() { return this.reactiveForm_add_planning_equipe.controls; }

  onSubmit_add_planning_equipe() {
    this.submitted = true;
    if (this.reactiveForm_add_planning_equipe.invalid) return;

    const payload: any = {
      ...this.reactiveForm_add_planning_equipe.value,
      created_by: this.api?.user_connected?.id_utilisateur,
      id_structure: this.api?.user_connected?.id_structure
    };

    // normalise HH:mm -> HH:mm:00 côté API si besoin
    ['heure_debut', 'heure_fin'].forEach(k => {
      if (payload[k] && payload[k].length === 5) payload[k] = payload[k] + ':00';
    });

    this.add_planning_equipe(payload);
  }

  onReset_add_planning_equipe() {
    this.submitted = false;
    this.reactiveForm_add_planning_equipe.reset({ couleur: '#0d6efd' });
    this.patch_defaults();
  }

  add_planning_equipe(planning_equipe: any) {
    this.loading_add_planning_equipe = true;
    this.api.taf_post('planning_equipe/add', planning_equipe, (reponse: any) => {
      this.loading_add_planning_equipe = false;
      if (reponse?.status) {
        this.api.Swal_success('Opération éffectuée avec succès');
        this.activeModal.close(reponse);
      } else {
        this.api.Swal_error("L'opération a échoué");
      }
    }, () => this.loading_add_planning_equipe = false);
  }

  get_details_add_planning_equipe_form() {
    console.log('get_details_add_planning_equipe_form, this.api.user_connected', this.api.user_connected.id_structure);
    this.loading_get_details_add_planning_equipe_form = true;
    this.api.taf_post_object('planning_equipe/get_form_details', {'u.id_structure':this.api.user_connected.id_structure}, (reponse: any) => {
      this.loading_get_details_add_planning_equipe_form = false;
      if (reponse?.status) 
        this.form_details = reponse.data || this.form_details;
      console.log('form_details', this.form_details);
    },
     () => this.loading_get_details_add_planning_equipe_form = false);
  }
}
