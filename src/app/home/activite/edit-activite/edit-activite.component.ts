import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ActiviteTafType } from '../taf-type/activite-taf-type';
@Component({
  selector: 'app-edit-activite',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-activite.component.html',
  styleUrls: ['./edit-activite.component.scss']
})
export class EditActiviteComponent implements OnInit, OnDestroy {
  reactiveForm_edit_activite !: FormGroup;
  submitted: boolean = false
  loading_edit_activite: boolean = false
  @Input()
  activite_to_edit: ActiviteTafType = new ActiviteTafType();
  form_details: any = {}
  loading_get_details_edit_activite_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditActiviteComponent");
      this.get_details_edit_activite_form()
      this.update_form(this.activite_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(activite_to_edit:any) {
      this.reactiveForm_edit_activite = this.formBuilder.group({
          id_enfant : [activite_to_edit.id_enfant],
contenu : [activite_to_edit.contenu],
description : [activite_to_edit.description],
date_activite : [activite_to_edit.date_activite],
heure_activite : [activite_to_edit.heure_activite],
updated_at : [activite_to_edit.updated_at],
created_by : [activite_to_edit.created_by],
updated_by : [activite_to_edit.updated_by]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_activite .controls; }
  // validation du formulaire
  onSubmit_edit_activite() {
      this.submitted = true;
      console.log(this.reactiveForm_edit_activite.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_activite.invalid) {
          return;
      }
      var activite = this.reactiveForm_edit_activite.value
      this.edit_activite({
      condition:{id_activite:this.activite_to_edit.id_activite},
      data:activite
      })
  }
  // vider le formulaire
  onReset_edit_activite() {
      this.submitted = false;
      this.reactiveForm_edit_activite.reset();
  }
  edit_activite(activite: any) {
      this.loading_edit_activite = true;
      this.api.taf_post("activite/edit", activite, (reponse: any) => {
          if (reponse.status) {
              this.activeModal.close(reponse)
              console.log("Opération effectuée avec succés sur la table activite. Réponse= ", reponse);
              //this.onReset_edit_activite()
              this.api.Swal_success("Opération éffectuée avec succés")
          } else {
              console.log("L'opération sur la table activite a échoué. Réponse= ", reponse);
              this.api.Swal_error("L'opération a echoué")
          }
          this.loading_edit_activite = false;
      }, (error: any) => {
          this.loading_edit_activite = false;
      })
  }
  get_details_edit_activite_form() {
      this.loading_get_details_edit_activite_form = true;
      this.api.taf_post("activite/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table activite. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table activite a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_edit_activite_form = false;
      }, (error: any) => {
      this.loading_get_details_edit_activite_form = false;
    })
  }
}