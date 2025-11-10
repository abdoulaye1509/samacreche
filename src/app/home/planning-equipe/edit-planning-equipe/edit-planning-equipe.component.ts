import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { PlanningEquipeTafType } from '../taf-type/planning-equipe-taf-type';
@Component({
  selector: 'app-edit-planning-equipe',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-planning-equipe.component.html',
  styleUrls: ['./edit-planning-equipe.component.scss']
})
export class EditPlanningEquipeComponent implements OnInit, OnDestroy {
  reactiveForm_edit_planning_equipe !: FormGroup;
  submitted: boolean = false
  loading_edit_planning_equipe: boolean = false
  @Input()
  planning_equipe_to_edit: PlanningEquipeTafType = new PlanningEquipeTafType();
  form_details: any = {}
  loading_get_details_edit_planning_equipe_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditPlanningEquipeComponent");
      this.get_details_edit_planning_equipe_form()
      this.update_form(this.planning_equipe_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(planning_equipe_to_edit:any) {
      this.reactiveForm_edit_planning_equipe = this.formBuilder.group({
          id_utilisateur : [planning_equipe_to_edit.id_utilisateur],
titre_planning_equipe : [planning_equipe_to_edit.titre_planning_equipe],
description_planning_equipe : [planning_equipe_to_edit.description_planning_equipe],
date_debut : [planning_equipe_to_edit.date_debut],
date_fin : [planning_equipe_to_edit.date_fin],
heure_debut : [planning_equipe_to_edit.heure_debut],
heure_fin : [planning_equipe_to_edit.heure_fin],
couleur : [planning_equipe_to_edit.couleur],
updated_at : [planning_equipe_to_edit.updated_at],
created_by : [planning_equipe_to_edit.created_by],
updated_by : [planning_equipe_to_edit.updated_by]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_planning_equipe .controls; }
  // validation du formulaire
  onSubmit_edit_planning_equipe() {
      this.submitted = true;
      console.log(this.reactiveForm_edit_planning_equipe.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_planning_equipe.invalid) {
          return;
      }
      var planning_equipe = this.reactiveForm_edit_planning_equipe.value
      this.edit_planning_equipe({
      condition:{id_planning_equipe:this.planning_equipe_to_edit.id_planning_equipe},
      data:planning_equipe
      })
  }
  // vider le formulaire
  onReset_edit_planning_equipe() {
      this.submitted = false;
      this.reactiveForm_edit_planning_equipe.reset();
  }
  edit_planning_equipe(planning_equipe: any) {
      this.loading_edit_planning_equipe = true;
      this.api.taf_post("planning_equipe/edit", planning_equipe, (reponse: any) => {
          if (reponse.status) {
              this.activeModal.close(reponse)
              console.log("Opération effectuée avec succés sur la table planning_equipe. Réponse= ", reponse);
              //this.onReset_edit_planning_equipe()
              this.api.Swal_success("Opération éffectuée avec succés")
          } else {
              console.log("L'opération sur la table planning_equipe a échoué. Réponse= ", reponse);
              this.api.Swal_error("L'opération a echoué")
          }
          this.loading_edit_planning_equipe = false;
      }, (error: any) => {
          this.loading_edit_planning_equipe = false;
      })
  }
  get_details_edit_planning_equipe_form() {
      this.loading_get_details_edit_planning_equipe_form = true;
      this.api.taf_post("planning_equipe/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table planning_equipe. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table planning_equipe a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_edit_planning_equipe_form = false;
      }, (error: any) => {
      this.loading_get_details_edit_planning_equipe_form = false;
    })
  }
}