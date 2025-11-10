import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ParentEnfantTafType } from '../taf-type/parent-enfant-taf-type';
@Component({
  selector: 'app-edit-parent-enfant',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-parent-enfant.component.html',
  styleUrls: ['./edit-parent-enfant.component.scss']
})
export class EditParentEnfantComponent implements OnInit, OnDestroy {
  reactiveForm_edit_parent_enfant !: FormGroup;
  submitted: boolean = false
  loading_edit_parent_enfant: boolean = false
  @Input()
  parent_enfant_to_edit: ParentEnfantTafType = new ParentEnfantTafType();
  form_details: any = {}
  loading_get_details_edit_parent_enfant_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditParentEnfantComponent");
      this.get_details_edit_parent_enfant_form()
      this.update_form(this.parent_enfant_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(parent_enfant_to_edit:any) {
      this.reactiveForm_edit_parent_enfant = this.formBuilder.group({
          id_enfant : [parent_enfant_to_edit.id_enfant],
id_parent : [parent_enfant_to_edit.id_parent],
updated_at : [parent_enfant_to_edit.updated_at],
created_by : [parent_enfant_to_edit.created_by],
updated_by : [parent_enfant_to_edit.updated_by]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_parent_enfant .controls; }
  // validation du formulaire
  onSubmit_edit_parent_enfant() {
      this.submitted = true;
      console.log(this.reactiveForm_edit_parent_enfant.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_parent_enfant.invalid) {
          return;
      }
      var parent_enfant = this.reactiveForm_edit_parent_enfant.value
      this.edit_parent_enfant({
      condition:{id_parent_enfant:this.parent_enfant_to_edit.id_parent_enfant},
      data:parent_enfant
      })
  }
  // vider le formulaire
  onReset_edit_parent_enfant() {
      this.submitted = false;
      this.reactiveForm_edit_parent_enfant.reset();
  }
  edit_parent_enfant(parent_enfant: any) {
      this.loading_edit_parent_enfant = true;
      this.api.taf_post("parent_enfant/edit", parent_enfant, (reponse: any) => {
          if (reponse.status) {
              this.activeModal.close(reponse)
              console.log("Opération effectuée avec succés sur la table parent_enfant. Réponse= ", reponse);
              //this.onReset_edit_parent_enfant()
              this.api.Swal_success("Opération éffectuée avec succés")
          } else {
              console.log("L'opération sur la table parent_enfant a échoué. Réponse= ", reponse);
              this.api.Swal_error("L'opération a echoué")
          }
          this.loading_edit_parent_enfant = false;
      }, (error: any) => {
          this.loading_edit_parent_enfant = false;
      })
  }
  get_details_edit_parent_enfant_form() {
      this.loading_get_details_edit_parent_enfant_form = true;
      this.api.taf_post("parent_enfant/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table parent_enfant. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table parent_enfant a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_edit_parent_enfant_form = false;
      }, (error: any) => {
      this.loading_get_details_edit_parent_enfant_form = false;
    })
  }
}