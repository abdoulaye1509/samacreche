import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list-login.component.html',
  styleUrls: ['./list-login.component.scss'],
})
export class ListLoginComponent implements OnInit, OnDestroy {
  reactiveForm_login_login!: FormGroup;
  submitted = false;
  loading_login_login = false;

  showPassword = false;
  togglePasswordVisibility() { this.showPassword = !this.showPassword; }

  constructor(
    private formBuilder: FormBuilder,
    public api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void { this.init_form(); }
  ngOnDestroy(): void {}

  init_form() {
    this.reactiveForm_login_login = this.formBuilder.group({
      login: ['', Validators.required],
      pwd: ['', Validators.required],
    });
  }

  get f(): any { return this.reactiveForm_login_login.controls; }

  onSubmit_login_login() {
    this.submitted = true;
    if (this.reactiveForm_login_login.invalid) return;
    const login = this.reactiveForm_login_login.value;
    this.login_login(login);
  }

  onReset_login_login() {
    this.submitted = false;
    this.reactiveForm_login_login.reset();
  }

  private normalizeLesDroits(raw: any): any[] {
    if (Array.isArray(raw)) return raw;

    if (raw && typeof raw === 'object' && 'les_droits' in raw) {
      try {
        const v: any = (raw as any).les_droits;
        const first = typeof v === 'string' ? JSON.parse(v) : v;
        return Array.isArray(first) ? first : (typeof first === 'string' ? JSON.parse(first) : []);
      } catch { return []; }
    }

    if (typeof raw === 'string') {
      try {
        const first = JSON.parse(raw);
        return Array.isArray(first) ? first : (typeof first === 'string' ? JSON.parse(first) : []);
      } catch { return []; }
    }
    return [];
  }

  // login_login(login: any) {
  //   this.loading_login_login = true;
  //   // Remets 'taf_auth/auth' si ton backend n'a pas 'auth2'
  //   this.api.taf_post_login('taf_auth/auth2', login, async (reponse: any) => {
  //     try {
  //       if (reponse?.status) {
  //         // 1) token
  //         await this.api.save_on_local_storage('token', reponse.data);

  //         // 2) droits
  //         const droits = this.normalizeLesDroits(reponse?.les_droits) || [];
  //         this.api.les_droits = droits;
  //         await this.api.save_on_local_storage('les_droits', droits);

  //         // 3) seed 'infos' pour usage futur
  //         await this.api.update_infos({
  //           token_key: reponse.data,
  //           utilisateur: { les_droits_utilisateur: JSON.stringify(droits) },
  //           les_structures: reponse?.les_structures || [],
  //         });

  //         // 4) refresh contexte + menu
  //         await this.api.update_data_from_token();
  //         this.api.custom_menu();

  //         this.api.Swal_success('Opération éffectuée avec succès');
  //         this.onReset_login_login();

  //         // 5) retour vers la page demandée
  //         const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
  //         this.router.navigateByUrl(returnUrl);
  //       } else {
  //         this.api.Swal_error("L'opération a échoué");
  //       }
  //     } finally {
  //       this.loading_login_login = false;
  //     }
  //   }, (_err: any) => {
  //     this.loading_login_login = false;
  //   });
  // }
login_login(login: any) {
  this.loading_login_login = true;

  this.api.taf_post_login('taf_auth/auth2', login, async (reponse: any) => {
    try {
      console.log('Réponse auth2 = ', reponse);

      if (reponse?.status) {
        // 1) token
        await this.api.save_on_local_storage('token', reponse.data);

        // 2) droits depuis auth2.php
        const droits = this.normalizeLesDroits(reponse?.les_droits) || [];
        console.log('Droits reçus du backend = ', droits);

        this.api.les_droits = droits;
        await this.api.save_on_local_storage('les_droits', droits);

        // 3) seed "infos" (pour AuthGuard & co)
        await this.api.update_infos({
          token_key: reponse.data,
          utilisateur: { les_droits_utilisateur: JSON.stringify(droits) },
          les_structures: reponse?.les_structures || [],
        });

        // 4) refresh token + menu
        await this.api.update_data_from_token();
        this.api.custom_menu();
        console.log('Menu après login = ', this.api.menu);

        this.api.Swal_success('Opération éffectuée avec succès');
        this.onReset_login_login();

        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
        this.router.navigateByUrl(returnUrl);
      } else {
        this.api.Swal_error("L'opération a échoué");
      }
    } finally {
      this.loading_login_login = false;
    }
  }, (_err: any) => {
    this.loading_login_login = false;
  });
}

  
}
