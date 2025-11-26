import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { StructureTafType } from '../taf-type/structure-taf-type';

@Component({
  selector: 'app-edit-structure',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './edit-structure.component.html',
  styleUrls: ['./edit-structure.component.scss']
})
export class EditStructureComponent implements OnInit, OnDestroy {
  reactiveForm_edit_structure!: FormGroup;
  submitted = false;
  loading_edit_structure = false;

  @Input()
  structure_to_edit: StructureTafType = new StructureTafType();

  form_details: any = {};
  loading_get_details_edit_structure_form = false;

  // --- logo (comme add) ---
  logoFile: File | null = null;
  logoPreviewUrl: string | null = null;   // affiche soit l'ancien, soit le nouveau
  logoError = '';
  maxLogoSizeMb = 4;
  allowedLogoTypes = ['image/jpeg','image/png','image/webp','image/gif'];

  constructor(
    private formBuilder: FormBuilder,
    public api: ApiService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    console.groupCollapsed('EditStructureComponent');
    this.init_form();
    this.update_form(this.structure_to_edit);
    this.get_details_edit_structure_form();

    // logo actuel
    if (this.structure_to_edit?.logo_structure) {
      this.logoPreviewUrl = this.api.resolveFileUrl(this.structure_to_edit.logo_structure);
    }
  }

  ngOnDestroy(): void {
    console.groupEnd();
    if (this.logoPreviewUrl) {
      URL.revokeObjectURL(this.logoPreviewUrl);
    }
  }

  init_form() {
    this.reactiveForm_edit_structure = this.formBuilder.group({
      id_statut_structure: [this.structure_to_edit.id_statut_structure],
      nom_structure: [this.structure_to_edit.nom_structure, Validators.required],
      adresse_structure: [this.structure_to_edit.adresse_structure, Validators.required],
      telephone_structure: [this.structure_to_edit.telephone_structure, Validators.required],
      longitude: [this.structure_to_edit.longitude],
      latitude: [this.structure_to_edit.latitude],
      logo_structure: [this.structure_to_edit.logo_structure], // rempli côté backend si nouveau logo
    });
  }

  // si jamais tu veux re-patcher (pas obligatoire ici)
  update_form(structure_to_edit: any) {
    if (!this.reactiveForm_edit_structure) return;
    this.reactiveForm_edit_structure.patchValue({
      id_statut_structure: structure_to_edit.id_statut_structure,
      nom_structure: structure_to_edit.nom_structure,
      adresse_structure: structure_to_edit.adresse_structure,
      telephone_structure: structure_to_edit.telephone_structure,
      longitude: structure_to_edit.longitude,
      latitude: structure_to_edit.latitude,
      logo_structure: structure_to_edit.logo_structure,
    });
  }

  get f(): any { return this.reactiveForm_edit_structure.controls; }

  // --- logo ---
  onLogoSelected(e: Event) {
    this.logoError = '';
    const input = e.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;

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

    if (this.logoPreviewUrl) {
      // si c’était un blob précédent
      if (this.logoPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(this.logoPreviewUrl);
      }
    }

    this.logoFile = file;
    this.logoPreviewUrl = URL.createObjectURL(file);
  }

  clearLogo(resetError: boolean = true) {
    if (this.logoPreviewUrl && this.logoPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.logoPreviewUrl);
    }
    this.logoPreviewUrl = null;
    this.logoFile = null;
    if (resetError) this.logoError = '';
    // si tu veux aussi vider le champ en BDD :
    // this.reactiveForm_edit_structure.patchValue({ logo_structure: '' });
  }

  // --- submit ---
  onSubmit_edit_structure() {
    this.submitted = true;
    console.log(this.reactiveForm_edit_structure.value);

    if (this.reactiveForm_edit_structure.invalid) {
      return;
    }

    const structure = { ...this.reactiveForm_edit_structure.value };
    structure.updated_by = this.api.user_connected.id_utilisateur;

    if (this.logoFile) {
      this.edit_structure_with_logo(structure);
    } else {
      this.edit_structure(structure);
    }
  }

  onReset_edit_structure() {
    this.submitted = false;
    this.reactiveForm_edit_structure.reset();
    this.clearLogo();
  }

  // --- edit sans nouveau logo (endpoint existant) ---
  edit_structure(structure: any) {
    this.loading_edit_structure = true;
    const payload = {
      condition: { id_structure: this.structure_to_edit.id_structure },
      data: structure
    };

    this.api.taf_post('structure/edit', payload, (reponse: any) => {
      this.loading_edit_structure = false;
      if (reponse.status) {
        this.activeModal.close(reponse);
        console.log('Opération effectuée avec succès sur la table structure. Réponse= ', reponse);
        this.api.Swal_success('Opération éffectuée avec succès');
      } else {
        console.log("L'opération sur la table structure a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a échoué");
      }
    }, () => {
      this.loading_edit_structure = false;
    });
  }

  // --- edit avec nouveau logo (nouvel endpoint: structure/edit_with_file) ---
  edit_structure_with_logo(structure: any) {
    if (!this.logoFile) return;

    this.loading_edit_structure = true;

    const payload: any = {
      id_structure: this.structure_to_edit.id_structure,
      id_statut_structure: structure.id_statut_structure,
      nom_structure: structure.nom_structure,
      adresse_structure: structure.adresse_structure,
      telephone_structure: structure.telephone_structure,
      longitude: structure.longitude,
      latitude: structure.latitude,
      updated_by: structure.updated_by
    };

    const filesMap: Record<string, File[]> = {
      logo: [this.logoFile]
    };

    this.api.taf_post_with_files(
      'structure/edit_with_file',
      payload,
      filesMap,
      (reponse: any) => {
        this.loading_edit_structure = false;
        if (reponse?.status) {
          this.api.Swal_success('Structure mise à jour');
          this.activeModal.close(reponse);
        } else {
          console.log("L'opération sur la table structure a échoué. Réponse= ", reponse);
          this.api.Swal_error(reponse?.message || "L'opération a échoué");
        }
      },
      () => {
        this.loading_edit_structure = false;
      }
    );
  }

  get_details_edit_structure_form() {
    this.loading_get_details_edit_structure_form = true;
    this.api.taf_post('structure/get_form_details', {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data;
        console.log('Opération effectuée avec succès sur la table structure. Réponse= ', reponse);
      } else {
        console.log("L'opération sur la table structure a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a échoué");
      }
      this.loading_get_details_edit_structure_form = false;
    }, () => {
      this.loading_get_details_edit_structure_form = false;
    });
  }
}
