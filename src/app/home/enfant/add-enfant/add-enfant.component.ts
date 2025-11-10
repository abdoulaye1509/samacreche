import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
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
  submitted:boolean=false
  loading_add_enfant :boolean=false
  form_details: any = {}
  loading_get_details_add_enfant_form = false
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      console.groupCollapsed("AddEnfantComponent");
      this.get_details_add_enfant_form()
      this.init_form()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  init_form() {
      this.reactiveForm_add_enfant  = this.formBuilder.group({
          id_pays: [""],
id_genre: [""],
prenom_enfant: [""],
nom_enfant: [""],
date_naissance: [""],
lieu_naissance: [""],
adresse_enfant: [""],
updated_at: [""],
created_by: [""],
updated_by: [""]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_enfant .controls; }
  // validation du formulaire
  onSubmit_add_enfant () {
      this.submitted = true;
      console.log(this.reactiveForm_add_enfant .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_enfant .invalid) {
          return;
      }
      var enfant =this.reactiveForm_add_enfant .value
      this.add_enfant (enfant )
  }
  // vider le formulaire
  onReset_add_enfant () {
      this.submitted = false;
      this.reactiveForm_add_enfant .reset();
  }
  add_enfant(enfant: any) {
      this.loading_add_enfant = true;
      this.api.taf_post("enfant/add", enfant, (reponse: any) => {
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
      this.loading_get_details_add_enfant_form = true;
      this.api.taf_post("enfant/get_form_details", {}, (reponse: any) => {
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
}
