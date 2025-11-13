import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListActiviteComponent } from './activite/list-activite/list-activite.component';
import { ListEnfantComponent } from './enfant/list-enfant/list-enfant.component';
import { ListFacturationComponent } from './facturation/list-facturation/list-facturation.component';
import { ListFicheEnfantComponent } from './fiche-enfant/list-fiche-enfant/list-fiche-enfant.component';
import { ListGalerieEnfantComponent } from './galerie-enfant/list-galerie-enfant/list-galerie-enfant.component';
import { ListGenreComponent } from './genre/list-genre/list-genre.component';
import { ListGroupeSanguinComponent } from './groupe-sanguin/list-groupe-sanguin/list-groupe-sanguin.component';
import { ListHonoraireComponent } from './honoraire/list-honoraire/list-honoraire.component';
import { ListLienParenteComponent } from './lien-parente/list-lien-parente/list-lien-parente.component';
import { ListMensualiteStructureComponent } from './mensualite-structure/list-mensualite-structure/list-mensualite-structure.component';
import { ListParentComponent } from './parent/list-parent/list-parent.component';
import { ListParentEnfantComponent } from './parent-enfant/list-parent-enfant/list-parent-enfant.component';
import { ListPaysComponent } from './pays/list-pays/list-pays.component';
import { ListPlanningEnfantComponent } from './planning-enfant/list-planning-enfant/list-planning-enfant.component';
import { ListPlanningEquipeComponent } from './planning-equipe/list-planning-equipe/list-planning-equipe.component';
import { ListPrivilegeComponent } from './privilege/list-privilege/list-privilege.component';
import { ListStatutStructureComponent } from './statut-structure/list-statut-structure/list-statut-structure.component';
import { ListStatutUtilisateurComponent } from './statut-utilisateur/list-statut-utilisateur/list-statut-utilisateur.component';
import { ListStructureComponent } from './structure/list-structure/list-structure.component';
import { ListStructureUtilisateurComponent } from './structure-utilisateur/list-structure-utilisateur/list-structure-utilisateur.component';
import { ListUtilisateurComponent } from './utilisateur/list-utilisateur/list-utilisateur.component';
import { ParametreComponent } from './home/parametre/parametre.component';

const routes: Routes = [
  { path: "", component: ListActiviteComponent },
  { path: "activite", component: ListActiviteComponent },
  { path: "enfant", component: ListEnfantComponent },
  { path: "facturation", component: ListFacturationComponent },
  { path: "fiche_enfant", component: ListFicheEnfantComponent },
  { path: "galerie_enfant", component: ListGalerieEnfantComponent },
  { path: "genre", component: ListGenreComponent },
  { path: "groupe_sanguin", component: ListGroupeSanguinComponent },
  { path: "honoraire", component: ListHonoraireComponent },
  { path: "lien_parente", component: ListLienParenteComponent },
  { path: "mensualite_structure", component: ListMensualiteStructureComponent },
  { path: "parent", component: ListParentComponent },
  { path: "parent_enfant", component: ListParentEnfantComponent },
  { path: "pays", component: ListPaysComponent },
  { path: "planning_enfant", component: ListPlanningEnfantComponent },
  { path: "planning_equipe", component: ListPlanningEquipeComponent },
  { path: "privilege", component: ListPrivilegeComponent },
  { path: "statut_structure", component: ListStatutStructureComponent },
  { path: "statut_utilisateur", component: ListStatutUtilisateurComponent },
  { path: "structure", component: ListStructureComponent },
  { path: "structure_utilisateur", component: ListStructureUtilisateurComponent },
  { path: "utilisateur", component: ListUtilisateurComponent },


  {
    path: 'parametre',
    component: ParametreComponent,
    children: [
      { path: '', redirectTo: 'privilege', pathMatch: 'full' },
      // Référentiels
      { path: 'privilege', component: ListPrivilegeComponent },
      { path: 'genre', component: ListGenreComponent },
      { path: 'pays', component: ListPaysComponent },
      { path: 'statut_structure', component: ListStatutStructureComponent },
      { path: 'statut_utilisateur', component: ListStatutUtilisateurComponent },
      { path: 'mensualite', component: ListMensualiteStructureComponent },
      { path: 'lien_parente', component: ListLienParenteComponent },



    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }