import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../../service/api/api.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  logoSrc = this.api.placeholderLogo;

  constructor(public api: ApiService) {}

  async ngOnInit() {
    // s’assure que user_connected est rempli (mémoire ou cache)
    await this.api.ensure_user_connected();
  }

  get logoUrl(): string {
    const path =
      this.api.user_connected?.logo_structure ||          // complet depuis utilisateur/auth
      this.api.infos?.current_structure?.logo_structure || // fallback
      '';

    const url = this.api.resolveFileUrl(path);
    return url || this.api.placeholderLogo;
  }
}
