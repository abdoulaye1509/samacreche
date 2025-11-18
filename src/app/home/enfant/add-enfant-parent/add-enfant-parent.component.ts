import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-add-enfant-parent',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule,NgSelectModule],
  templateUrl: './add-enfant-parent.component.html',
  styleUrl: './add-enfant-parent.component.scss'
})
export class AddEnfantParentComponent {
reactiveForm_add_enfant !: FormGroup;
  submitted: boolean = false
  loading_add_enfant: boolean = false
  form_details: any = {}
  loading_get_details_add_enfant_form = false
   les_enfants: any[] = []
  les_parents: any[] = []
    imagePreviewUrl: string | null = null;
  imageError = '';
  imageFile: File | null = null;
 @Input() id_parent!: number;         // reçu du modal parent
  @Input() parent_label = '';          // joli affichage dans le header

  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    console.groupCollapsed("AddEnfantComponent");
    this.get_details_add_enfant_form()
    this.init_form()
  }
  ngOnDestroy(): void {
        if (this.imagePreviewUrl) URL.revokeObjectURL(this.imagePreviewUrl);

    console.groupEnd();
  }
  
  // acces facile au champs de votre formulaire
  init_form() {
  this.reactiveForm_add_enfant = this.formBuilder.group({
    id_pays:        [null, Validators.required],
    id_genre:       [null, Validators.required],
    prenom_enfant:  ['',  Validators.required],
    nom_enfant:     ['',  Validators.required],
    date_naissance: ['',  Validators.required],
    lieu_naissance: [''],
    adresse_enfant: [''],
// --- fiche_enfant
    id_mensualite_structure: [null, Validators.required],
    id_cantine:            [null],

  });
}


  get f(): any { return this.reactiveForm_add_enfant.controls; }
  // validation du formulaire
  onSubmit_add_enfant() {
    this.submitted = true;
    console.log(this.reactiveForm_add_enfant.value)
    // stop here if form is invalid
    if (this.reactiveForm_add_enfant.invalid) {
      return;
    }
    var enfant = this.reactiveForm_add_enfant.value
    enfant.id_structure = this.api.user_connected.id_structure
    enfant.created_by = this.api.user_connected.id_utilisateur
       // >>> clé: on envoie l'id_parent fixé <<<
    enfant.id_parent = this.id_parent || null;
    this.add_enfant(enfant)
  }
  // vider le formulaire
  onReset_add_enfant() {
    this.submitted = false;
    this.reactiveForm_add_enfant.reset();
  }
  add_enfant(enfant: any) {
    this.loading_add_enfant = true;
    this.api.taf_post_with_files("enfant/add_enfant_parent", enfant, { photo_enfant: this.imageFile ? [this.imageFile] : [] }, (reponse: any) => {
      this.loading_add_enfant = false;
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table enfant. Réponse= ", reponse);
        this.onReset_add_enfant()
        this.api.Swal_success("Opération éffectuée avec succés")
        this.activeModal.close(reponse)
      } else {
        console.log("L'opération sur la table enfant a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
      this.loading_add_enfant = false;
    })
  }

  get_details_add_enfant_form() {
    console.log("get_details_add_enfant_form().id_structure=", this.api.user_connected.id_structure)
    this.loading_get_details_add_enfant_form = true;
    this.api.taf_post_object("enfant/get_form_details", {id_structure: this.api.user_connected.id_structure}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table enfant. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table enfant a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_add_enfant_form = false;
    }, (error: any) => {
      this.loading_get_details_add_enfant_form = false;
    })
  }
   // ---------- Image ----------
  onImageSelected(e: Event) {
    this.imageError = '';
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { this.imageError = 'Format non supporté'; return; }
    if (file.size > 5 * 1024 * 1024) { this.imageError = 'Taille max 5 Mo'; return; }
    this.imageFile = file;
    if (this.imagePreviewUrl) URL.revokeObjectURL(this.imagePreviewUrl);
    this.imagePreviewUrl = URL.createObjectURL(file);
  }

  removeImage() {
    this.imageFile = null;
    if (this.imagePreviewUrl) {
      URL.revokeObjectURL(this.imagePreviewUrl);
      this.imagePreviewUrl = null;
    }
  }
  // Masquer la section "parents" quand on a déjà un parent imposé
  get fromParentMode() { return !!this.id_parent; }
}
