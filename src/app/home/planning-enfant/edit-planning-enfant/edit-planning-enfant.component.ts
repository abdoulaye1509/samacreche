import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { PlanningEnfantTafType } from '../taf-type/planning-enfant-taf-type';
@Component({
  selector: 'app-edit-planning-enfant',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-planning-enfant.component.html',
  styleUrls: ['./edit-planning-enfant.component.scss']
})
export class EditPlanningEnfantComponent implements OnInit, OnDestroy {
  reactiveForm_edit_planning_enfant !: FormGroup;
  submitted: boolean = false
  loading_edit_planning_enfant: boolean = false
  @Input()
  planning_enfant_to_edit: PlanningEnfantTafType = new PlanningEnfantTafType();
  form_details: any = {}
  loading_get_details_edit_planning_enfant_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditPlanningEnfantComponent");
      this.get_details_edit_planning_enfant_form()
      this.update_form(this.planning_enfant_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(planning_enfant_to_edit:any) {
      this.reactiveForm_edit_planning_enfant = this.formBuilder.group({
          id_enfant : [planning_enfant_to_edit.id_enfant],
titre_planning_enfant : [planning_enfant_to_edit.titre_planning_enfant],
description_planning_enfant : [planning_enfant_to_edit.description_planning_enfant],
date_debut : [planning_enfant_to_edit.date_debut],
date_fin : [planning_enfant_to_edit.date_fin],
heure_debut : [planning_enfant_to_edit.heure_debut],
heure_fin : [planning_enfant_to_edit.heure_fin],
couleur : [planning_enfant_to_edit.couleur],
updated_at : [planning_enfant_to_edit.updated_at],
created_by : [planning_enfant_to_edit.created_by],
updated_by : [planning_enfant_to_edit.updated_by]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_planning_enfant .controls; }
  // validation du formulaire
  onSubmit_edit_planning_enfant() {
      this.submitted = true;
      console.log(this.reactiveForm_edit_planning_enfant.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_planning_enfant.invalid) {
          return;
      }
      var planning_enfant = this.reactiveForm_edit_planning_enfant.value
      this.edit_planning_enfant({
      condition:{id_planning_enfant:this.planning_enfant_to_edit.id_planning_enfant},
      data:planning_enfant
      })
  }
  // vider le formulaire
  onReset_edit_planning_enfant() {
      this.submitted = false;
      this.reactiveForm_edit_planning_enfant.reset();
  }
  edit_planning_enfant(planning_enfant: any) {
      this.loading_edit_planning_enfant = true;
      this.api.taf_post("planning_enfant/edit", planning_enfant, (reponse: any) => {
          if (reponse.status) {
              this.activeModal.close(reponse)
              console.log("Opération effectuée avec succés sur la table planning_enfant. Réponse= ", reponse);
              //this.onReset_edit_planning_enfant()
              this.api.Swal_success("Opération éffectuée avec succés")
          } else {
              console.log("L'opération sur la table planning_enfant a échoué. Réponse= ", reponse);
              this.api.Swal_error("L'opération a echoué")
          }
          this.loading_edit_planning_enfant = false;
      }, (error: any) => {
          this.loading_edit_planning_enfant = false;
      })
  }
  get_details_edit_planning_enfant_form() {
      this.loading_get_details_edit_planning_enfant_form = true;
      this.api.taf_post("planning_enfant/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table planning_enfant. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table planning_enfant a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_edit_planning_enfant_form = false;
      }, (error: any) => {
      this.loading_get_details_edit_planning_enfant_form = false;
    })
  }
}