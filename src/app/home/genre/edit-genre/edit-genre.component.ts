import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { GenreTafType } from '../taf-type/genre-taf-type';
@Component({
  selector: 'app-edit-genre',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-genre.component.html',
  styleUrls: ['./edit-genre.component.scss']
})
export class EditGenreComponent implements OnInit, OnDestroy {
  reactiveForm_edit_genre !: FormGroup;
  submitted: boolean = false
  loading_edit_genre: boolean = false
  @Input()
  genre_to_edit: GenreTafType = new GenreTafType();
  form_details: any = {}
  loading_get_details_edit_genre_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditGenreComponent");
      this.get_details_edit_genre_form()
      this.update_form(this.genre_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(genre_to_edit:any) {
      this.reactiveForm_edit_genre = this.formBuilder.group({
          nom_genre : [genre_to_edit.nom_genre],
description_genre : [genre_to_edit.description_genre],
updated_at : [genre_to_edit.updated_at],
created_by : [genre_to_edit.created_by],
updated_by : [genre_to_edit.updated_by]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_genre .controls; }
  // validation du formulaire
  onSubmit_edit_genre() {
      this.submitted = true;
      console.log(this.reactiveForm_edit_genre.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_genre.invalid) {
          return;
      }
      var genre = this.reactiveForm_edit_genre.value
      this.edit_genre({
      condition:{id_genre:this.genre_to_edit.id_genre},
      data:genre
      })
  }
  // vider le formulaire
  onReset_edit_genre() {
      this.submitted = false;
      this.reactiveForm_edit_genre.reset();
  }
  edit_genre(genre: any) {
      this.loading_edit_genre = true;
      this.api.taf_post("genre/edit", genre, (reponse: any) => {
          if (reponse.status) {
              this.activeModal.close(reponse)
              console.log("Opération effectuée avec succés sur la table genre. Réponse= ", reponse);
              //this.onReset_edit_genre()
              this.api.Swal_success("Opération éffectuée avec succés")
          } else {
              console.log("L'opération sur la table genre a échoué. Réponse= ", reponse);
              this.api.Swal_error("L'opération a echoué")
          }
          this.loading_edit_genre = false;
      }, (error: any) => {
          this.loading_edit_genre = false;
      })
  }
  get_details_edit_genre_form() {
      this.loading_get_details_edit_genre_form = true;
      this.api.taf_post("genre/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table genre. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table genre a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_edit_genre_form = false;
      }, (error: any) => {
      this.loading_get_details_edit_genre_form = false;
    })
  }
}