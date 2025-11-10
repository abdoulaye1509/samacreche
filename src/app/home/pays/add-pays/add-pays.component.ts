import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaysTafType } from '../taf-type/pays-taf-type';
@Component({
  selector: 'app-add-pays',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './add-pays.component.html',
  styleUrls: ['./add-pays.component.scss']
})
export class AddPaysComponent implements OnInit, OnDestroy {
  reactiveForm_add_pays !: FormGroup;
  submitted:boolean=false
  loading_add_pays :boolean=false
  form_details: any = {}
  loading_get_details_add_pays_form = false
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      console.groupCollapsed("AddPaysComponent");
      this.get_details_add_pays_form()
      this.init_form()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  init_form() {
      this.reactiveForm_add_pays  = this.formBuilder.group({
          nom_pays: [""],
description_pays: [""],
lien_juridique: [""],
updated_at: [""],
created_by: [""],
updated_by: [""]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_pays .controls; }
  // validation du formulaire
  onSubmit_add_pays () {
      this.submitted = true;
      console.log(this.reactiveForm_add_pays .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_pays .invalid) {
          return;
      }
      var pays =this.reactiveForm_add_pays .value
      this.add_pays (pays )
  }
  // vider le formulaire
  onReset_add_pays () {
      this.submitted = false;
      this.reactiveForm_add_pays .reset();
  }
  add_pays(pays: any) {
      this.loading_add_pays = true;
      this.api.taf_post("pays/add", pays, (reponse: any) => {
      this.loading_add_pays = false;
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table pays. Réponse= ", reponse);
          this.onReset_add_pays()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table pays a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_pays = false;
    })
  }
  
  get_details_add_pays_form() {
      this.loading_get_details_add_pays_form = true;
      this.api.taf_post("pays/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table pays. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table pays a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_pays_form = false;
      }, (error: any) => {
      this.loading_get_details_add_pays_form = false;
    })
  }
}
