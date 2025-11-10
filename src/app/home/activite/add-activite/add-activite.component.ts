import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ActiviteTafType } from '../taf-type/activite-taf-type';
@Component({
  selector: 'app-add-activite',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './add-activite.component.html',
  styleUrls: ['./add-activite.component.scss']
})
export class AddActiviteComponent implements OnInit, OnDestroy {
  reactiveForm_add_activite !: FormGroup;
  submitted:boolean=false
  loading_add_activite :boolean=false
  form_details: any = {}
  loading_get_details_add_activite_form = false
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      console.groupCollapsed("AddActiviteComponent");
      this.get_details_add_activite_form()
      this.init_form()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  init_form() {
      this.reactiveForm_add_activite  = this.formBuilder.group({
          id_enfant: [""],
contenu: [""],
description: [""],
date_activite: [""],
heure_activite: [""],
updated_at: [""],
created_by: [""],
updated_by: [""]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_activite .controls; }
  // validation du formulaire
  onSubmit_add_activite () {
      this.submitted = true;
      console.log(this.reactiveForm_add_activite .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_activite .invalid) {
          return;
      }
      var activite =this.reactiveForm_add_activite .value
      this.add_activite (activite )
  }
  // vider le formulaire
  onReset_add_activite () {
      this.submitted = false;
      this.reactiveForm_add_activite .reset();
  }
  add_activite(activite: any) {
      this.loading_add_activite = true;
      this.api.taf_post("activite/add", activite, (reponse: any) => {
      this.loading_add_activite = false;
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table activite. Réponse= ", reponse);
          this.onReset_add_activite()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table activite a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_activite = false;
    })
  }
  
  get_details_add_activite_form() {
      this.loading_get_details_add_activite_form = true;
      this.api.taf_post("activite/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table activite. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table activite a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_activite_form = false;
      }, (error: any) => {
      this.loading_get_details_add_activite_form = false;
    })
  }
}
