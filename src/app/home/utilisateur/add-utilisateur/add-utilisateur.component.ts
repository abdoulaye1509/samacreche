import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../service/api/api.service';

@Component({
  selector: 'app-add-utilisateur',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './add-utilisateur.component.html',
  styleUrls: ['./add-utilisateur.component.scss']
})
export class AddUtilisateurComponent implements OnInit, OnDestroy {
  reactiveForm_add_utilisateur!: FormGroup;

  submitted = false;
  loading_add_utilisateur = false;
  loading_get_details_add_utilisateur_form = false;

  // type_privilege
  readonly TYPE_PRIVILEGE_DEV = 1;
  readonly TYPE_PRIVILEGE_CRECHE = 2;

  // listes utilisées par les ng-select
  form_details: any = {
    genres: [],
    groupes_sanguins: [],
    statuts_utilisateur: [],
    structures: [],
    privileges: []
  };

  constructor(
    private fb: FormBuilder,
    public api: ApiService,
    public activeModal: NgbActiveModal
  ) {}

  async ngOnInit(): Promise<void> {
    console.groupCollapsed('AddUtilisateurComponent');

    // si ta méthode existe ; sinon enlève ces 2 lignes
    if (typeof (this.api as any).ensure_user_connected === 'function') {
      await (this.api as any).ensure_user_connected();
    }

    console.warn('User connected:', this.api.user_connected);

    this.init_form();
    this.get_details_add_utilisateur_form();
  }

  ngOnDestroy(): void {
    console.groupEnd();
  }

  get f(): any {
    return this.reactiveForm_add_utilisateur.controls;
  }

  super_admin(): boolean {
    return Number(this.api.user_connected?.id_privilege) === 1;
  }

  init_form() {
    this.reactiveForm_add_utilisateur = this.fb.group({
      // Général
      id_genre: [null, Validators.required],
      id_groupe_sanguin: [null],
      prenom_utilisateur: ['', Validators.required],
      nom_utilisateur: ['', Validators.required],
      date_naissance: [''],
      profil_utilisateur: [''],

      // Contact
      telephone_utilisateur: ['', Validators.required],
      email_utilisateur: ['', [Validators.required, Validators.email]],
      adresse_utilisateur: [''],

      // Affectation
      id_structure: [null, Validators.required],
      id_privilege: [null, Validators.required],
      id_statut_utilisateur: [1, Validators.required],

      // Sécurité
      mot_de_passe: ['', Validators.required]
    });

    // Non-superadmin : structure forcée + verrouillage du champ
    if (!this.super_admin() && this.api.user_connected?.id_structure) {
      this.reactiveForm_add_utilisateur.patchValue({
        id_structure: Number(this.api.user_connected.id_structure)
      });
      this.reactiveForm_add_utilisateur.get('id_structure')?.disable();
    }
  }

  get_details_add_utilisateur_form() {
    this.loading_get_details_add_utilisateur_form = true;

    this.api.taf_post(
      'utilisateur/get_form_details',
      {},
      (reponse: any) => {
        this.loading_get_details_add_utilisateur_form = false;

        if (!reponse?.status) {
          this.api.Swal_error("Impossible de charger les détails du formulaire");
          return;
        }

        const data = reponse.data || {};

        // mapping selon tes clés (d’après tes logs)
        this.form_details.genres = data.les_genres || [];
        this.form_details.groupes_sanguins = data.les_groupe_sanguins || data.les_groupes_sanguins || [];
        this.form_details.statuts_utilisateur = data.les_statut_utilisateurs || data.les_statut_utilisateur || [];
        this.form_details.structures = data.les_structures || [];
        const privilegesAll = data.les_privileges || [];

        // ✅ FILTRAGE PRIVILEGES (privilèges CRECHE globaux)
        if (this.super_admin()) {
          // superadmin : voit tout
          this.form_details.privileges = privilegesAll;
        } else {
          // admin crèche : voit uniquement CRECHE (id_type_privilege=2) + jamais superadmin
          this.form_details.privileges = privilegesAll.filter((p: any) =>
            Number(p.id_privilege) !== 1 &&
            Number(p.id_type_privilege) === this.TYPE_PRIVILEGE_CRECHE
          );
        }

        // Pré-sélection structure (non-superadmin)
        if (!this.super_admin() && this.api.user_connected?.id_structure) {
          this.reactiveForm_add_utilisateur.patchValue({
            id_structure: Number(this.api.user_connected.id_structure)
          });
        }

        // Pré-sélection privilege par défaut (ex: 4) si présent
        if (!this.reactiveForm_add_utilisateur.get('id_privilege')?.value) {
          const def = this.form_details.privileges.find((p: any) => Number(p.id_privilege) === 4);
          if (def) this.reactiveForm_add_utilisateur.patchValue({ id_privilege: def.id_privilege });
        }

        console.log('Détails form chargés:', this.form_details);
      },
      (error: any) => {
        this.loading_get_details_add_utilisateur_form = false;
        this.api.Swal_error('Erreur réseau ou serveur');
        console.error('Erreur get_form_details:', error);
      }
    );
  }

  onSubmit_add_utilisateur() {
    this.submitted = true;
    if (this.reactiveForm_add_utilisateur.invalid) return;

    const me = this.api.user_connected;
    if (!me?.id_utilisateur) {
      this.api.Swal_error("Utilisateur connecté introuvable. Reconnectez-vous.");
      return;
    }

    // getRawValue() récupère aussi les champs disabled
    const data = this.reactiveForm_add_utilisateur.getRawValue();

    // Sécurité front
    if (!this.super_admin()) {
      data.id_structure = Number(me.id_structure);

      // interdit explicite superadmin
      if (Number(data.id_privilege) === 1) {
        this.api.Swal_error("Vous n'avez pas le droit de créer un superadmin.");
        return;
      }
    }

    // created_by doit venir du token côté backend, mais on peut le laisser ici aussi
    data.created_by = Number(me.id_utilisateur);

    this.add_utilisateur(data);
  }

  add_utilisateur(data: any) {
    this.loading_add_utilisateur = true;

    this.api.taf_post(
      'utilisateur/add_2',
      data,
      (reponse: any) => {
        this.loading_add_utilisateur = false;

        if (reponse?.status) {
          this.api.Swal_success('Utilisateur créé avec succès');
          this.activeModal.close(reponse.data);
        } else {
          this.api.Swal_error(reponse?.erreur || 'Erreur lors de la création');
          console.log('Réponse erreur add_2:', reponse);
        }
      },
      (error: any) => {
        this.loading_add_utilisateur = false;
        this.api.Swal_error("Erreur lors de l'envoi des données");
        console.error('Erreur add utilisateur:', error);
      }
    );
  }
}
