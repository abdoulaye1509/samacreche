import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ParentTafType } from '../taf-type/parent-taf-type';
@Component({
  selector: 'app-add-parent',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './add-parent.component.html',
  styleUrls: ['./add-parent.component.scss']
})
export class AddParentComponent implements OnInit, OnDestroy {
  reactiveForm_add_parent !: FormGroup;
  submitted:boolean=false
  loading_add_parent :boolean=false
  form_details: any = {}
  loading_get_details_add_parent_form = false
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      console.groupCollapsed("AddParentComponent");
      this.get_details_add_parent_form()
      this.init_form()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  init_form() {
      this.reactiveForm_add_parent  = this.formBuilder.group({
          id_lien_parente: [""],
prenom_parent: [""],
nom_parent: [""],
adresse_parent: [""],
email_parent: [""],
mot_de_passe: [""],
cni: [""],
updated_at: [""],
created_by: [""],
updated_by: [""]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_parent .controls; }
  // validation du formulaire
  onSubmit_add_parent () {
      this.submitted = true;
      console.log(this.reactiveForm_add_parent .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_parent .invalid) {
          return;
      }
      var parent =this.reactiveForm_add_parent .value
      this.add_parent (parent )
  }
  // vider le formulaire
  onReset_add_parent () {
      this.submitted = false;
      this.reactiveForm_add_parent .reset();
  }
  add_parent(parent: any) {
      this.loading_add_parent = true;
      this.api.taf_post("parent/add", parent, (reponse: any) => {
      this.loading_add_parent = false;
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table parent. Réponse= ", reponse);
          this.onReset_add_parent()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table parent a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_parent = false;
    })
  }
  
  get_details_add_parent_form() {
      this.loading_get_details_add_parent_form = true;
      this.api.taf_post("parent/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table parent. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table parent a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_parent_form = false;
      }, (error: any) => {
      this.loading_get_details_add_parent_form = false;
    })
  }
}
