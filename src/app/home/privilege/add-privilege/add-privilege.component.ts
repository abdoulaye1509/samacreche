import { Component, EventEmitter, Output, OnDestroy, OnInit, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { PrivilegeTafType } from '../taf-type/privilege-taf-type';

interface Action { id: string, action: string, menu: string, ongle: string, checked?: boolean }
interface Menu { name: string, url: string, iconComponent: { name: string }, les_actions: Action[], children?: any[] }
@Component({
  selector: 'app-add-privilege',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, FormsModule], // Dépendances importées
  templateUrl: './add-privilege.component.html',
  styleUrls: ['./add-privilege.component.scss']
})
export class AddPrivilegeComponent implements OnInit, OnDestroy {
  reactiveForm_add_privilege !: FormGroup;
  submitted: boolean = false
  loading_add_privilege: boolean = false
  form_details: any = {}
  loading_get_details_add_privilege_form = false
  full_menu_copie: Menu[] = []; //this.api.full_menu;
  les_droits: Action[] = [];

  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { }


ngOnInit(): void {
    this.full_menu_copie = [...this.api.full_menu].map((one_menu: Menu) => {
      one_menu.les_actions = one_menu.les_actions.map((one_action: Action) => {
        one_action.checked = (this.les_droits || []).some((droit: Action) => droit.id === one_action.id);
        return one_action
      });
      return one_menu
    });
    this.init_form();
  }


  ngOnDestroy(): void {
    console.groupEnd();
  }
    init_form() {
    this.reactiveForm_add_privilege = this.formBuilder.group({
      nom_privilege: ['', Validators.required],
      description_privilege: ['',],
    });
  }

  toggleDroit(action: Action): void {
    if (action.checked) {
      if (!this.les_droits.some((droit) => droit.id === action.id)) {
        this.les_droits.push(action);
      }
    } else {
      this.les_droits = this.les_droits.filter((droit) => droit.id !== action.id);
    }
    console.log('Droits sélectionnés:', this.les_droits);
  }
  retirerDroit(droit: Action): void {
    this.les_droits = this.les_droits.filter((d) => d.id !== droit.id);
    this.full_menu_copie.forEach((one_menu) => {
      one_menu.les_actions.forEach((one_action) => {
        if (one_action.id === droit.id) {
          one_action.checked = false;
        }
      });
    });
    console.log('Droits après suppression:', this.les_droits);
  }


  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_privilege.controls; }


  onSubmit_add_privilege() {
    this.submitted = true;
    console.log("onSubmit_add_privilege");

    if (this.reactiveForm_add_privilege.invalid) {
      console.log('Form is invalid:', this.reactiveForm_add_privilege.errors);
      return;
    }

    // Convert les_droits to JSON string, including menu and ongle
    const droitsAsText = JSON.stringify(this.les_droits);

    const privilege = {
      nom_privilege: this.reactiveForm_add_privilege.get('nom_privilege')?.value,
      description_privilege: this.reactiveForm_add_privilege.get('description_privilege')?.value,
      les_droits: droitsAsText,
      id_structure: this.api.user_connected.id_structure
    };

    console.log('Data to send:', privilege);
    this.add_privilege(privilege);
  }
  // vider le formulaire
  onReset_add_privilege() {
    this.submitted = false;
    this.reactiveForm_add_privilege.reset();
  }
  add_privilege(privilege: any) {
    this.loading_add_privilege = true;
    this.api.taf_post("privilege/add", privilege, (reponse: any) => {
      this.loading_add_privilege = false;
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table privilege. Réponse= ", reponse);
        this.onReset_add_privilege()
        this.api.Swal_success("Opération éffectuée avec succés")
        this.activeModal.close(reponse)
      } else {
        console.log("L'opération sur la table privilege a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
      this.loading_add_privilege = false;
    })
  }

  get_details_add_privilege_form() {
    this.loading_get_details_add_privilege_form = true;
    this.api.taf_post("privilege/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table privilege. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table privilege a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_add_privilege_form = false;
    }, (error: any) => {
      this.loading_get_details_add_privilege_form = false;
    })
  }
 isAllChecked(menu: Menu): boolean {
  const actions = menu.les_actions || [];
  if (!actions.length) return false;
  return actions.every(a => !!a.checked);
}

toggleAllForMenu(menu: Menu, event: Event): void {
  const input = event.target as HTMLInputElement | null;
  const checked = !!input?.checked;    // évite "possibly null"

  const actions = menu.les_actions || [];

  actions.forEach(action => {
    action.checked = checked;

    if (checked) {
      if (!this.les_droits.some(d => d.id === action.id)) {
        this.les_droits.push(action);
      }
    } else {
      this.les_droits = this.les_droits.filter(d => d.id !== action.id);
    }
  });

  console.log('Droits après toggleAllForMenu:', this.les_droits);
}

}