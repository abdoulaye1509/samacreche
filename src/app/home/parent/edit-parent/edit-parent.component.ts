import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ParentTafType } from '../taf-type/parent-taf-type';
@Component({
  selector: 'app-edit-parent',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-parent.component.html',
  styleUrls: ['./edit-parent.component.scss']
})
export class EditParentComponent implements OnInit, OnDestroy {
  reactiveForm_edit_parent !: FormGroup;
  submitted: boolean = false
  loading_edit_parent: boolean = false
  @Input()
  parent_to_edit: ParentTafType = new ParentTafType();
  form_details: any = {}
  loading_get_details_edit_parent_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditParentComponent");
      this.get_details_edit_parent_form()
      this.update_form(this.parent_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(parent_to_edit:any) {
      this.reactiveForm_edit_parent = this.formBuilder.group({
          id_lien_parente : [parent_to_edit.id_lien_parente],
prenom_parent : [parent_to_edit.prenom_parent],
nom_parent : [parent_to_edit.nom_parent],
adresse_parent : [parent_to_edit.adresse_parent],
email_parent : [parent_to_edit.email_parent],
mot_de_passe : [parent_to_edit.mot_de_passe],
cni : [parent_to_edit.cni],
updated_at : [parent_to_edit.updated_at],
created_by : [parent_to_edit.created_by],
updated_by : [parent_to_edit.updated_by]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_parent .controls; }
  // validation du formulaire
  onSubmit_edit_parent() {
      this.submitted = true;
      console.log(this.reactiveForm_edit_parent.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_parent.invalid) {
          return;
      }
      var parent = this.reactiveForm_edit_parent.value
      this.edit_parent({
      condition:{id_parent:this.parent_to_edit.id_parent},
      data:parent
      })
  }
  // vider le formulaire
  onReset_edit_parent() {
      this.submitted = false;
      this.reactiveForm_edit_parent.reset();
  }
  edit_parent(parent: any) {
      this.loading_edit_parent = true;
      this.api.taf_post("parent/edit", parent, (reponse: any) => {
          if (reponse.status) {
              this.activeModal.close(reponse)
              console.log("Opération effectuée avec succés sur la table parent. Réponse= ", reponse);
              //this.onReset_edit_parent()
              this.api.Swal_success("Opération éffectuée avec succés")
          } else {
              console.log("L'opération sur la table parent a échoué. Réponse= ", reponse);
              this.api.Swal_error("L'opération a echoué")
          }
          this.loading_edit_parent = false;
      }, (error: any) => {
          this.loading_edit_parent = false;
      })
  }
  get_details_edit_parent_form() {
      this.loading_get_details_edit_parent_form = true;
      this.api.taf_post("parent/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table parent. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table parent a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_edit_parent_form = false;
      }, (error: any) => {
      this.loading_get_details_edit_parent_form = false;
    })
  }
}