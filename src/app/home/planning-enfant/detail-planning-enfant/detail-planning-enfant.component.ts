import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../service/api/api.service';

type Planning = {
  id_planning_enfant: number;
  id_enfant: number;
  titre_planning_enfant: string;
  description_planning_enfant?: string;
  date_debut: string;
  date_fin: string;
  heure_debut?: string;
  heure_fin?: string;
  couleur?: string;
  prenom_enfant?: string;
  nom_enfant?: string;
};

@Component({
  selector: 'app-detail-planning-enfant',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './detail-planning-enfant.component.html',
  styleUrls: ['./detail-planning-enfant.component.scss'],
})
export class DetailPlanningEnfantComponent implements OnInit {
  /** 'single' = un évènement, 'day' = liste du jour */
  @Input() mode: 'single' | 'day' = 'day';
  @Input() date = '';                      // YYYY-MM-DD
  @Input() eventsOfDay: Planning[] = [];   // rempli par la page appelante
p:any;
  loading_get_planning_enfant: boolean = false;
  les_planning_enfants: any;
  constructor(public activeModal: NgbActiveModal,public api: ApiService) {}

  ngOnInit(): void {
    console.log('DetailPlanningEnfantComponent initialized with mode:', this.mode);
    console.log('Date:', this.date);
    console.log('Events of the day:', this.eventsOfDay);
    this.get_planning_day();
    
   }

  fullname(p: Planning): string {
    return [p.prenom_enfant, p.nom_enfant].filter(Boolean).join(' ');
  }
  hhmm(t?: string) { return (t || '').slice(0, 5); }
get_planning_day() {
    this.loading_get_planning_enfant = true;
      this.api.taf_post_object("planning_enfant/get_planning_day", { jour: this.date, 'pe.id_structure': this.api?.user_connected?.id_structure ?? null }, (reponse: any) => {
        if (reponse.status) {
          this.les_planning_enfants = reponse.data
          console.log('les plannings de la journée',this.les_planning_enfants);
          console.log("Opération effectuée avec succés sur la table planning_enfant. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table planning_enfant a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_planning_enfant = false;
      }, (error: any) => {
        this.loading_get_planning_enfant = false;
      })
    }
}
