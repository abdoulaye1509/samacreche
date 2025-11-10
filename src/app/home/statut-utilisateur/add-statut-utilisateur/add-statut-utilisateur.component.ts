import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { StatutUtilisateurTafType } from '../taf-type/statut-utilisateur-taf-type';
@Component({
  selector: 'app-add-statut-utilisateur',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './add-statut-utilisateur.component.html',
  styleUrls: ['./add-statut-utilisateur.component.scss']
})
export class AddStatutUtilisateurComponent implements OnInit, OnDestroy {
  reactiveForm_add_statut_utilisateur !: FormGroup;
  submitted:boolean=false
  loading_add_statut_utilisateur :boolean=false
  form_details: any = {}
  loading_get_details_add_statut_utilisateur_form = false
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      console.groupCollapsed("AddStatutUtilisateurComponent");
      this.get_details_add_statut_utilisateur_form()
      this.init_form()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  init_form() {
      this.reactiveForm_add_statut_utilisateur  = this.formBuilder.group({
          libelle_statut_utilisateur: [""],
description_statut_utilisateur: [""],
updated_at: [""],
created_by: [""],
updated_by: [""]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_statut_utilisateur .controls; }
  // validation du formulaire
  onSubmit_add_statut_utilisateur () {
      this.submitted = true;
      console.log(this.reactiveForm_add_statut_utilisateur .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_statut_utilisateur .invalid) {
          return;
      }
      var statut_utilisateur =this.reactiveForm_add_statut_utilisateur .value
      this.add_statut_utilisateur (statut_utilisateur )
  }
  // vider le formulaire
  onReset_add_statut_utilisateur () {
      this.submitted = false;
      this.reactiveForm_add_statut_utilisateur .reset();
  }
  add_statut_utilisateur(statut_utilisateur: any) {
      this.loading_add_statut_utilisateur = true;
      this.api.taf_post("statut_utilisateur/add", statut_utilisateur, (reponse: any) => {
      this.loading_add_statut_utilisateur = false;
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table statut_utilisateur. Réponse= ", reponse);
          this.onReset_add_statut_utilisateur()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table statut_utilisateur a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_statut_utilisateur = false;
    })
  }
  
  get_details_add_statut_utilisateur_form() {
      this.loading_get_details_add_statut_utilisateur_form = true;
      this.api.taf_post("statut_utilisateur/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table statut_utilisateur. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table statut_utilisateur a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_statut_utilisateur_form = false;
      }, (error: any) => {
      this.loading_get_details_add_statut_utilisateur_form = false;
    })
  }
}
