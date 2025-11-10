import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { StructureUtilisateurTafType } from '../taf-type/structure-utilisateur-taf-type';
@Component({
  selector: 'app-edit-structure-utilisateur',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-structure-utilisateur.component.html',
  styleUrls: ['./edit-structure-utilisateur.component.scss']
})
export class EditStructureUtilisateurComponent implements OnInit, OnDestroy {
  reactiveForm_edit_structure_utilisateur !: FormGroup;
  submitted: boolean = false
  loading_edit_structure_utilisateur: boolean = false
  @Input()
  structure_utilisateur_to_edit: StructureUtilisateurTafType = new StructureUtilisateurTafType();
  form_details: any = {}
  loading_get_details_edit_structure_utilisateur_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditStructureUtilisateurComponent");
      this.get_details_edit_structure_utilisateur_form()
      this.update_form(this.structure_utilisateur_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(structure_utilisateur_to_edit:any) {
      this.reactiveForm_edit_structure_utilisateur = this.formBuilder.group({
          id_structure : [structure_utilisateur_to_edit.id_structure],
id_utilisateur : [structure_utilisateur_to_edit.id_utilisateur],
id_privilege : [structure_utilisateur_to_edit.id_privilege],
updated_at : [structure_utilisateur_to_edit.updated_at],
created_by : [structure_utilisateur_to_edit.created_by],
updated_by : [structure_utilisateur_to_edit.updated_by]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_structure_utilisateur .controls; }
  // validation du formulaire
  onSubmit_edit_structure_utilisateur() {
      this.submitted = true;
      console.log(this.reactiveForm_edit_structure_utilisateur.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_structure_utilisateur.invalid) {
          return;
      }
      var structure_utilisateur = this.reactiveForm_edit_structure_utilisateur.value
      this.edit_structure_utilisateur({
      condition:{id_structure_utilisateur:this.structure_utilisateur_to_edit.id_structure_utilisateur},
      data:structure_utilisateur
      })
  }
  // vider le formulaire
  onReset_edit_structure_utilisateur() {
      this.submitted = false;
      this.reactiveForm_edit_structure_utilisateur.reset();
  }
  edit_structure_utilisateur(structure_utilisateur: any) {
      this.loading_edit_structure_utilisateur = true;
      this.api.taf_post("structure_utilisateur/edit", structure_utilisateur, (reponse: any) => {
          if (reponse.status) {
              this.activeModal.close(reponse)
              console.log("Opération effectuée avec succés sur la table structure_utilisateur. Réponse= ", reponse);
              //this.onReset_edit_structure_utilisateur()
              this.api.Swal_success("Opération éffectuée avec succés")
          } else {
              console.log("L'opération sur la table structure_utilisateur a échoué. Réponse= ", reponse);
              this.api.Swal_error("L'opération a echoué")
          }
          this.loading_edit_structure_utilisateur = false;
      }, (error: any) => {
          this.loading_edit_structure_utilisateur = false;
      })
  }
  get_details_edit_structure_utilisateur_form() {
      this.loading_get_details_edit_structure_utilisateur_form = true;
      this.api.taf_post("structure_utilisateur/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table structure_utilisateur. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table structure_utilisateur a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_edit_structure_utilisateur_form = false;
      }, (error: any) => {
      this.loading_get_details_edit_structure_utilisateur_form = false;
    })
  }
}