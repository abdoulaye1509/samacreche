import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FacturationTafType } from '../taf-type/facturation-taf-type';
@Component({
  selector: 'app-add-facturation',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './add-facturation.component.html',
  styleUrls: ['./add-facturation.component.scss']
})
export class AddFacturationComponent implements OnInit, OnDestroy {
  reactiveForm_add_facturation !: FormGroup;
  submitted:boolean=false
  loading_add_facturation :boolean=false
  form_details: any = {}
  loading_get_details_add_facturation_form = false
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      console.groupCollapsed("AddFacturationComponent");
      this.get_details_add_facturation_form()
      this.init_form()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  init_form() {
      this.reactiveForm_add_facturation  = this.formBuilder.group({
          id_enfant: [""],
designation: [""],
libelle_facturation: [""],
prix_designation: [""],
date_facturation: [""],
cantine: [""],
updated_at: [""],
created_by: [""],
updated_by: [""]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_facturation .controls; }
  // validation du formulaire
  onSubmit_add_facturation () {
      this.submitted = true;
      console.log(this.reactiveForm_add_facturation .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_facturation .invalid) {
          return;
      }
      var facturation =this.reactiveForm_add_facturation .value
      this.add_facturation (facturation )
  }
  // vider le formulaire
  onReset_add_facturation () {
      this.submitted = false;
      this.reactiveForm_add_facturation .reset();
  }
  add_facturation(facturation: any) {
      this.loading_add_facturation = true;
      this.api.taf_post("facturation/add", facturation, (reponse: any) => {
      this.loading_add_facturation = false;
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table facturation. Réponse= ", reponse);
          this.onReset_add_facturation()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table facturation a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_facturation = false;
    })
  }
  
  get_details_add_facturation_form() {
      this.loading_get_details_add_facturation_form = true;
      this.api.taf_post("facturation/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table facturation. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table facturation a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_facturation_form = false;
      }, (error: any) => {
      this.loading_get_details_add_facturation_form = false;
    })
  }
}
