import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../service/api/api.service';

type PlanningEquipe = {
  id_planning_equipe: number;
  id_utilisateur: number;
  titre_planning_equipe: string;
  description_planning_equipe?: string;
  date_debut: string;
  date_fin: string;
  heure_debut?: string;
  heure_fin?: string;
  couleur?: string;
  prenom_utilisateur?: string;
  nom_utilisateur?: string;
};

@Component({
  selector: 'app-detail-planning-equipe',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './detail-planning-equipe.component.html',
  styleUrls: ['./detail-planning-equipe.component.scss']
})
export class DetailPlanningEquipeComponent implements OnInit {
  @Input() date = ''; // YYYY-MM-DD
  loading = false;
  items: PlanningEquipe[] = [];
  loading_get_planning_equipe: boolean = false;
  les_planning_equipes: any;

  constructor(public activeModal: NgbActiveModal, public api: ApiService) { }

  ngOnInit(): void {
    console.log('Date:', this.date);
    this.get_planning_day();
  }

  hhmm(t?: string) { return (t || '').slice(0, 5); }
  fullname(p: PlanningEquipe) {
    return [p.prenom_utilisateur, p.nom_utilisateur].filter(Boolean).join(' ');
  }


  get_planning_day() {
    this.loading_get_planning_equipe = true;
    this.api.taf_post_object("planning_equipe/get_planning_day", {'pe.id_structure': this.api?.user_connected?.id_structure ?? null }, (reponse: any) => {
      if (reponse.status) {
        this.items = reponse.data;
        console.log('les plannings de la journée', this.les_planning_equipes);
        console.log("Opération effectuée avec succés sur la table planning_equipe. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table planning_equipe a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_planning_equipe = false;
    }, (error: any) => {
      this.loading_get_planning_equipe = false;
    })
  }
}
