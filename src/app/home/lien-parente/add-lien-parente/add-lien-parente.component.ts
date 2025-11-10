import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { LienParenteTafType } from '../taf-type/lien-parente-taf-type';
@Component({
  selector: 'app-add-lien-parente',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './add-lien-parente.component.html',
  styleUrls: ['./add-lien-parente.component.scss']
})
export class AddLienParenteComponent implements OnInit, OnDestroy {
  reactiveForm_add_lien_parente !: FormGroup;
  submitted:boolean=false
  loading_add_lien_parente :boolean=false
  form_details: any = {}
  loading_get_details_add_lien_parente_form = false
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      console.groupCollapsed("AddLienParenteComponent");
      this.get_details_add_lien_parente_form()
      this.init_form()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  init_form() {
      this.reactiveForm_add_lien_parente  = this.formBuilder.group({
          libelle_lien_parente: [""],
description: [""],
updated_at: [""],
created_by: [""],
updated_by: [""]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_lien_parente .controls; }
  // validation du formulaire
  onSubmit_add_lien_parente () {
      this.submitted = true;
      console.log(this.reactiveForm_add_lien_parente .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_lien_parente .invalid) {
          return;
      }
      var lien_parente =this.reactiveForm_add_lien_parente .value
      this.add_lien_parente (lien_parente )
  }
  // vider le formulaire
  onReset_add_lien_parente () {
      this.submitted = false;
      this.reactiveForm_add_lien_parente .reset();
  }
  add_lien_parente(lien_parente: any) {
      this.loading_add_lien_parente = true;
      this.api.taf_post("lien_parente/add", lien_parente, (reponse: any) => {
      this.loading_add_lien_parente = false;
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table lien_parente. Réponse= ", reponse);
          this.onReset_add_lien_parente()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table lien_parente a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_lien_parente = false;
    })
  }
  
  get_details_add_lien_parente_form() {
      this.loading_get_details_add_lien_parente_form = true;
      this.api.taf_post("lien_parente/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table lien_parente. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table lien_parente a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_lien_parente_form = false;
      }, (error: any) => {
      this.loading_get_details_add_lien_parente_form = false;
    })
  }
}
