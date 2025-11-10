import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-public',
  standalone: true, // Composant autonome
  imports: [RouterModule,NgbDropdownModule],
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent {
  menu:any={
    titre:"Menu",
    items:[
      {libelle:"Login",path:"/public/login"}
    ]
  }
}
