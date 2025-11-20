import { Component, OnInit, Optional } from '@angular/core';
import { CommonModule, DatePipe, SlicePipe, UpperCasePipe } from '@angular/common'; // Ajout de pipes si non déjà là
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'; // facultatif si parfois ouvert en modale
import { ApiService } from '../../../service/api/api.service';
import { Location } from '@angular/common';
import { ListActiviteComponent } from "../../activite/list-activite/list-activite.component";
import { ListGalerieEnfantComponent } from '../../galerie-enfant/list-galerie-enfant/list-galerie-enfant.component';
@Component({
  selector: 'app-detail-enfant',
  standalone: true,
  // Assurez-vous d'importer tous les modules et pipes nécessaires pour le template
  imports: [CommonModule, FormsModule, DatePipe, SlicePipe, UpperCasePipe, ListActiviteComponent, ListGalerieEnfantComponent],
  templateUrl: './detail-enfant.component.html',
  styleUrls: ['./detail-enfant.component.scss']
})
export class DetailEnfantComponent implements OnInit {
  loading_get_enfant = false;
  enfant: any = null;
  parents: any[] = [];
  id_enfant = 0;
  // 🆕 État de l'onglet actif
  activeTab: 'info' | 'parents' = 'info';

  constructor(
    public api: ApiService,
    private route: ActivatedRoute,
    private location: Location, private router: Router,
    @Optional() public activeModal?: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(p => {
      const id = +p['id_enfant'];
      if (id) { this.id_enfant = id; this.get_enfant(); }
    });
  }
  get_enfant() {
    this.loading_get_enfant = true;
    // Utilisation de id_enfant: 1 à titre d'exemple pour le test si id_enfant est 0
    const payload = { id_enfant: this.id_enfant || 1 };

    this.api.taf_post_object('enfant/get_2', payload, (res: any) => {
      if (res.status) {
        this.enfant = res.data;
        // La structure de l'API montre que les parents sont dans res.data.les_parents
        this.parents = Array.isArray(res.data.les_parents) ? res.data.les_parents : [];
      } else {
        this.api.Swal_error("Impossible de charger l'enfant");
      }
      this.loading_get_enfant = false;
    }, () => this.loading_get_enfant = false);
  }
  goBack(): void {
    if (history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/home/enfant']); // adapte le chemin si besoin
    }
  }
}