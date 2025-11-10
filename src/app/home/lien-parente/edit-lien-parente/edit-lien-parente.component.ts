import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { LienParenteTafType } from '../taf-type/lien-parente-taf-type';
@Component({
  selector: 'app-edit-lien-parente',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-lien-parente.component.html',
  styleUrls: ['./edit-lien-parente.component.scss']
})
export class EditLienParenteComponent implements OnInit, OnDestroy {
  reactiveForm_edit_lien_parente !: FormGroup;
  submitted: boolean = false
  loading_edit_lien_parente: boolean = false
  @Input()
  lien_parente_to_edit: LienParenteTafType = new LienParenteTafType();
  form_details: any = {}
  loading_get_details_edit_lien_parente_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditLienParenteComponent");
      this.get_details_edit_lien_parente_form()
      this.update_form(this.lien_parente_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(lien_parente_to_edit:any) {
      this.reactiveForm_edit_lien_parente = this.formBuilder.group({
          libelle_lien_parente : [lien_parente_to_edit.libelle_lien_parente],
description : [lien_parente_to_edit.description],
updated_at : [lien_parente_to_edit.updated_at],
created_by : [lien_parente_to_edit.created_by],
updated_by : [lien_parente_to_edit.updated_by]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_lien_parente .controls; }
  // validation du formulaire
  onSubmit_edit_lien_parente() {
      this.submitted = true;
      console.log(this.reactiveForm_edit_lien_parente.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_lien_parente.invalid) {
          return;
      }
      var lien_parente = this.reactiveForm_edit_lien_parente.value
      this.edit_lien_parente({
      condition:{id_lien_parente:this.lien_parente_to_edit.id_lien_parente},
      data:lien_parente
      })
  }
  // vider le formulaire
  onReset_edit_lien_parente() {
      this.submitted = false;
      this.reactiveForm_edit_lien_parente.reset();
  }
  edit_lien_parente(lien_parente: any) {
      this.loading_edit_lien_parente = true;
      this.api.taf_post("lien_parente/edit", lien_parente, (reponse: any) => {
          if (reponse.status) {
              this.activeModal.close(reponse)
              console.log("Opération effectuée avec succés sur la table lien_parente. Réponse= ", reponse);
              //this.onReset_edit_lien_parente()
              this.api.Swal_success("Opération éffectuée avec succés")
          } else {
              console.log("L'opération sur la table lien_parente a échoué. Réponse= ", reponse);
              this.api.Swal_error("L'opération a echoué")
          }
          this.loading_edit_lien_parente = false;
      }, (error: any) => {
          this.loading_edit_lien_parente = false;
      })
  }
  get_details_edit_lien_parente_form() {
      this.loading_get_details_edit_lien_parente_form = true;
      this.api.taf_post("lien_parente/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table lien_parente. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table lien_parente a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_edit_lien_parente_form = false;
      }, (error: any) => {
      this.loading_get_details_edit_lien_parente_form = false;
    })
  }
}