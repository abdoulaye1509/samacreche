import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  standalone: true, // Composant autonome
  imports: [RouterModule,NgbDropdownModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  menu:any={
    titre:"Menu",
    items:[
      {libelle:"Activite",path:"/home/activite"},
{libelle:"Enfant",path:"/home/enfant"},
{libelle:"Facturation",path:"/home/facturation"},
{libelle:"FicheEnfant",path:"/home/fiche_enfant"},
{libelle:"GalerieEnfant",path:"/home/galerie_enfant"},
{libelle:"Genre",path:"/home/genre"},
{libelle:"GroupeSanguin",path:"/home/groupe_sanguin"},
{libelle:"Honoraire",path:"/home/honoraire"},
{libelle:"LienParente",path:"/home/lien_parente"},
{libelle:"MensualiteStructure",path:"/home/mensualite_structure"},
{libelle:"Parent",path:"/home/parent"},
{libelle:"ParentEnfant",path:"/home/parent_enfant"},
{libelle:"Pays",path:"/home/pays"},
{libelle:"PlanningEnfant",path:"/home/planning_enfant"},
{libelle:"PlanningEquipe",path:"/home/planning_equipe"},
{libelle:"Privilege",path:"/home/privilege"},
{libelle:"StatutStructure",path:"/home/statut_structure"},
{libelle:"StatutUtilisateur",path:"/home/statut_utilisateur"},
{libelle:"Structure",path:"/home/structure"},
{libelle:"StructureUtilisateur",path:"/home/structure_utilisateur"},
{libelle:"Utilisateur",path:"/home/utilisateur"}
    ]
  }
}
