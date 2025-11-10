import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { UtilisateurTafType } from '../taf-type/utilisateur-taf-type';
@Component({
  selector: 'app-edit-utilisateur',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-utilisateur.component.html',
  styleUrls: ['./edit-utilisateur.component.scss']
})
export class EditUtilisateurComponent implements OnInit, OnDestroy {
  reactiveForm_edit_utilisateur !: FormGroup;
  submitted: boolean = false
  loading_edit_utilisateur: boolean = false
  @Input()
  utilisateur_to_edit: UtilisateurTafType = new UtilisateurTafType();
  form_details: any = {}
  loading_get_details_edit_utilisateur_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditUtilisateurComponent");
      this.get_details_edit_utilisateur_form()
      this.update_form(this.utilisateur_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(utilisateur_to_edit:any) {
      this.reactiveForm_edit_utilisateur = this.formBuilder.group({
          id_genre : [utilisateur_to_edit.id_genre],
id_groupe_sanguin : [utilisateur_to_edit.id_groupe_sanguin],
id_statut_utilisateur : [utilisateur_to_edit.id_statut_utilisateur],
prenom_utilisateur : [utilisateur_to_edit.prenom_utilisateur],
nom_utilisateur : [utilisateur_to_edit.nom_utilisateur],
adresse_utilisateur : [utilisateur_to_edit.adresse_utilisateur],
telephone_utilisateur : [utilisateur_to_edit.telephone_utilisateur],
date_naissance : [utilisateur_to_edit.date_naissance],
email_utilisateur : [utilisateur_to_edit.email_utilisateur],
mot_de_passe : [utilisateur_to_edit.mot_de_passe],
profil_utilisateur : [utilisateur_to_edit.profil_utilisateur],
updated_at : [utilisateur_to_edit.updated_at],
created_by : [utilisateur_to_edit.created_by],
updated_by : [utilisateur_to_edit.updated_by]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_utilisateur .controls; }
  // validation du formulaire
  onSubmit_edit_utilisateur() {
      this.submitted = true;
      console.log(this.reactiveForm_edit_utilisateur.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_utilisateur.invalid) {
          return;
      }
      var utilisateur = this.reactiveForm_edit_utilisateur.value
      this.edit_utilisateur({
      condition:{id_utilisateur:this.utilisateur_to_edit.id_utilisateur},
      data:utilisateur
      })
  }
  // vider le formulaire
  onReset_edit_utilisateur() {
      this.submitted = false;
      this.reactiveForm_edit_utilisateur.reset();
  }
  edit_utilisateur(utilisateur: any) {
      this.loading_edit_utilisateur = true;
      this.api.taf_post("utilisateur/edit", utilisateur, (reponse: any) => {
          if (reponse.status) {
              this.activeModal.close(reponse)
              console.log("Opération effectuée avec succés sur la table utilisateur. Réponse= ", reponse);
              //this.onReset_edit_utilisateur()
              this.api.Swal_success("Opération éffectuée avec succés")
          } else {
              console.log("L'opération sur la table utilisateur a échoué. Réponse= ", reponse);
              this.api.Swal_error("L'opération a echoué")
          }
          this.loading_edit_utilisateur = false;
      }, (error: any) => {
          this.loading_edit_utilisateur = false;
      })
  }
  get_details_edit_utilisateur_form() {
      this.loading_get_details_edit_utilisateur_form = true;
      this.api.taf_post("utilisateur/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table utilisateur. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table utilisateur a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_edit_utilisateur_form = false;
      }, (error: any) => {
      this.loading_get_details_edit_utilisateur_form = false;
    })
  }
}