import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

interface Action { id: string, action: string, menu: string, ongle: string, checked?: boolean }
interface Menu { name: string, url: string, iconComponent: { name: string }, les_actions: Action[], children?: any[] }

@Component({
  selector: 'app-add-privilege',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, FormsModule],
  templateUrl: './add-privilege.component.html',
  styleUrls: ['./add-privilege.component.scss']
})
export class AddPrivilegeComponent implements OnInit, OnDestroy {
  reactiveForm_add_privilege!: FormGroup;

  submitted = false;
  loading_add_privilege = false;

  full_menu_copie: Menu[] = [];
  les_droits: Action[] = [];

  // ✅ Constantes types
  readonly TYPE_PRIVILEGE_DEV = 1;
  readonly TYPE_PRIVILEGE_CRECHE = 2;

  constructor(
    private formBuilder: FormBuilder,
    public api: ApiService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    // copie du menu + sync checked
    this.full_menu_copie = [...this.api.full_menu].map((one_menu: Menu) => {
      one_menu.les_actions = (one_menu.les_actions || []).map((one_action: Action) => {
        one_action.checked = (this.les_droits || []).some((droit: Action) => droit.id === one_action.id);
        return one_action;
      });
      return one_menu;
    });

    this.init_form();
    this.onTypePrivilegeChange();
  }

  ngOnDestroy(): void {}

  init_form() {
    this.reactiveForm_add_privilege = this.formBuilder.group({
      nom_privilege: ['', Validators.required],
      description_privilege: [''],

      // ✅ nouveau champ
      id_type_privilege: [this.TYPE_PRIVILEGE_CRECHE, Validators.required],
    });
  }

  get f(): any { return this.reactiveForm_add_privilege.controls; }

  // ✅ quand on change le type : on ajuste le comportement
  onTypePrivilegeChange(): void {
    const type = Number(this.reactiveForm_add_privilege.get('id_type_privilege')?.value);

    // (optionnel) si DEV, tu peux prévenir visuellement
    if (type === this.TYPE_PRIVILEGE_DEV) {
      // tu peux aussi vider les droits si tu veux un set dédié dev
      // this.les_droits = [];
    }
  }

  // ----- DROITS -----
  toggleDroit(action: Action): void {
    if (action.checked) {
      if (!this.les_droits.some((droit) => droit.id === action.id)) this.les_droits.push(action);
    } else {
      this.les_droits = this.les_droits.filter((droit) => droit.id !== action.id);
    }
  }

  retirerDroit(droit: Action): void {
    this.les_droits = this.les_droits.filter((d) => d.id !== droit.id);
    this.full_menu_copie.forEach((one_menu) => {
      one_menu.les_actions.forEach((one_action) => {
        if (one_action.id === droit.id) one_action.checked = false;
      });
    });
  }

  isAllChecked(menu: Menu): boolean {
    const actions = menu.les_actions || [];
    if (!actions.length) return false;
    return actions.every(a => !!a.checked);
  }

  toggleAllForMenu(menu: Menu, event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const checked = !!input?.checked;
    const actions = menu.les_actions || [];

    actions.forEach(action => {
      action.checked = checked;

      if (checked) {
        if (!this.les_droits.some(d => d.id === action.id)) this.les_droits.push(action);
      } else {
        this.les_droits = this.les_droits.filter(d => d.id !== action.id);
      }
    });
  }

  // ----- SUBMIT -----
  onSubmit_add_privilege() {
    this.submitted = true;
    if (this.reactiveForm_add_privilege.invalid) return;

    const type = Number(this.reactiveForm_add_privilege.get('id_type_privilege')?.value);

    // droits -> JSON
    const droitsAsText = JSON.stringify(this.les_droits || []);

    // ✅ id_structure selon type
    const id_structure =
      (type === this.TYPE_PRIVILEGE_DEV)
        ? null
        : Number(this.api.user_connected?.id_structure);

    const privilege: any = {
      nom_privilege: this.reactiveForm_add_privilege.get('nom_privilege')?.value,
      description_privilege: this.reactiveForm_add_privilege.get('description_privilege')?.value,
      les_droits: droitsAsText,
      id_type_privilege: type,
      id_structure: id_structure
    };

    this.add_privilege(privilege);
  }

  onReset_add_privilege() {
    this.submitted = false;
    this.reactiveForm_add_privilege.reset({
      nom_privilege: '',
      description_privilege: '',
      id_type_privilege: this.TYPE_PRIVILEGE_CRECHE
    });
    this.les_droits = [];
    this.full_menu_copie.forEach(m => m.les_actions.forEach(a => a.checked = false));
  }

  add_privilege(privilege: any) {
    this.loading_add_privilege = true;

    this.api.taf_post("privilege/add", privilege, (reponse: any) => {
      this.loading_add_privilege = false;

      if (reponse?.status) {
        this.onReset_add_privilege();
        this.api.Swal_success("Opération éffectuée avec succés");
        this.activeModal.close(reponse);
      } else {
        this.api.Swal_error("L'opération a échoué");
        console.log("Réponse:", reponse);
      }
    }, (_error: any) => {
      this.loading_add_privilege = false;
      this.api.Swal_error("Erreur réseau");
    });
  }
}
