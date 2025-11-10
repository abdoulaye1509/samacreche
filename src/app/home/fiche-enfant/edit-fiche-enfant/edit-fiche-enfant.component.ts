import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FicheEnfantTafType } from '../taf-type/fiche-enfant-taf-type';
@Component({
  selector: 'app-edit-fiche-enfant',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-fiche-enfant.component.html',
  styleUrls: ['./edit-fiche-enfant.component.scss']
})
export class EditFicheEnfantComponent implements OnInit, OnDestroy {
  reactiveForm_edit_fiche_enfant !: FormGroup;
  submitted: boolean = false
  loading_edit_fiche_enfant: boolean = false
  @Input()
  fiche_enfant_to_edit: FicheEnfantTafType = new FicheEnfantTafType();
  form_details: any = {}
  loading_get_details_edit_fiche_enfant_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditFicheEnfantComponent");
      this.get_details_edit_fiche_enfant_form()
      this.update_form(this.fiche_enfant_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(fiche_enfant_to_edit:any) {
      this.reactiveForm_edit_fiche_enfant = this.formBuilder.group({
          id_enfant : [fiche_enfant_to_edit.id_enfant],
id_mensualite_structure : [fiche_enfant_to_edit.id_mensualite_structure],
abonnement_cantine : [fiche_enfant_to_edit.abonnement_cantine],
updated_at : [fiche_enfant_to_edit.updated_at],
created_by : [fiche_enfant_to_edit.created_by],
updated_by : [fiche_enfant_to_edit.updated_by]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_fiche_enfant .controls; }
  // validation du formulaire
  onSubmit_edit_fiche_enfant() {
      this.submitted = true;
      console.log(this.reactiveForm_edit_fiche_enfant.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_fiche_enfant.invalid) {
          return;
      }
      var fiche_enfant = this.reactiveForm_edit_fiche_enfant.value
      this.edit_fiche_enfant({
      condition:{id_fiche_enfant:this.fiche_enfant_to_edit.id_fiche_enfant},
      data:fiche_enfant
      })
  }
  // vider le formulaire
  onReset_edit_fiche_enfant() {
      this.submitted = false;
      this.reactiveForm_edit_fiche_enfant.reset();
  }
  edit_fiche_enfant(fiche_enfant: any) {
      this.loading_edit_fiche_enfant = true;
      this.api.taf_post("fiche_enfant/edit", fiche_enfant, (reponse: any) => {
          if (reponse.status) {
              this.activeModal.close(reponse)
              console.log("Opération effectuée avec succés sur la table fiche_enfant. Réponse= ", reponse);
              //this.onReset_edit_fiche_enfant()
              this.api.Swal_success("Opération éffectuée avec succés")
          } else {
              console.log("L'opération sur la table fiche_enfant a échoué. Réponse= ", reponse);
              this.api.Swal_error("L'opération a echoué")
          }
          this.loading_edit_fiche_enfant = false;
      }, (error: any) => {
          this.loading_edit_fiche_enfant = false;
      })
  }
  get_details_edit_fiche_enfant_form() {
      this.loading_get_details_edit_fiche_enfant_form = true;
      this.api.taf_post("fiche_enfant/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table fiche_enfant. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table fiche_enfant a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_edit_fiche_enfant_form = false;
      }, (error: any) => {
      this.loading_get_details_edit_fiche_enfant_form = false;
    })
  }
}