import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HonoraireTafType } from '../taf-type/honoraire-taf-type';
@Component({
  selector: 'app-add-honoraire',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './add-honoraire.component.html',
  styleUrls: ['./add-honoraire.component.scss']
})
export class AddHonoraireComponent implements OnInit, OnDestroy {
  reactiveForm_add_honoraire !: FormGroup;
  submitted:boolean=false
  loading_add_honoraire :boolean=false
  form_details: any = {}
  loading_get_details_add_honoraire_form = false
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      console.groupCollapsed("AddHonoraireComponent");
      this.get_details_add_honoraire_form()
      this.init_form()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  init_form() {
      this.reactiveForm_add_honoraire  = this.formBuilder.group({
          id_utilisateur: [""],
date_honoraire: [""],
libelle_honoraire: [""],
montant_recu: [""],
updated_at: [""],
created_by: [""],
updated_by: [""]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_honoraire .controls; }
  // validation du formulaire
  onSubmit_add_honoraire () {
      this.submitted = true;
      console.log(this.reactiveForm_add_honoraire .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_honoraire .invalid) {
          return;
      }
      var honoraire =this.reactiveForm_add_honoraire .value
      this.add_honoraire (honoraire )
  }
  // vider le formulaire
  onReset_add_honoraire () {
      this.submitted = false;
      this.reactiveForm_add_honoraire .reset();
  }
  add_honoraire(honoraire: any) {
      this.loading_add_honoraire = true;
      this.api.taf_post("honoraire/add", honoraire, (reponse: any) => {
      this.loading_add_honoraire = false;
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table honoraire. Réponse= ", reponse);
          this.onReset_add_honoraire()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table honoraire a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_honoraire = false;
    })
  }
  
  get_details_add_honoraire_form() {
      this.loading_get_details_add_honoraire_form = true;
      this.api.taf_post("honoraire/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table honoraire. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table honoraire a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_honoraire_form = false;
      }, (error: any) => {
      this.loading_get_details_add_honoraire_form = false;
    })
  }
}
