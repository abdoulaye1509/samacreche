import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FacturationTafType } from '../taf-type/facturation-taf-type';
@Component({
  selector: 'app-edit-facturation',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-facturation.component.html',
  styleUrls: ['./edit-facturation.component.scss']
})
export class EditFacturationComponent implements OnInit, OnDestroy {
  reactiveForm_edit_facturation !: FormGroup;
  submitted: boolean = false
  loading_edit_facturation: boolean = false
  @Input()
  facturation_to_edit: FacturationTafType = new FacturationTafType();
  form_details: any = {}
  loading_get_details_edit_facturation_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditFacturationComponent");
      this.get_details_edit_facturation_form()
      this.update_form(this.facturation_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(facturation_to_edit:any) {
      this.reactiveForm_edit_facturation = this.formBuilder.group({
          id_enfant : [facturation_to_edit.id_enfant],
designation : [facturation_to_edit.designation],
libelle_facturation : [facturation_to_edit.libelle_facturation],
prix_designation : [facturation_to_edit.prix_designation],
date_facturation : [facturation_to_edit.date_facturation],
cantine : [facturation_to_edit.cantine],
updated_at : [facturation_to_edit.updated_at],
created_by : [facturation_to_edit.created_by],
updated_by : [facturation_to_edit.updated_by]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_facturation .controls; }
  // validation du formulaire
  onSubmit_edit_facturation() {
      this.submitted = true;
      console.log(this.reactiveForm_edit_facturation.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_facturation.invalid) {
          return;
      }
      var facturation = this.reactiveForm_edit_facturation.value
      this.edit_facturation({
      condition:{id_facturation:this.facturation_to_edit.id_facturation},
      data:facturation
      })
  }
  // vider le formulaire
  onReset_edit_facturation() {
      this.submitted = false;
      this.reactiveForm_edit_facturation.reset();
  }
  edit_facturation(facturation: any) {
      this.loading_edit_facturation = true;
      this.api.taf_post("facturation/edit", facturation, (reponse: any) => {
          if (reponse.status) {
              this.activeModal.close(reponse)
              console.log("Opération effectuée avec succés sur la table facturation. Réponse= ", reponse);
              //this.onReset_edit_facturation()
              this.api.Swal_success("Opération éffectuée avec succés")
          } else {
              console.log("L'opération sur la table facturation a échoué. Réponse= ", reponse);
              this.api.Swal_error("L'opération a echoué")
          }
          this.loading_edit_facturation = false;
      }, (error: any) => {
          this.loading_edit_facturation = false;
      })
  }
  get_details_edit_facturation_form() {
      this.loading_get_details_edit_facturation_form = true;
      this.api.taf_post("facturation/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table facturation. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table facturation a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_edit_facturation_form = false;
      }, (error: any) => {
      this.loading_get_details_edit_facturation_form = false;
    })
  }
}