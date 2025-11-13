import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MensualiteStructureTafType } from '../taf-type/mensualite-structure-taf-type';
@Component({
  selector: 'app-edit-mensualite-structure',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-mensualite-structure.component.html',
  styleUrls: ['./edit-mensualite-structure.component.scss']
})
export class EditMensualiteStructureComponent implements OnInit, OnDestroy {
  reactiveForm_edit_mensualite_structure !: FormGroup;
  submitted: boolean = false
  loading_edit_mensualite_structure: boolean = false
  @Input()
  mensualite_structure_to_edit: MensualiteStructureTafType = new MensualiteStructureTafType();
  form_details: any = {}
  loading_get_details_edit_mensualite_structure_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) {

  }
  ngOnInit(): void {
    console.groupCollapsed("EditMensualiteStructureComponent");
    this.get_details_edit_mensualite_structure_form()
    this.update_form(this.mensualite_structure_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(mensualite_structure_to_edit: any) {
    this.reactiveForm_edit_mensualite_structure = this.formBuilder.group({
      id_structure: [mensualite_structure_to_edit.id_structure],
      libelle_mensualite: [mensualite_structure_to_edit.libelle_mensualite],
      description_mensualite: [mensualite_structure_to_edit.description_mensualite],
      montant_total: [mensualite_structure_to_edit.montant_total],

    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_mensualite_structure.controls; }
  // validation du formulaire
  onSubmit_edit_mensualite_structure() {
    this.submitted = true;
    console.log(this.reactiveForm_edit_mensualite_structure.value)
    // stop here if form is invalid
    if (this.reactiveForm_edit_mensualite_structure.invalid) {
      return;
    }
    var mensualite_structure = this.reactiveForm_edit_mensualite_structure.value
    mensualite_structure.updated_by = this.api.user_connected.id_utilisateur;
    this.edit_mensualite_structure({
      condition: { id_mensualite_structure: this.mensualite_structure_to_edit.id_mensualite_structure },
      data: mensualite_structure
    })
  }
  // vider le formulaire
  onReset_edit_mensualite_structure() {
    this.submitted = false;
    this.reactiveForm_edit_mensualite_structure.reset();
  }
  edit_mensualite_structure(mensualite_structure: any) {
    this.loading_edit_mensualite_structure = true;
    this.api.taf_post("mensualite_structure/edit", mensualite_structure, (reponse: any) => {
      if (reponse.status) {
        this.activeModal.close(reponse)
        console.log("Opération effectuée avec succés sur la table mensualite_structure. Réponse= ", reponse);
        //this.onReset_edit_mensualite_structure()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table mensualite_structure a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_edit_mensualite_structure = false;
    }, (error: any) => {
      this.loading_edit_mensualite_structure = false;
    })
  }
  get_details_edit_mensualite_structure_form() {
    this.loading_get_details_edit_mensualite_structure_form = true;
    this.api.taf_post("mensualite_structure/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table mensualite_structure. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table mensualite_structure a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_edit_mensualite_structure_form = false;
    }, (error: any) => {
      this.loading_get_details_edit_mensualite_structure_form = false;
    })
  }
}