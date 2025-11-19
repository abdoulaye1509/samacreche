import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApiService } from '../../../service/api/api.service';

@Component({
  selector: 'app-add-parent',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './add-parent.component.html',
  styleUrls: ['./add-parent.component.scss']
})
export class AddParentComponent implements OnInit, OnDestroy {
  reactiveForm_add_parent!: FormGroup;
  submitted = false;
  loading_add_parent = false;
  loading_get_details_add_parent_form = false;
  form_details: any = {};

  constructor(
    private fb: FormBuilder,
    public api: ApiService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    console.groupCollapsed('AddParentComponent');
    this.get_details_add_parent_form();
    this.init_form();
  }
  ngOnDestroy(): void { console.groupEnd(); }

  init_form() {
    this.reactiveForm_add_parent = this.fb.group({
      prenom_parent: ['', Validators.required],
      nom_parent: ['', Validators.required],
      id_lien_parente: [null],                // optionnel ici

      telephone_parent: ['', Validators.required],
      email_parent: ['', [Validators.required, Validators.email]],
      adresse_parent: [''],

      mot_de_passe: [''],
      cni: ['']
    });
  }

  get f() { return this.reactiveForm_add_parent.controls; }

  onSubmit_add_parent() {
    this.submitted = true;
    if (this.reactiveForm_add_parent.invalid) return;

    const parent = {
      ...this.reactiveForm_add_parent.value,
      created_by: this.api.user_connected?.id_utilisateur
    };

    this.loading_add_parent = true;
    this.api.taf_post('parent/add', parent, (reponse: any) => {
      this.loading_add_parent = false;
      if (reponse.status) {
        this.reactiveForm_add_parent.reset();
        this.submitted = false;
        this.api.Swal_success('Opération éffectuée avec succès');
        this.activeModal.close(reponse);
      } else {
        this.api.Swal_error("L'opération a échoué");
      }
    }, () => this.loading_add_parent = false);
  }

  get_details_add_parent_form() {
    this.loading_get_details_add_parent_form = true;
    this.api.taf_post('parent/get_form_details', {}, (reponse: any) => {
      this.loading_get_details_add_parent_form = false;
      if (reponse.status) this.form_details = reponse.data;
      else this.api.Swal_error("L'opération a échoué");
    }, () => this.loading_get_details_add_parent_form = false);
  }
}
