import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IdbService } from '../idb/idb.service';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  local_storage_prefixe = "samacreche.angular";
  taf_base_url = "https://samacreche.jambar.tech/taf/";
private superAdminId = 1;
  network: any = {
    token: undefined,
    status: true,
    message: "Aucun probléme détecté",
  }
  token: any = {
    token_key: null,
    token_decoded: null,
    user_connected: null,
    is_expired: null,
    date_expiration: null
  }
   infos: any = {
    utilisateur: {}, les_structures: [], current_structure: {},
    token_key: null,
    token: { token_key: null, token_decoded: null, user_connected: null, is_expired: null, date_expiration: null },
    les_droits_utilisateur: [],
  };
     placeholderLogo = 'assets/medoc.png'; // mets une petite image locale
loading_get_utilisateur: boolean = false;
  // ⚠️ on garde mais on ne dépend plus de ce champ seul
  les_droits: any[] = [];
   user_connected: any;
  menu: any[] = [];

 full_menu: any[] = [
  {
    name: 'Tableau de bord',
    path: '/home/tableau_de_bord',
    icon: 'bi-speedometer2',
    children: [],
    les_actions: [
      { menu: 'Dashboard', ongle: 'Vue', id: '/home/tableau_de_bord', action: 'Accéder au tableau de bord' }
    ]
  },

  {
    name: 'Enfants',
    path: '/home/enfant',
    icon: 'bi-emoji-smile-fill',
    children: [],
    les_actions: [
      { menu: 'Enfant', ongle: 'Liste', id: 'view_enfant', action: 'Voir la liste des enfants' },
      { menu: 'Enfant', ongle: 'Ajouter', id: 'add_enfant', action: 'Ajouter un enfant' },
      { menu: 'Enfant', ongle: 'Modifier', id: 'edit_enfant', action: 'Modifier un enfant' },
      { menu: 'Enfant', ongle: 'Supprimer', id: 'delete_enfant', action: 'Supprimer un enfant' }
    ]
  },

  {
    name: 'Parents',
    path: '/home/parent',
    icon: 'bi-people-fill',
    children: [],
    les_actions: [
      { menu: 'Parent', ongle: 'Liste', id: 'view_parent', action: 'Voir les parents' },
      { menu: 'Parent', ongle: 'Ajouter', id: 'add_parent', action: 'Ajouter un parent' },
      { menu: 'Parent', ongle: 'Modifier', id: 'edit_parent', action: 'Modifier un parent' },
      { menu: 'Parent', ongle: 'Supprimer', id: 'delete_parent', action: 'Supprimer un parent' }
    ]
  },

  {
    name: 'Équipes',
    path: '/home/equipe',
    icon: 'bi-person-badge-fill',
    children: [],
    les_actions: [
      { menu: 'Equipe', ongle: 'Liste', id: 'view_equipe', action: 'Voir les membres de l’équipe' },
      { menu: 'Equipe', ongle: 'Ajouter', id: 'add_equipe', action: 'Ajouter un membre du personnel' },
      { menu: 'Equipe', ongle: 'Modifier', id: 'edit_equipe', action: 'Modifier un membre du personnel' },
      { menu: 'Equipe', ongle: 'Supprimer', id: 'delete_equipe', action: 'Supprimer un membre du personnel' }
    ]
  },

  {
    name: 'Activités',
    path: '/home/activite',
    icon: 'bi-brush-fill',
    children: [],
    les_actions: [
      { menu: 'Activité', ongle: 'Liste', id: 'view_activite', action: 'Voir les activités' },
      { menu: 'Activité', ongle: 'Ajouter', id: 'add_activite', action: 'Ajouter une activité' },
      { menu: 'Activité', ongle: 'Modifier', id: 'edit_activite', action: 'Modifier une activité' },
      { menu: 'Activité', ongle: 'Supprimer', id: 'delete_activite', action: 'Supprimer une activité' }
    ]
  },

  {
    name: 'Plannings',
    path: '/home/planning',
    icon: 'bi-calendar-week-fill',
    children: [
      { name: 'Planning Enfants', path: '/home/planning/enfant', icon: 'bi-calendar-heart-fill' },
      { name: 'Planning Équipes', path: '/home/planning/equipe', icon: 'bi-calendar-check-fill' }
    ],
    les_actions: [
      { menu: 'Planning', ongle: 'Vue', id: '/home/planning', action: 'Accéder au planning' }
    ]
  },

  {
    name: 'Galerie',
    path: '/home/galerie',
    icon: 'bi-images',
    children: [],
    les_actions: [
      { menu: 'Galerie', ongle: 'Liste', id: 'view_galerie', action: 'Voir la galerie' },
      { menu: 'Galerie', ongle: 'Ajouter', id: 'add_galerie', action: 'Ajouter une photo ou vidéo' },
      { menu: 'Galerie', ongle: 'Supprimer', id: 'delete_galerie', action: 'Supprimer un média' }
    ]
  },

  {
    name: 'Facturation',
    path: '/home/facturation',
    icon: 'bi-receipt-cutoff',
    children: [],
    les_actions: [
      { menu: 'Facturation', ongle: 'Liste', id: 'view_facturation', action: 'Voir les factures' },
      { menu: 'Facturation', ongle: 'Créer', id: 'add_facturation', action: 'Créer une facture' },
      { menu: 'Facturation', ongle: 'Modifier', id: 'edit_facturation', action: 'Modifier une facture' },
      { menu: 'Facturation', ongle: 'Supprimer', id: 'delete_facturation', action: 'Supprimer une facture' }
    ]
  },

  {
    name: 'Honoraires',
    path: '/home/honoraire',
    icon: 'bi-cash-coin',
    children: [],
    les_actions: [
      { menu: 'Honoraire', ongle: 'Liste', id: 'view_honoraire', action: 'Voir les honoraires' },
      { menu: 'Honoraire', ongle: 'Ajouter', id: 'add_honoraire', action: 'Ajouter un honoraire' },
      { menu: 'Honoraire', ongle: 'Modifier', id: 'edit_honoraire', action: 'Modifier un honoraire' },
      { menu: 'Honoraire', ongle: 'Supprimer', id: 'delete_honoraire', action: 'Supprimer un honoraire' }
    ]
  },

  {
    name: 'Structures',
    path: '/home/structure',
    icon: 'bi-building',
    children: [],
    les_actions: [
      { menu: 'Structure', ongle: 'Liste', id: 'view_structure', action: 'Voir les structures' },
      { menu: 'Structure', ongle: 'Ajouter', id: 'add_structure', action: 'Ajouter une structure' },
      { menu: 'Structure', ongle: 'Modifier', id: 'edit_structure', action: 'Modifier une structure' },
      { menu: 'Structure', ongle: 'Supprimer', id: 'delete_structure', action: 'Supprimer une structure' }
    ]
  },

  {
    name: 'Paramètres',
    path: '/home/parametre',
    icon: 'bi-gear-fill',
    children: [
      { name: 'Genre', path: '/home/parametre/genre', icon: 'bi-gender-ambiguous' },
      { name: 'Pays', path: '/home/parametre/pays', icon: 'bi-globe2' },
      { name: 'Statut Structure', path: '/home/parametre/statut_structure', icon: 'bi-building-check' },
      { name: 'Statut Utilisateur', path: '/home/parametre/statut_utilisateur', icon: 'bi-person-check-fill' },
      { name: 'Privilèges', path: '/home/parametre/privilege', icon: 'bi-shield-lock-fill' },
      { name: 'Mensualités', path: '/home/parametre/mensualite', icon: 'bi-calendar-month-fill' },
      { name: 'Liens de parenté', path: '/home/parametre/lien_parente', icon: 'bi-people' }
    ],
    les_actions: [
      { menu: 'Paramètre', ongle: 'Vue', id: '/home/parametre', action: 'Accéder aux paramètres' }
    ]
  },

  {
    name: 'Profil',
    path: '/home/profil',
    icon: 'bi-person-circle',
    children: [],
    les_actions: [
      { menu: 'Profil', ongle: 'Profil', id: '/home/profil', action: 'Voir le profil' },
      { menu: 'Profil', ongle: 'Modifier', id: 'edit_profil', action: 'Modifier le profil' },
      { menu: 'Profil', ongle: 'MotDePasse', id: 'change_password', action: 'Changer le mot de passe' }
    ]
  }
];

  constructor(private http: HttpClient, private route: Router, private idb: IdbService) { }
  // sauvegardes
  async get_from_local_storage(key: string): Promise<any> {
    try {
      let res: any = await this.idb.get_from_indexedDB(key)
      return res
    } catch (error) {
      console.error("erreur de recuperation", error)
      return null
    }
  }
  async save_on_local_storage(key: string, value: any): Promise<void> {
    await this.idb.save_on_indexedDB(key, value);
  }
  async delete_from_local_storage(key: string) {
    await this.idb.delete_from_indexedDB(key);
  }

  async get_token() {
    //le token n'est pas encore chargé
    if (this.network.token == undefined) {
      this.network.token = await this.get_from_local_storage("token")
      if (this.network.token != undefined && this.network.token != null) {// token existant
        this.update_data_from_token()// mise a jour du token
      }
    } else {// token dèja chargé
      this.update_data_from_token()// mise a jour du token
    }
    return this.network.token
  }
  //les requetes http
  async taf_get(path: string, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + await this.get_token(),
      })
    };

    this.http.get(api_url, httpOptions).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_get_error(error, on_error)
      }
    )
  }
  on_taf_get_error(error: any, on_error: Function) {
    this.network.status = false;
    this.network.message = error
    this.Swal_info("Merci de vérifier votre connexion")
    on_error(error)
  }
  async taf_post(path: string, data_to_send: any, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + await this.get_token(),
      })
    };
    this.http.post(api_url, data_to_send, httpOptions).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_post_error(error, on_error)
      }
    )
  }
  async taf_post_login(path: string, data_to_send: any, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;
    
    this.http.post(api_url, data_to_send).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_post_error(error, on_error)
      }
    )
  }
  on_taf_post_error(error: any, on_error: any) {
    this.network.status = false;
    this.network.message = error
    this.Swal_info("Merci de vérifier votre connexion")
    on_error(error)
  }
  async update_data_from_token() {
    let token_key = await this.get_from_local_storage("token")
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token_key);
    const expirationDate = helper.getTokenExpirationDate(token_key);
    const isExpired = helper.isTokenExpired(token_key);

    this.token = {
      token_key: token_key,
      token_decoded: decodedToken,
      user_connected: decodedToken.taf_data,
      is_expired: isExpired,
      date_expiration: expirationDate
    }
    if (this.token.is_expired) {
      this.on_token_expire()
    }
  }
  on_token_expire() {
    this.Swal_info("Votre session s'est expiré! Veuillez vous connecter à nouveau")
    this.delete_from_local_storage("token")
    this.route.navigate(['/public/login'])
  }

  Swal_success(title: any) {
    let succes = Swal.fire({
      title: title,
      icon: "success"
    });
    return succes
  }

  Swal_error(title: any) {
    let error = Swal.fire({
      title: title,
      icon: "error"
    });
    return error
  }
  Swal_info(title: any) {
    let info = Swal.fire({
      title: title,
      icon: "info"
    });
    return info
  }


  deconnexion() {
    this.delete_from_local_storage('token');
    this.les_droits = [];
    this.menu = [];
    this.token = { token_key: null, token_decoded: null, user_connected: null, is_expired: null, date_expiration: null };
    this.route.navigate(['/']);
  }

  // ---------- DROITS (source unique)
  private parseMaybeString(x: any): any[] {
    if (!x) return [];
    if (Array.isArray(x)) return x;
    try { const j = JSON.parse(x); return Array.isArray(j) ? j : []; } catch { return []; }
  }

  /** renvoie toujours le set de droits effectif, que ça vienne de les_droits OU de infos.les_droits_utilisateur */
  effectiveDroits(): any[] {
    const a = this.parseMaybeString(this.les_droits);
    if (a.length) return a;
    return this.parseMaybeString(this.infos?.les_droits_utilisateur);
  }

can(id: string) {
  console.log(this.infos.token.user_connected, 'user_connected');
    if (this.infos.token.user_connected.id_utilisateur == 1) {// ne pas restreindre les droits de l'administrateur JANT TECH support
      return true
    }
    return this.les_droits.some((a: any) =>
      a.id === id || a.id.includes(id) || id.includes(a.id)
    );
  }
  custom_menu() {
    this.menu = this.full_menu.filter((one: any) => {// pour chaque module
      return this.can(one.path)
    })
    console.log(this.menu, 'menuFalll');
    //.filter((one: any) => one.items.length > 0)// filtrer la module non vide
  }



  // ---------- infos
  async update_infos(new_infos?: any) {
    if (!new_infos) {
      this.infos = await this.get_from_local_storage('infos');
    } else if (!new_infos.token_key) {
      this.infos.utilisateur = new_infos.utilisateur;
      this.infos.les_structures = new_infos.les_structures;
      const idx = this.infos.les_structures.findIndex((s: any) => s.id_structure == this.infos.current_structure?.id_structure);
      this.infos.current_structure = this.infos.les_structures[idx || 0];
      // si les droits utilisateur sont déjà donnés, garde-les
      this.infos.les_droits_utilisateur = this.parseMaybeString(this.infos.utilisateur?.les_droits_utilisateur);
    } else {
      this.infos = new_infos;
      const helper = new JwtHelperService();
      const tk = this.infos.token_key;
      this.infos.token = {
        token_key: tk,
        token_decoded: helper.decodeToken(tk),
        user_connected: helper.decodeToken(tk)?.taf_data,
        is_expired: helper.isTokenExpired(tk),
        date_expiration: helper.getTokenExpirationDate(tk),
      };
      this.infos.current_structure = this.infos.les_structures?.[0] || {};
      this.infos.les_droits_utilisateur = this.parseMaybeString(this.infos.utilisateur?.les_droits_utilisateur);
    }

    await this.save_on_local_storage('infos', this.infos);
    // reconstruit le menu à partir des droits effectifs
    this.custom_menu();
  }

  async ensure_infos(): Promise<any | null> {
    const existing = await this.get_from_local_storage('infos');
    if (existing) { this.infos = existing; this.custom_menu(); return existing; }
    const tk = await this.get_token();
    if (!tk) return null;
    const droits = (await this.get_from_local_storage('les_droits')) || [];
    await this.update_infos({ token_key: tk, utilisateur: { les_droits_utilisateur: JSON.stringify(droits) }, les_structures: [] });
    return this.infos;
  }
}