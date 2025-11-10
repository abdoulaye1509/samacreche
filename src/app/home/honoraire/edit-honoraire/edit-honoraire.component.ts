import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HonoraireTafType } from '../taf-type/honoraire-taf-type';
@Component({
  selector: 'app-edit-honoraire',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-honoraire.component.html',
  styleUrls: ['./edit-honoraire.component.scss']
})
export class EditHonoraireComponent implements OnInit, OnDestroy {
  reactiveForm_edit_honoraire !: FormGroup;
  submitted: boolean = false
  loading_edit_honoraire: boolean = false
  @Input()
  honoraire_to_edit: HonoraireTafType = new HonoraireTafType();
  form_details: any = {}
  loading_get_details_edit_honoraire_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditHonoraireComponent");
      this.get_details_edit_honoraire_form()
      this.update_form(this.honoraire_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(honoraire_to_edit:any) {
      this.reactiveForm_edit_honoraire = this.formBuilder.group({
          id_utilisateur : [honoraire_to_edit.id_utilisateur],
date_honoraire : [honoraire_to_edit.date_honoraire],
libelle_honoraire : [honoraire_to_edit.libelle_honoraire],
montant_recu : [honoraire_to_edit.montant_recu],
updated_at : [honoraire_to_edit.updated_at],
created_by : [honoraire_to_edit.created_by],
updated_by : [honoraire_to_edit.updated_by]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_honoraire .controls; }
  // validation du formulaire
  onSubmit_edit_honoraire() {
      this.submitted = true;
      console.log(this.reactiveForm_edit_honoraire.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_honoraire.invalid) {
          return;
      }
      var honoraire = this.reactiveForm_edit_honoraire.value
      this.edit_honoraire({
      condition:{id_honoraire:this.honoraire_to_edit.id_honoraire},
      data:honoraire
      })
  }
  // vider le formulaire
  onReset_edit_honoraire() {
      this.submitted = false;
      this.reactiveForm_edit_honoraire.reset();
  }
  edit_honoraire(honoraire: any) {
      this.loading_edit_honoraire = true;
      this.api.taf_post("honoraire/edit", honoraire, (reponse: any) => {
          if (reponse.status) {
              this.activeModal.close(reponse)
              console.log("Opération effectuée avec succés sur la table honoraire. Réponse= ", reponse);
              //this.onReset_edit_honoraire()
              this.api.Swal_success("Opération éffectuée avec succés")
          } else {
              console.log("L'opération sur la table honoraire a échoué. Réponse= ", reponse);
              this.api.Swal_error("L'opération a echoué")
          }
          this.loading_edit_honoraire = false;
      }, (error: any) => {
          this.loading_edit_honoraire = false;
      })
  }
  get_details_edit_honoraire_form() {
      this.loading_get_details_edit_honoraire_form = true;
      this.api.taf_post("honoraire/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table honoraire. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table honoraire a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_edit_honoraire_form = false;
      }, (error: any) => {
      this.loading_get_details_edit_honoraire_form = false;
    })
  }
}