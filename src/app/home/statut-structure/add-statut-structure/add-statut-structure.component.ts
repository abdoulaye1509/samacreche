import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { StatutStructureTafType } from '../taf-type/statut-structure-taf-type';
@Component({
  selector: 'app-add-statut-structure',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './add-statut-structure.component.html',
  styleUrls: ['./add-statut-structure.component.scss']
})
export class AddStatutStructureComponent implements OnInit, OnDestroy {
  reactiveForm_add_statut_structure !: FormGroup;
  submitted:boolean=false
  loading_add_statut_structure :boolean=false
  form_details: any = {}
  loading_get_details_add_statut_structure_form = false
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      console.groupCollapsed("AddStatutStructureComponent");
      this.get_details_add_statut_structure_form()
      this.init_form()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  init_form() {
      this.reactiveForm_add_statut_structure  = this.formBuilder.group({
          libelle_statut_structure: [""],
description_statut_structure: [""],
updated_at: [""],
created_by: [""],
updated_by: [""]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_statut_structure .controls; }
  // validation du formulaire
  onSubmit_add_statut_structure () {
      this.submitted = true;
      console.log(this.reactiveForm_add_statut_structure .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_statut_structure .invalid) {
          return;
      }
      var statut_structure =this.reactiveForm_add_statut_structure .value
      this.add_statut_structure (statut_structure )
  }
  // vider le formulaire
  onReset_add_statut_structure () {
      this.submitted = false;
      this.reactiveForm_add_statut_structure .reset();
  }
  add_statut_structure(statut_structure: any) {
      this.loading_add_statut_structure = true;
      this.api.taf_post("statut_structure/add", statut_structure, (reponse: any) => {
      this.loading_add_statut_structure = false;
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table statut_structure. Réponse= ", reponse);
          this.onReset_add_statut_structure()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table statut_structure a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_statut_structure = false;
    })
  }
  
  get_details_add_statut_structure_form() {
      this.loading_get_details_add_statut_structure_form = true;
      this.api.taf_post("statut_structure/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table statut_structure. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table statut_structure a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_statut_structure_form = false;
      }, (error: any) => {
      this.loading_get_details_add_statut_structure_form = false;
    })
  }
}
