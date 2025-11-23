import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../service/api/api.service';
import { NgSelectModule } from '@ng-select/ng-select';

type GalerieItem = {
  file: File;
  previewUrl: string;
  date_image: string;
  error?: string | null;
};

@Component({
  selector: 'app-add-galerie-enfant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule],
  templateUrl: './add-galerie-enfant.component.html',
  styleUrls: ['./add-galerie-enfant.component.scss']
})
export class AddGalerieEnfantComponent implements OnInit, OnDestroy {

  @Input() id_enfant = 0;           // si fourni (détail enfant) => pas de select
  @Input() enfant: any | null = null;

  form!: FormGroup;
  items: GalerieItem[] = [];

  // Select enfants (si id_enfant non fourni)
  enfants: any[] = [];
  selectedIdEnfant: number | null = null;
  loading_enfants = false;
  submitted = false;

  // validations fichiers
  maxFiles = 20;
  maxSizeMb = 8;
  allowed = ['image/jpeg','image/png','image/webp','image/gif'];

  dateParDefaut = new Date().toISOString().slice(0,10);
  globalError = '';
  loading = false;
  loading_get_details_add_galerie_enfant_form: boolean = false;
  form_details: any;

  constructor(
    private fb: FormBuilder,
    public api: ApiService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id_enfant: [this.id_enfant || null]
    });

    // si l'id enfant n'est pas fourni (depuis la liste), on charge les enfants pour le select
    if (!this.id_enfant) {
      this.loadEnfantsForSelect();
    }
  }

  ngOnDestroy(): void {
    this.items.forEach(it => it.previewUrl && URL.revokeObjectURL(it.previewUrl));
  }

  // --------- helpers ----------
  private resolveIdStructure(): number | null {
    return this.api?.user_connected?.id_structure
        || this.api?.token?.user_connected?.id_structure
        || (JSON.parse(localStorage.getItem('token') || 'null')?.user_connected?.id_structure ?? null);
  }

  loadEnfantsForSelect(): void {
    this.loading_enfants = true;
    const id_structure = this.resolveIdStructure();

    // adapte le payload à ton endpoint si besoin
    const payload: any = id_structure ? { id_structure } : {};

    this.api.taf_post_object('enfant/get', payload,
      (res: any) => {
        this.loading_enfants = false;
        const arr = Array.isArray(res?.data) ? res.data : [];
        this.enfants = arr.map((e: any) => ({
          ...e,
          full_name: `${e?.prenom_enfant || ''} ${e?.nom_enfant || ''}`.trim()
        }));
      },
      () => { this.loading_enfants = false; }
    );
  }

  get canSubmit(): boolean {
    const anyValidFile = this.items.some(i => !i.error);
    const hasChild = !!(this.id_enfant || this.selectedIdEnfant);
    return !this.loading && anyValidFile && hasChild;
  }

  // --------- fichiers ----------
  onFilesSelected(e: Event) {
    this.globalError = '';
    const files = (e.target as HTMLInputElement).files;
    if (!files || !files.length) return;

    const remaining = this.maxFiles - this.items.length;
    const list = Array.from(files).slice(0, remaining);

    list.forEach(file => {
      const err = this.validate(file);
      const previewUrl = URL.createObjectURL(file);
      this.items.push({ file, previewUrl, date_image: this.dateParDefaut, error: err });
    });

    if (this.items.length >= this.maxFiles) {
      this.globalError = `Limite de ${this.maxFiles} fichiers atteinte`;
    }
  }

  validate(file: File): string | null {
    if (!this.allowed.includes(file.type)) return 'Format non supporté';
    if (file.size > this.maxSizeMb * 1024 * 1024) return `Fichier > ${this.maxSizeMb} Mo`;
    return null;
  }

  remove(i: number) {
    const it = this.items[i];
    if (it?.previewUrl) URL.revokeObjectURL(it.previewUrl);
    this.items.splice(i, 1);
  }

  clearAll() {
    this.items.forEach(it => it.previewUrl && URL.revokeObjectURL(it.previewUrl));
    this.items = [];
  }

  // --------- submit ----------
  onSubmit() {
    this.submitted = true;
    if (!this.canSubmit) return;

    const effectiveId = this.id_enfant || this.selectedIdEnfant;
    if (!effectiveId) { this.globalError = 'Veuillez choisir un enfant.'; return; }

    const created_by = this.api.user_connected?.id_utilisateur || this.api.token?.user_connected?.id_utilisateur;
    const id_structure = this.api.user_connected?.id_structure || this.api.token?.user_connected?.id_structure;
    console.log("created_by=", created_by, " id_structure=", id_structure);
    const payload: any = {
      id_enfant: effectiveId,
      created_by,
      id_structure,
      dates: this.items.filter(it => !it.error).map(it => it.date_image)
    };

    const filesMap: Record<string, File[]> = {
      images: this.items.filter(it => !it.error).map(it => it.file)
    };

    this.loading = true;
    this.api.taf_post_with_files(
      'galerie_enfant/add_with_file',
      payload,
      filesMap,
      (reponse: any) => {
        this.loading = false;
        if (reponse?.status) {
          this.api.Swal_success('Photos enregistrées');
          this.activeModal.close(reponse);
          this.clearAll();
        } else {
          this.api.Swal_error(reponse?.message || "L'opération a échoué");
        }
      },
      () => { this.loading = false; }
    );
  }


    get_details_add_galerie_enfant_form() {
    console.log("get_details_add_galerie_enfant_form().id_structure=", this.api.user_connected.id_structure)
    this.loading_get_details_add_galerie_enfant_form = true;
    this.api.taf_post_object("enfant/get_form_details", {id_structure: this.api.user_connected.id_structure}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table enfant. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table enfant a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_add_galerie_enfant_form = false;
    }, (error: any) => {
      this.loading_get_details_add_galerie_enfant_form = false;
    })
  }
}
