import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { EnfantTafType } from '../taf-type/enfant-taf-type';
@Component({
  selector: 'app-edit-enfant',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-enfant.component.html',
  styleUrls: ['./edit-enfant.component.scss']
})
export class EditEnfantComponent implements OnInit, OnDestroy {
  reactiveForm_edit_enfant !: FormGroup;
  submitted: boolean = false
  loading_edit_enfant: boolean = false
  @Input()
  enfant_to_edit: EnfantTafType = new EnfantTafType();
  form_details: any = {}
  loading_get_details_edit_enfant_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditEnfantComponent");
      this.get_details_edit_enfant_form()
      this.update_form(this.enfant_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(enfant_to_edit:any) {
      this.reactiveForm_edit_enfant = this.formBuilder.group({
          id_pays : [enfant_to_edit.id_pays],
id_genre : [enfant_to_edit.id_genre],
prenom_enfant : [enfant_to_edit.prenom_enfant],
nom_enfant : [enfant_to_edit.nom_enfant],
date_naissance : [enfant_to_edit.date_naissance],
lieu_naissance : [enfant_to_edit.lieu_naissance],
adresse_enfant : [enfant_to_edit.adresse_enfant],
updated_at : [enfant_to_edit.updated_at],
created_by : [enfant_to_edit.created_by],
updated_by : [enfant_to_edit.updated_by]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_enfant .controls; }
  // validation du formulaire
  onSubmit_edit_enfant() {
      this.submitted = true;
      console.log(this.reactiveForm_edit_enfant.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_enfant.invalid) {
          return;
      }
      var enfant = this.reactiveForm_edit_enfant.value
      this.edit_enfant({
      condition:{id_enfant:this.enfant_to_edit.id_enfant},
      data:enfant
      })
  }
  // vider le formulaire
  onReset_edit_enfant() {
      this.submitted = false;
      this.reactiveForm_edit_enfant.reset();
  }
  edit_enfant(enfant: any) {
      this.loading_edit_enfant = true;
      this.api.taf_post("enfant/edit", enfant, (reponse: any) => {
          if (reponse.status) {
              this.activeModal.close(reponse)
              console.log("Opération effectuée avec succés sur la table enfant. Réponse= ", reponse);
              //this.onReset_edit_enfant()
              this.api.Swal_success("Opération éffectuée avec succés")
          } else {
              console.log("L'opération sur la table enfant a échoué. Réponse= ", reponse);
              this.api.Swal_error("L'opération a echoué")
          }
          this.loading_edit_enfant = false;
      }, (error: any) => {
          this.loading_edit_enfant = false;
      })
  }
  get_details_edit_enfant_form() {
      this.loading_get_details_edit_enfant_form = true;
      this.api.taf_post("enfant/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table enfant. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table enfant a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_edit_enfant_form = false;
      }, (error: any) => {
      this.loading_get_details_edit_enfant_form = false;
    })
  }
}