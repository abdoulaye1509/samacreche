import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { GroupeSanguinTafType } from '../taf-type/groupe-sanguin-taf-type';
@Component({
  selector: 'app-add-groupe-sanguin',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './add-groupe-sanguin.component.html',
  styleUrls: ['./add-groupe-sanguin.component.scss']
})
export class AddGroupeSanguinComponent implements OnInit, OnDestroy {
  reactiveForm_add_groupe_sanguin !: FormGroup;
  submitted:boolean=false
  loading_add_groupe_sanguin :boolean=false
  form_details: any = {}
  loading_get_details_add_groupe_sanguin_form = false
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      console.groupCollapsed("AddGroupeSanguinComponent");
      this.get_details_add_groupe_sanguin_form()
      this.init_form()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  init_form() {
      this.reactiveForm_add_groupe_sanguin  = this.formBuilder.group({
          libelle_groupe_sanguin: [""],
description_groupe_sanguin: [""],
updated_at: [""],
created_by: [""],
updated_by: [""]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_groupe_sanguin .controls; }
  // validation du formulaire
  onSubmit_add_groupe_sanguin () {
      this.submitted = true;
      console.log(this.reactiveForm_add_groupe_sanguin .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_groupe_sanguin .invalid) {
          return;
      }
      var groupe_sanguin =this.reactiveForm_add_groupe_sanguin .value
      this.add_groupe_sanguin (groupe_sanguin )
  }
  // vider le formulaire
  onReset_add_groupe_sanguin () {
      this.submitted = false;
      this.reactiveForm_add_groupe_sanguin .reset();
  }
  add_groupe_sanguin(groupe_sanguin: any) {
      this.loading_add_groupe_sanguin = true;
      this.api.taf_post("groupe_sanguin/add", groupe_sanguin, (reponse: any) => {
      this.loading_add_groupe_sanguin = false;
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table groupe_sanguin. Réponse= ", reponse);
          this.onReset_add_groupe_sanguin()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table groupe_sanguin a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_groupe_sanguin = false;
    })
  }
  
  get_details_add_groupe_sanguin_form() {
      this.loading_get_details_add_groupe_sanguin_form = true;
      this.api.taf_post("groupe_sanguin/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table groupe_sanguin. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table groupe_sanguin a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_groupe_sanguin_form = false;
      }, (error: any) => {
      this.loading_get_details_add_groupe_sanguin_form = false;
    })
  }
}
