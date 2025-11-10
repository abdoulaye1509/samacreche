import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { PlanningEquipeTafType } from '../taf-type/planning-equipe-taf-type';
@Component({
  selector: 'app-add-planning-equipe',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './add-planning-equipe.component.html',
  styleUrls: ['./add-planning-equipe.component.scss']
})
export class AddPlanningEquipeComponent implements OnInit, OnDestroy {
  reactiveForm_add_planning_equipe !: FormGroup;
  submitted:boolean=false
  loading_add_planning_equipe :boolean=false
  form_details: any = {}
  loading_get_details_add_planning_equipe_form = false
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      console.groupCollapsed("AddPlanningEquipeComponent");
      this.get_details_add_planning_equipe_form()
      this.init_form()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  init_form() {
      this.reactiveForm_add_planning_equipe  = this.formBuilder.group({
          id_utilisateur: [""],
titre_planning_equipe: [""],
description_planning_equipe: [""],
date_debut: [""],
date_fin: [""],
heure_debut: [""],
heure_fin: [""],
couleur: [""],
updated_at: [""],
created_by: [""],
updated_by: [""]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_planning_equipe .controls; }
  // validation du formulaire
  onSubmit_add_planning_equipe () {
      this.submitted = true;
      console.log(this.reactiveForm_add_planning_equipe .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_planning_equipe .invalid) {
          return;
      }
      var planning_equipe =this.reactiveForm_add_planning_equipe .value
      this.add_planning_equipe (planning_equipe )
  }
  // vider le formulaire
  onReset_add_planning_equipe () {
      this.submitted = false;
      this.reactiveForm_add_planning_equipe .reset();
  }
  add_planning_equipe(planning_equipe: any) {
      this.loading_add_planning_equipe = true;
      this.api.taf_post("planning_equipe/add", planning_equipe, (reponse: any) => {
      this.loading_add_planning_equipe = false;
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table planning_equipe. Réponse= ", reponse);
          this.onReset_add_planning_equipe()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table planning_equipe a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_planning_equipe = false;
    })
  }
  
  get_details_add_planning_equipe_form() {
      this.loading_get_details_add_planning_equipe_form = true;
      this.api.taf_post("planning_equipe/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table planning_equipe. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table planning_equipe a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_planning_equipe_form = false;
      }, (error: any) => {
      this.loading_get_details_add_planning_equipe_form = false;
    })
  }
}
