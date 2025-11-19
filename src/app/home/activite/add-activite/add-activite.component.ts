import { Component, EventEmitter, Output, OnDestroy, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule, NgClass } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ActiviteTafType } from '../taf-type/activite-taf-type';
@Component({
  selector: 'app-add-activite',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule,NgClass,FormsModule], // Dépendances importées
  templateUrl: './add-activite.component.html',
  styleUrls: ['./add-activite.component.scss']
})
export class AddActiviteComponent implements OnInit {
  reactiveForm_add_activite !: FormGroup;
  submitted: boolean = false
  loading_add_activite: boolean = false
  form_details: any = {}
  loading_get_details_add_activite_form = false
  form: any[] = []
  @Input()
  id_enfant = 0
  date_activite: string = '';
  heure_activite: string = '';
    loading_get_activite = false
  activite: ActiviteTafType[] = [];

  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) 
  { 
     this.form = JSON.parse(JSON.stringify(api.form))
    console.log("form = ",this.form)
    console.log("api.form = ",this.api.form)
  }
    ngOnInit(): void {
    const now = new Date();
    this.date_activite  = now.toISOString().slice(0, 10);  // YYYY-MM-DD
    this.heure_activite = now.toTimeString().slice(0, 5);  // HH:mm
  }
    get disabled(): boolean {
    return this.loading_add_activite || !this.date_activite || !this.id_enfant;
  }
  form_change() {
    console.log("form= ", this.form)
    console.log("api.form = ",this.api.form)
  }
   valider() {
    const data = {
      created_by: this.api.token.user_connected.id_utilisateur,
      id_structure: this.api.token.user_connected.id_structure,
      id_enfant: this.id_enfant,
      date_activite: this.date_activite,
      heure_activite: this.heure_activite || null,
      contenu: JSON.stringify(this.form)
    };
    this.add_activite(data);
  }
  reset() {
    this.date_activite= '';
    this.form = JSON.parse(JSON.stringify(this.api.form))
  }

   add_activite(activite: any) {
    this.loading_add_activite = true;
    this.api.taf_post("activite/add", activite, (reponse: any) => {
      this.loading_add_activite = false;
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table activite. Réponse= ", reponse);
        this.api.Swal_success("Opération éffectuée avec succés")
        this.activeModal.close(reponse)
      } else {
        console.log("L'opération sur la table activite a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
      this.loading_add_activite = false;
    })
  }
  get_activite() {
    let params = { id_enfant: this.id_enfant }// les conditions à mettre ici
    this.loading_get_activite = true;
    this.api.taf_post("activite/get", params, (reponse: any) => {
      //when success
      if (reponse.status) {
        this.api.les_activites = reponse.data
        console.log("Opération effectuée avec succés sur la table activite. Réponse= ", reponse);
      } else {
        console.log("L\'opération sur la table activite a échoué. Réponse= ", reponse);
      }
      this.loading_get_activite = false;
    },
      (error: any) => {
        //when error
        this.loading_get_activite = false;
        console.log("Erreur inconnue! ", error);
      })
  }
}
