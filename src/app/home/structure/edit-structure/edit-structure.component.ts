import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { StructureTafType } from '../taf-type/structure-taf-type';
@Component({
  selector: 'app-edit-structure',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-structure.component.html',
  styleUrls: ['./edit-structure.component.scss']
})
export class EditStructureComponent implements OnInit, OnDestroy {
  reactiveForm_edit_structure !: FormGroup;
  submitted: boolean = false
  loading_edit_structure: boolean = false
  @Input()
  structure_to_edit: StructureTafType = new StructureTafType();
  form_details: any = {}
  loading_get_details_edit_structure_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditStructureComponent");
      this.get_details_edit_structure_form()
      this.update_form(this.structure_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(structure_to_edit:any) {
      this.reactiveForm_edit_structure = this.formBuilder.group({
          id_statut_structure : [structure_to_edit.id_statut_structure],
nom_structure : [structure_to_edit.nom_structure],
adresse_structure : [structure_to_edit.adresse_structure],
telephone_structure : [structure_to_edit.telephone_structure],
longitude : [structure_to_edit.longitude],
latitude : [structure_to_edit.latitude],
logo_structure : [structure_to_edit.logo_structure],
updated_at : [structure_to_edit.updated_at],
created_by : [structure_to_edit.created_by],
updated_by : [structure_to_edit.updated_by]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_structure .controls; }
  // validation du formulaire
  onSubmit_edit_structure() {
      this.submitted = true;
      console.log(this.reactiveForm_edit_structure.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_structure.invalid) {
          return;
      }
      var structure = this.reactiveForm_edit_structure.value
      this.edit_structure({
      condition:{id_structure:this.structure_to_edit.id_structure},
      data:structure
      })
  }
  // vider le formulaire
  onReset_edit_structure() {
      this.submitted = false;
      this.reactiveForm_edit_structure.reset();
  }
  edit_structure(structure: any) {
      this.loading_edit_structure = true;
      this.api.taf_post("structure/edit", structure, (reponse: any) => {
          if (reponse.status) {
              this.activeModal.close(reponse)
              console.log("Opération effectuée avec succés sur la table structure. Réponse= ", reponse);
              //this.onReset_edit_structure()
              this.api.Swal_success("Opération éffectuée avec succés")
          } else {
              console.log("L'opération sur la table structure a échoué. Réponse= ", reponse);
              this.api.Swal_error("L'opération a echoué")
          }
          this.loading_edit_structure = false;
      }, (error: any) => {
          this.loading_edit_structure = false;
      })
  }
  get_details_edit_structure_form() {
      this.loading_get_details_edit_structure_form = true;
      this.api.taf_post("structure/get_form_details", {}, (reponse: any) => {
        if (reponse.status) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table structure. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table structure a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_edit_structure_form = false;
      }, (error: any) => {
      this.loading_get_details_edit_structure_form = false;
    })
  }
}