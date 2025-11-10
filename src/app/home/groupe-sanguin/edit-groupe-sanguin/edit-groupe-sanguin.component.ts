import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { GroupeSanguinTafType } from '../taf-type/groupe-sanguin-taf-type';
@Component({
  selector: 'app-edit-groupe-sanguin',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-groupe-sanguin.component.html',
  styleUrls: ['./edit-groupe-sanguin.component.scss']
})
export class EditGroupeSanguinComponent implements OnInit, OnDestroy {
  reactiveForm_edit_groupe_sanguin !: FormGroup;
  submitted: boolean = false
  loading_edit_groupe_sanguin: boolean = false
  @Input()
  groupe_sanguin_to_edit: GroupeSanguinTafType = new GroupeSanguinTafType();
  form_details: any = {}
  loading_get_details_edit_groupe_sanguin_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditGroupeSanguinComponent");
      this.get_details_edit_groupe_sanguin_form()
      this.update_form(this.groupe_sanguin_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(groupe_sanguin_to_edit:any) {
      this.reactiveForm_edit_groupe_sanguin = this.formBuilder.group({
          libelle_groupe_sanguin : [groupe_sanguin_to_edit.libelle_groupe_sanguin],
description_groupe_sanguin : [groupe_sanguin_to_edit.description_groupe_sanguin],
updated_at : [groupe_sanguin_to_edit.updated_at],
created_by : [groupe_sanguin_to_edit.created_by],
updated_by : [groupe_sanguin_to_edit.updated_by]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_groupe_sanguin .controls; }
  // validation du formulaire
  onSubmit_edit_groupe_sanguin() {
      this.submitted = true;
      console.log(this.reactiveForm_edit_groupe_sanguin.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_groupe_sanguin.invalid) {
          return;
      }
      var groupe_sanguin = this.reactiveForm_edit_groupe_sanguin.value
      this.edit_groupe_sanguin({
      condition:{id_groupe_sanguin:this.groupe_sanguin_to_edit.id_groupe_sanguin},
      data:groupe_sanguin
      })
  }
  // vider le formulaire
  onReset_edit_groupe_sanguin() {
      this.submitted = false;
      this.reactiveForm_edit_groupe_sanguin.reset();
  }
  edit_groupe_sanguin(groupe_sanguin: any) {
      this.loading_edit_groupe_sanguin = true;
      this.api.taf_post("groupe_sanguin/edit", groupe_sanguin, (reponse: any) => {
          if (reponse.status) {
              this.activeModal.close(reponse)
              console.log("Opération effectuée avec succés sur la table groupe_sanguin. Réponse= ", reponse);
              //this.onReset_edit_groupe_sanguin()
              this.api.Swal_success("Opération éffectuée avec succés")
          } else {
              console.log("L'opération sur la table groupe_sanguin a échoué. Réponse= ", reponse);
              this.api.Swal_error("L'opération a echoué")
          }
          this.loading_edit_groupe_sanguin = false;
      }, (error: any) => {
          this.loading_edit_groupe_sanguin = false;
      })
  }
  get_details_edit_groupe_sanguin_form() {
      this.loading_get_details_edit_groupe_sanguin_form = true;
      this.api.taf_post("groupe_sanguin/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table groupe_sanguin. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table groupe_sanguin a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_edit_groupe_sanguin_form = false;
      }, (error: any) => {
      this.loading_get_details_edit_groupe_sanguin_form = false;
    })
  }
}