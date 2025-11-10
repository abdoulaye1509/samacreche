import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaysTafType } from '../taf-type/pays-taf-type';
@Component({
  selector: 'app-edit-pays',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-pays.component.html',
  styleUrls: ['./edit-pays.component.scss']
})
export class EditPaysComponent implements OnInit, OnDestroy {
  reactiveForm_edit_pays !: FormGroup;
  submitted: boolean = false
  loading_edit_pays: boolean = false
  @Input()
  pays_to_edit: PaysTafType = new PaysTafType();
  form_details: any = {}
  loading_get_details_edit_pays_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditPaysComponent");
      this.get_details_edit_pays_form()
      this.update_form(this.pays_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(pays_to_edit:any) {
      this.reactiveForm_edit_pays = this.formBuilder.group({
          nom_pays : [pays_to_edit.nom_pays],
description_pays : [pays_to_edit.description_pays],
lien_juridique : [pays_to_edit.lien_juridique],
updated_at : [pays_to_edit.updated_at],
created_by : [pays_to_edit.created_by],
updated_by : [pays_to_edit.updated_by]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_pays .controls; }
  // validation du formulaire
  onSubmit_edit_pays() {
      this.submitted = true;
      console.log(this.reactiveForm_edit_pays.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_pays.invalid) {
          return;
      }
      var pays = this.reactiveForm_edit_pays.value
      this.edit_pays({
      condition:{id_pays:this.pays_to_edit.id_pays},
      data:pays
      })
  }
  // vider le formulaire
  onReset_edit_pays() {
      this.submitted = false;
      this.reactiveForm_edit_pays.reset();
  }
  edit_pays(pays: any) {
      this.loading_edit_pays = true;
      this.api.taf_post("pays/edit", pays, (reponse: any) => {
          if (reponse.status) {
              this.activeModal.close(reponse)
              console.log("Opération effectuée avec succés sur la table pays. Réponse= ", reponse);
              //this.onReset_edit_pays()
              this.api.Swal_success("Opération éffectuée avec succés")
          } else {
              console.log("L'opération sur la table pays a échoué. Réponse= ", reponse);
              this.api.Swal_error("L'opération a echoué")
          }
          this.loading_edit_pays = false;
      }, (error: any) => {
          this.loading_edit_pays = false;
      })
  }
  get_details_edit_pays_form() {
      this.loading_get_details_edit_pays_form = true;
      this.api.taf_post("pays/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table pays. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table pays a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_edit_pays_form = false;
      }, (error: any) => {
      this.loading_get_details_edit_pays_form = false;
    })
  }
}