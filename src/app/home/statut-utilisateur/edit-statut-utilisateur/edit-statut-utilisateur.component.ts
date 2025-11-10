import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { StatutUtilisateurTafType } from '../taf-type/statut-utilisateur-taf-type';
@Component({
  selector: 'app-edit-statut-utilisateur',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-statut-utilisateur.component.html',
  styleUrls: ['./edit-statut-utilisateur.component.scss']
})
export class EditStatutUtilisateurComponent implements OnInit, OnDestroy {
  reactiveForm_edit_statut_utilisateur !: FormGroup;
  submitted: boolean = false
  loading_edit_statut_utilisateur: boolean = false
  @Input()
  statut_utilisateur_to_edit: StatutUtilisateurTafType = new StatutUtilisateurTafType();
  form_details: any = {}
  loading_get_details_edit_statut_utilisateur_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditStatutUtilisateurComponent");
      this.get_details_edit_statut_utilisateur_form()
      this.update_form(this.statut_utilisateur_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(statut_utilisateur_to_edit:any) {
      this.reactiveForm_edit_statut_utilisateur = this.formBuilder.group({
          libelle_statut_utilisateur : [statut_utilisateur_to_edit.libelle_statut_utilisateur],
description_statut_utilisateur : [statut_utilisateur_to_edit.description_statut_utilisateur],
updated_at : [statut_utilisateur_to_edit.updated_at],
created_by : [statut_utilisateur_to_edit.created_by],
updated_by : [statut_utilisateur_to_edit.updated_by]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_statut_utilisateur .controls; }
  // validation du formulaire
  onSubmit_edit_statut_utilisateur() {
      this.submitted = true;
      console.log(this.reactiveForm_edit_statut_utilisateur.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_statut_utilisateur.invalid) {
          return;
      }
      var statut_utilisateur = this.reactiveForm_edit_statut_utilisateur.value
      this.edit_statut_utilisateur({
      condition:{id_statut_utilisateur:this.statut_utilisateur_to_edit.id_statut_utilisateur},
      data:statut_utilisateur
      })
  }
  // vider le formulaire
  onReset_edit_statut_utilisateur() {
      this.submitted = false;
      this.reactiveForm_edit_statut_utilisateur.reset();
  }
  edit_statut_utilisateur(statut_utilisateur: any) {
      this.loading_edit_statut_utilisateur = true;
      this.api.taf_post("statut_utilisateur/edit", statut_utilisateur, (reponse: any) => {
          if (reponse.status) {
              this.activeModal.close(reponse)
              console.log("Opération effectuée avec succés sur la table statut_utilisateur. Réponse= ", reponse);
              //this.onReset_edit_statut_utilisateur()
              this.api.Swal_success("Opération éffectuée avec succés")
          } else {
              console.log("L'opération sur la table statut_utilisateur a échoué. Réponse= ", reponse);
              this.api.Swal_error("L'opération a echoué")
          }
          this.loading_edit_statut_utilisateur = false;
      }, (error: any) => {
          this.loading_edit_statut_utilisateur = false;
      })
  }
  get_details_edit_statut_utilisateur_form() {
      this.loading_get_details_edit_statut_utilisateur_form = true;
      this.api.taf_post("statut_utilisateur/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table statut_utilisateur. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table statut_utilisateur a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_edit_statut_utilisateur_form = false;
      }, (error: any) => {
      this.loading_get_details_edit_statut_utilisateur_form = false;
    })
  }
}