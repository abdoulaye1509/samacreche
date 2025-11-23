import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApiService } from '../../../service/api/api.service';

type EnfantItem = { id_enfant: number; prenom_enfant: string; nom_enfant: string; nom_complet?: string };

@Component({
  selector: 'app-add-planning-enfant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './add-planning-enfant.component.html',
  styleUrls: ['./add-planning-enfant.component.scss']
})
export class AddPlanningEnfantComponent implements OnInit, OnDestroy {
 @Input() id_enfant = 0;
  @Input() defaults?: Partial<{
    date_debut: string; date_fin: string;
    heure_debut: string; heure_fin: string;
    titre_planning_enfant: string;
    description_planning_enfant: string;
    couleur: string; id_enfant: number|null;
  }>;
  form!: FormGroup;
  submitted = false;
  loading = false;

  enfants: EnfantItem[] = [];
  dateRangeInvalid = false;

  constructor(
    private fb: FormBuilder,
    public api: ApiService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id_enfant: [this.id_enfant || null, Validators.required],
      titre_planning_enfant: ['', Validators.required],
      description_planning_enfant: [''],
      date_debut: ['', Validators.required],
      date_fin:   ['', Validators.required],
      heure_debut:['', Validators.required],
      heure_fin:  ['', Validators.required],
      couleur:    ['#4f46e5', [Validators.required, Validators.pattern(/^#([0-9a-fA-F]{6})$/)]],
    });

    // charger la liste enfants si pas d'id injecté
    if (!this.id_enfant) {
      this.api.taf_post_object('enfant/get', {}, (res: any) => {
        if (res?.status) {
          this.enfants = (res.data || []).map((e: any) => ({
            id_enfant: e.id_enfant,
            prenom_enfant: e.prenom_enfant,
            nom_enfant: e.nom_enfant,
            nom_complet: `${e.prenom_enfant || ''} ${e.nom_enfant || ''}`.trim()
          }));
        }
      }, (err: any) => {
        // gestion d'erreur optionnelle
        console.error('Erreur chargement enfants', err);
      });
    }

  }

  ngOnDestroy(): void {}

  get f() { return this.form.controls; }

  private combine(d: string, t: string): string {
    // retourne ISO local (YYYY-MM-DDTHH:mm)
    return `${d}T${t}`;
  }

  private validateRange(): boolean {
    const start = new Date(this.combine(this.f['date_debut'].value, this.f['heure_debut'].value));
    const end   = new Date(this.combine(this.f['date_fin'].value,   this.f['heure_fin'].value));
    this.dateRangeInvalid = !(start instanceof Date && !isNaN(+start) && end instanceof Date && !isNaN(+end) && end > start);
    return !this.dateRangeInvalid;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;
    if (!this.validateRange()) return;

    const created_by = this.api.user_connected?.id_utilisateur || this.api.token?.user_connected?.id_utilisateur;
    const payload = {
      ...this.form.value,
      created_by
    };

    this.loading = true;
    this.api.taf_post('planning_enfant/add', payload, (reponse: any) => {
      this.loading = false;
      if (reponse?.status) {
        this.api.Swal_success('Planning enregistré');
        this.activeModal.close(reponse);
      } else {
        this.api.Swal_error("Échec de l’opération");
      }
    }, () => this.loading = false);
  }
}
