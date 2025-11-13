import { Component, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../../service/api/api.service';

@Component({
  selector: 'app-parametre',
  standalone: true,
  imports: [CommonModule,RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './parametre.component.html',
  styleUrl: './parametre.component.scss'
})
export class ParametreComponent {
 selectedItem: any = null;
  selectedComponent: Type<any> | null = null;
  sous_module: any[] = []
  modulesOpen = true;

  constructor(public api: ApiService){}


  ngOnInit(): void {
    // Exemple : injecté depuis ApiService
    this.sous_module = this.getAllChildren(this.api.full_menu);
    console.log("sous_module = ", this.sous_module);

  }


  getAllChildren(menu: any[]): any[] {
    return menu.flatMap(item =>
      item.children ? [...item.children, ...this.getAllChildren(item.children)] : []
    );
  }

  toggleModules() {
    this.modulesOpen = !this.modulesOpen;
  }
}
