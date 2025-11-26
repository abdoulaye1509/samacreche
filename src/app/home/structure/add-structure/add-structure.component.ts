import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { StructureTafType } from '../taf-type/structure-taf-type';

@Component({
  selector: 'app-add-structure',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './add-structure.component.html',
  styleUrls: ['./add-structure.component.scss']
})
export class AddStructureComponent implements OnInit, OnDestroy {
  reactiveForm_add_structure!: FormGroup;
  submitted = false;
  loading_add_structure = false;
  form_details: any = {};
  loading_get_details_add_structure_form = false;

  // --- logo ---
  logoFile: File | null = null;
  logoPreviewUrl: string | null = null;
  logoError = '';
  maxLogoSizeMb = 4;
  allowedLogoTypes = ['image/jpeg','image/png','image/webp','image/gif'];

  constructor(
    private formBuilder: FormBuilder,
    public api: ApiService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    console.groupCollapsed('AddStructureComponent');
    this.get_details_add_structure_form();
    this.init_form();
  }

  ngOnDestroy(): void {
    console.groupEnd();
    if (this.logoPreviewUrl) {
      URL.revokeObjectURL(this.logoPreviewUrl);
    }
  }

  init_form() {
    this.reactiveForm_add_structure = this.formBuilder.group({
      id_statut_structure: [''],
      nom_structure: ['', Validators.required],
      adresse_structure: ['', Validators.required],
      telephone_structure: ['', Validators.required],
      longitude: [''],
      latitude: [''],
      // on garde le champ, mais il sera rempli côté backend
      logo_structure: [''],
    });
  }

  get f(): any { return this.reactiveForm_add_structure.controls; }

  // ----- gestion logo -----
  onLogoSelected(e: Event) {
    this.logoError = '';
    const input = e.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;

    // validation
    if (!this.allowedLogoTypes.includes(file.type)) {
      this.logoError = 'Format non supporté';
      this.clearLogo(false);
      return;
    }
    if (file.size > this.maxLogoSizeMb * 1024 * 1024) {
      this.logoError = `Fichier > ${this.maxLogoSizeMb} Mo`;
      this.clearLogo(false);
      return;
    }

    // ok
    if (this.logoPreviewUrl) URL.revokeObjectURL(this.logoPreviewUrl);
    this.logoFile = file;
    this.logoPreviewUrl = URL.createObjectURL(file);
  }

  clearLogo(resetError: boolean = true) {
    if (this.logoPreviewUrl) URL.revokeObjectURL(this.logoPreviewUrl);
    this.logoPreviewUrl = null;
    this.logoFile = null;
    if (resetError) this.logoError = '';
  }

  // ----- submit -----
  onSubmit_add_structure() {
    this.submitted = true;
    console.log(this.reactiveForm_add_structure.value);

    if (this.reactiveForm_add_structure.invalid) {
      return;
    }

    const structure = { ...this.reactiveForm_add_structure.value };
    structure.created_by = this.api.user_connected.id_utilisateur;

    // si pas de logo => ancien endpoint
    if (!this.logoFile) {
      this.add_structure(structure);
    } else {
      this.add_structure_with_logo(structure);
    }
  }

  onReset_add_structure() {
    this.submitted = false;
    this.reactiveForm_add_structure.reset();
    this.clearLogo();
  }

  add_structure(structure: any) {
    this.loading_add_structure = true;
    this.api.taf_post('structure/add', structure, (reponse: any) => {
      this.loading_add_structure = false;
      if (reponse.status) {
        console.log('Opération effectuée avec succés sur la table structure. Réponse= ', reponse);
        this.onReset_add_structure();
        this.api.Swal_success('Opération éffectuée avec succés');
        this.activeModal.close(reponse);
      } else {
        console.log("L'opération sur la table structure a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué");
      }
    }, () => {
      this.loading_add_structure = false;
    });
  }

  // >>> nouveau : ajout avec fichier, même style que galerie_enfant/add_with_file
  add_structure_with_logo(structure: any) {
    if (!this.logoFile) return;

    this.loading_add_structure = true;

    const filesMap: Record<string, File[]> = {
      logo: [this.logoFile]
    };

    this.api.taf_post_with_files(
      'structure/add_with_file',
      structure,
      filesMap,
      (reponse: any) => {
        this.loading_add_structure = false;
        if (reponse?.status) {
          console.log('Opération effectuée avec succès sur la table structure (avec logo). Réponse=', reponse);
          this.onReset_add_structure();
          this.api.Swal_success('Structure enregistrée');
          this.activeModal.close(reponse);
        } else {
          console.log("L'opération sur la table structure a échoué. Réponse= ", reponse);
          this.api.Swal_error(reponse?.message || "L'opération a échoué");
        }
      },
      () => {
        this.loading_add_structure = false;
      }
    );
  }

  get_details_add_structure_form() {
    this.loading_get_details_add_structure_form = true;
    this.api.taf_post('structure/get_form_details', {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data;
        console.log('Opération effectuée avec succés sur la table structure. Réponse= ', reponse);
      } else {
        console.log("L'opération sur la table structure a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué");
      }
      this.loading_get_details_add_structure_form = false;
    }, () => {
      this.loading_get_details_add_structure_form = false;
    });
  }
}
