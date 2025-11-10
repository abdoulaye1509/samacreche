import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { GalerieEnfantTafType } from '../taf-type/galerie-enfant-taf-type';
@Component({
  selector: 'app-edit-galerie-enfant',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-galerie-enfant.component.html',
  styleUrls: ['./edit-galerie-enfant.component.scss']
})
export class EditGalerieEnfantComponent implements OnInit, OnDestroy {
  reactiveForm_edit_galerie_enfant !: FormGroup;
  submitted: boolean = false
  loading_edit_galerie_enfant: boolean = false
  @Input()
  galerie_enfant_to_edit: GalerieEnfantTafType = new GalerieEnfantTafType();
  form_details: any = {}
  loading_get_details_edit_galerie_enfant_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditGalerieEnfantComponent");
      this.get_details_edit_galerie_enfant_form()
      this.update_form(this.galerie_enfant_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(galerie_enfant_to_edit:any) {
      this.reactiveForm_edit_galerie_enfant = this.formBuilder.group({
          id_enfant : [galerie_enfant_to_edit.id_enfant],
url_image : [galerie_enfant_to_edit.url_image],
date_image : [galerie_enfant_to_edit.date_image],
updated_at : [galerie_enfant_to_edit.updated_at],
created_by : [galerie_enfant_to_edit.created_by],
updated_by : [galerie_enfant_to_edit.updated_by]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_galerie_enfant .controls; }
  // validation du formulaire
  onSubmit_edit_galerie_enfant() {
      this.submitted = true;
      console.log(this.reactiveForm_edit_galerie_enfant.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_galerie_enfant.invalid) {
          return;
      }
      var galerie_enfant = this.reactiveForm_edit_galerie_enfant.value
      this.edit_galerie_enfant({
      condition:{id_galerie_enfant:this.galerie_enfant_to_edit.id_galerie_enfant},
      data:galerie_enfant
      })
  }
  // vider le formulaire
  onReset_edit_galerie_enfant() {
      this.submitted = false;
      this.reactiveForm_edit_galerie_enfant.reset();
  }
  edit_galerie_enfant(galerie_enfant: any) {
      this.loading_edit_galerie_enfant = true;
      this.api.taf_post("galerie_enfant/edit", galerie_enfant, (reponse: any) => {
          if (reponse.status) {
              this.activeModal.close(reponse)
              console.log("Opération effectuée avec succés sur la table galerie_enfant. Réponse= ", reponse);
              //this.onReset_edit_galerie_enfant()
              this.api.Swal_success("Opération éffectuée avec succés")
          } else {
              console.log("L'opération sur la table galerie_enfant a échoué. Réponse= ", reponse);
              this.api.Swal_error("L'opération a echoué")
          }
          this.loading_edit_galerie_enfant = false;
      }, (error: any) => {
          this.loading_edit_galerie_enfant = false;
      })
  }
  get_details_edit_galerie_enfant_form() {
      this.loading_get_details_edit_galerie_enfant_form = true;
      this.api.taf_post("galerie_enfant/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table galerie_enfant. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table galerie_enfant a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_edit_galerie_enfant_form = false;
      }, (error: any) => {
      this.loading_get_details_edit_galerie_enfant_form = false;
    })
  }
}