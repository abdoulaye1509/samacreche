import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { EnfantTafType } from '../taf-type/enfant-taf-type';
@Component({
  selector: 'app-add-enfant',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './add-enfant.component.html',
  styleUrls: ['./add-enfant.component.scss']
})
export class AddEnfantComponent implements OnInit, OnDestroy {
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
  // init_form() {
  //   this.reactiveForm_add_enfant = this.formBuilder.group({
  //     id_pays: [""],
  //     id_genre: [""],
  //     prenom_enfant: [""],
  //     nom_enfant: [""],
  //     date_naissance: [""],
  //     lieu_naissance: [""],
  //     adresse_enfant: [""],
  //     photo_enfant: [""],
  //          // les_parents:this.formBuilder.array([this.build_champ_parent()]),
  //     les_parents: this.formBuilder.array([
  //       this.formBuilder.group({
  //         prenom_parent:["", Validators.required],
  //         nom_parent: ["", Validators.required],
  //         adresse: [""],
  //         telephone: ["", ],
  //         email: ["", ],
  //         cni: ["", ],
  //         id_lien_parente: ["", ],
  //       })
  //     ])
     
  //   });
  // }
  // build_champ_parent():FormGroup{
  //   return this.formBuilder.group({
  //     prenom_parent:["", Validators.required],
  //     nom_parent: [[], Validators.required],
  //     adresse: ["", Validators.required],
  //     telephone: ["", Validators.required],
  //     email: ["", Validators.required],
  //     cni: ["", Validators.required],
  //     lien_parente: ["", Validators.required],
  //   })
  // }
  // ajouter_champ_parent(){
  //   (this.f.les_parents as FormArray).push(this.build_champ_parent());
  //   console.log("boutons autres parents")

  // }
  // removeParent(index: number) {
  //   const parentsArray = this.reactiveForm_add_enfant.get('les_parents') as FormArray;
  //   parentsArray.removeAt(index);
  // }
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

    les_parents: this.formBuilder.array([ this.buildParent() ])
  });
}

// Getter pratique
get parents(): FormArray {
  return this.reactiveForm_add_enfant.get('les_parents') as FormArray;
}

buildParent(): FormGroup {
  return this.formBuilder.group({
    prenom_parent:   ['', Validators.required],
    nom_parent:      ['', Validators.required],
    adresse:         [''],
    telephone:       [''],
    email:           ['', Validators.email],
    cni:             [''],
    id_lien_parente: [null, Validators.required]
  });
}

ajouter_champ_parent() { this.parents.push(this.buildParent()); }
removeParent(i: number) { this.parents.removeAt(i); }
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
    this.add_enfant(enfant)
  }
  // vider le formulaire
  onReset_add_enfant() {
    this.submitted = false;
    this.reactiveForm_add_enfant.reset();
  }
  add_enfant(enfant: any) {
    this.loading_add_enfant = true;
    this.api.taf_post_with_files("enfant/add_with_file", enfant, { photo_enfant: this.imageFile ? [this.imageFile] : [] }, (reponse: any) => {
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
}
