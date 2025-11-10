import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { StructureUtilisateurTafType } from '../taf-type/structure-utilisateur-taf-type';
@Component({
  selector: 'app-add-structure-utilisateur',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './add-structure-utilisateur.component.html',
  styleUrls: ['./add-structure-utilisateur.component.scss']
})
export class AddStructureUtilisateurComponent implements OnInit, OnDestroy {
  reactiveForm_add_structure_utilisateur !: FormGroup;
  submitted:boolean=false
  loading_add_structure_utilisateur :boolean=false
  form_details: any = {}
  loading_get_details_add_structure_utilisateur_form = false
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      console.groupCollapsed("AddStructureUtilisateurComponent");
      this.get_details_add_structure_utilisateur_form()
      this.init_form()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  init_form() {
      this.reactiveForm_add_structure_utilisateur  = this.formBuilder.group({
          id_structure: [""],
id_utilisateur: [""],
id_privilege: [""],
updated_at: [""],
created_by: [""],
updated_by: [""]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_structure_utilisateur .controls; }
  // validation du formulaire
  onSubmit_add_structure_utilisateur () {
      this.submitted = true;
      console.log(this.reactiveForm_add_structure_utilisateur .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_structure_utilisateur .invalid) {
          return;
      }
      var structure_utilisateur =this.reactiveForm_add_structure_utilisateur .value
      this.add_structure_utilisateur (structure_utilisateur )
  }
  // vider le formulaire
  onReset_add_structure_utilisateur () {
      this.submitted = false;
      this.reactiveForm_add_structure_utilisateur .reset();
  }
  add_structure_utilisateur(structure_utilisateur: any) {
      this.loading_add_structure_utilisateur = true;
      this.api.taf_post("structure_utilisateur/add", structure_utilisateur, (reponse: any) => {
      this.loading_add_structure_utilisateur = false;
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table structure_utilisateur. Réponse= ", reponse);
          this.onReset_add_structure_utilisateur()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table structure_utilisateur a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_structure_utilisateur = false;
    })
  }
  
  get_details_add_structure_utilisateur_form() {
      this.loading_get_details_add_structure_utilisateur_form = true;
      this.api.taf_post("structure_utilisateur/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table structure_utilisateur. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table structure_utilisateur a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_structure_utilisateur_form = false;
      }, (error: any) => {
      this.loading_get_details_add_structure_utilisateur_form = false;
    })
  }
}
