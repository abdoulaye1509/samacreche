import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { GenreTafType } from '../taf-type/genre-taf-type';
@Component({
  selector: 'app-add-genre',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './add-genre.component.html',
  styleUrls: ['./add-genre.component.scss']
})
export class AddGenreComponent implements OnInit, OnDestroy {
  reactiveForm_add_genre !: FormGroup;
  submitted:boolean=false
  loading_add_genre :boolean=false
  form_details: any = {}
  loading_get_details_add_genre_form = false
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      console.groupCollapsed("AddGenreComponent");
      this.get_details_add_genre_form()
      this.init_form()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  init_form() {
      this.reactiveForm_add_genre  = this.formBuilder.group({
          nom_genre: [""],
description_genre: [""],
updated_at: [""],
created_by: [""],
updated_by: [""]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_genre .controls; }
  // validation du formulaire
  onSubmit_add_genre () {
      this.submitted = true;
      console.log(this.reactiveForm_add_genre .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_genre .invalid) {
          return;
      }
      var genre =this.reactiveForm_add_genre .value
      this.add_genre (genre )
  }
  // vider le formulaire
  onReset_add_genre () {
      this.submitted = false;
      this.reactiveForm_add_genre .reset();
  }
  add_genre(genre: any) {
      this.loading_add_genre = true;
      this.api.taf_post("genre/add", genre, (reponse: any) => {
      this.loading_add_genre = false;
      if (reponse.status) {
          console.log("Opération effectuée avec succés sur la table genre. Réponse= ", reponse);
          this.onReset_add_genre()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table genre a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_genre = false;
    })
  }
  
  get_details_add_genre_form() {
      this.loading_get_details_add_genre_form = true;
      this.api.taf_post("genre/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table genre. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table genre a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_genre_form = false;
      }, (error: any) => {
      this.loading_get_details_add_genre_form = false;
    })
  }
}
