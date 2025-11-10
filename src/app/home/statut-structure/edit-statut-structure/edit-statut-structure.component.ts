import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { StatutStructureTafType } from '../taf-type/statut-structure-taf-type';
@Component({
  selector: 'app-edit-statut-structure',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-statut-structure.component.html',
  styleUrls: ['./edit-statut-structure.component.scss']
})
export class EditStatutStructureComponent implements OnInit, OnDestroy {
  reactiveForm_edit_statut_structure !: FormGroup;
  submitted: boolean = false
  loading_edit_statut_structure: boolean = false
  @Input()
  statut_structure_to_edit: StatutStructureTafType = new StatutStructureTafType();
  form_details: any = {}
  loading_get_details_edit_statut_structure_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditStatutStructureComponent");
      this.get_details_edit_statut_structure_form()
      this.update_form(this.statut_structure_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(statut_structure_to_edit:any) {
      this.reactiveForm_edit_statut_structure = this.formBuilder.group({
          libelle_statut_structure : [statut_structure_to_edit.libelle_statut_structure],
description_statut_structure : [statut_structure_to_edit.description_statut_structure],
updated_at : [statut_structure_to_edit.updated_at],
created_by : [statut_structure_to_edit.created_by],
updated_by : [statut_structure_to_edit.updated_by]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_statut_structure .controls; }
  // validation du formulaire
  onSubmit_edit_statut_structure() {
      this.submitted = true;
      console.log(this.reactiveForm_edit_statut_structure.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_statut_structure.invalid) {
          return;
      }
      var statut_structure = this.reactiveForm_edit_statut_structure.value
      this.edit_statut_structure({
      condition:{id_statut_structure:this.statut_structure_to_edit.id_statut_structure},
      data:statut_structure
      })
  }
  // vider le formulaire
  onReset_edit_statut_structure() {
      this.submitted = false;
      this.reactiveForm_edit_statut_structure.reset();
  }
  edit_statut_structure(statut_structure: any) {
      this.loading_edit_statut_structure = true;
      this.api.taf_post("statut_structure/edit", statut_structure, (reponse: any) => {
          if (reponse.status) {
              this.activeModal.close(reponse)
              console.log("Opération effectuée avec succés sur la table statut_structure. Réponse= ", reponse);
              //this.onReset_edit_statut_structure()
              this.api.Swal_success("Opération éffectuée avec succés")
          } else {
              console.log("L'opération sur la table statut_structure a échoué. Réponse= ", reponse);
              this.api.Swal_error("L'opération a echoué")
          }
          this.loading_edit_statut_structure = false;
      }, (error: any) => {
          this.loading_edit_statut_structure = false;
      })
  }
  get_details_edit_statut_structure_form() {
      this.loading_get_details_edit_statut_structure_form = true;
      this.api.taf_post("statut_structure/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table statut_structure. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table statut_structure a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_edit_statut_structure_form = false;
      }, (error: any) => {
      this.loading_get_details_edit_statut_structure_form = false;
    })
  }
}