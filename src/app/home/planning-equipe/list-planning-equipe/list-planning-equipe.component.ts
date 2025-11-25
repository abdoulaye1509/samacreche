import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import frLocale from '@fullcalendar/core/locales/fr';
import { CalendarOptions, EventInput } from '@fullcalendar/core';

import { ApiService } from '../../../service/api/api.service';
import { AddPlanningEquipeComponent } from '../add-planning-equipe/add-planning-equipe.component';
import { DetailPlanningEquipeComponent } from '../detail-planning-equipe/detail-planning-equipe.component';

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
  selector: 'app-list-planning-equipe',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './list-planning-equipe.component.html',
  styleUrls: ['./list-planning-equipe.component.scss']
})
export class ListPlanningEquipeComponent implements OnInit, OnDestroy {
  loading = false;
  events: EventInput[] = [];
  private countByDay: Record<string, number> = {};

  constructor(public api: ApiService, private modal: NgbModal) {}

  ngOnInit(): void { this.refresh(); }
  ngOnDestroy(): void {}

  // ----- tools
  private keyFromISO(iso?: string) { return (iso || '').slice(0,10); }
  private keyFromDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth()+1).padStart(2,'0');
    const d = String(date.getDate()).padStart(2,'0');
    return `${y}-${m}-${d}`;
  }
  private eachDay(startISO: string, endISO?: string): string[] {
    const out: string[] = [];
    const s = new Date(startISO), e = new Date(endISO || startISO);
    s.setHours(0,0,0,0); e.setHours(0,0,0,0);
    for (let d = new Date(s); d <= e; d.setDate(d.getDate()+1)) out.push(this.keyFromDate(d));
    return out;
  }
  private recomputeDayCounts(): void {
    this.countByDay = {};
    for (const ev of this.events) {
      const p = ev.extendedProps as any;
      for (const k of this.eachDay(this.keyFromISO(p.date_debut), this.keyFromISO(p.date_fin))) {
        this.countByDay[k] = (this.countByDay[k] || 0) + 1;
      }
    }
  }

  // ----- data
  refresh(): void {
    this.loading = true;
    this.api.taf_post('planning_equipe/get', {}, (res: any) => {
      this.loading = false;
      const rows: PlanningEquipe[] = res?.status ? (res.data || []) : [];
      this.events = rows.map(p => ({
        id: String(p.id_planning_equipe),
        title: p.titre_planning_equipe,
        start: `${p.date_debut}T${(p.heure_debut||'00:00').slice(0,5)}`,
        end: `${p.date_fin}T${(p.heure_fin||'23:59').slice(0,5)}`,
        backgroundColor: p.couleur || '#0d6efd',
        borderColor: p.couleur || '#0d6efd',
        extendedProps: p
      }));
      this.recomputeDayCounts();
      this.calendarOptions = {
        ...this.calendarOptions,
        events: [...this.events],
        dayCellDidMount: (arg) => this.decorateCell(arg)
      };
    }, () => this.loading = false);
  }

  // ----- FullCalendar
  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin],
    themeSystem: 'bootstrap5',
    locales: [frLocale],
    locale: 'fr',
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    buttonText: { today:'Aujourd’hui', month:'Mois', week:'Semaine', day:'Jour', list:'Liste' },
    firstDay: 1,
    height: 'auto',
    nowIndicator: true,

    // n’affiche pas le détail d’évènements dans la vue mois
    eventDisplay: 'none',

    events: () => this.events,
     dateClick: (arg) => this.onDateClick(arg.dateStr),
    select: (arg) => this.onSelectRange(arg)
  };

  private decorateCell(arg: any) {
    const k = this.keyFromDate(arg.date);
    const n = this.countByDay[k] || 0;
    if (!n) return;
    const top: HTMLElement | null = arg.el.querySelector('.fc-daygrid-day-top');
    if (!top) return;

    arg.el.classList.add('has-planning');

    // pastille + badge chiffre
    if (!top.querySelector('.plan-dot')) {
      const dot = document.createElement('span');
      dot.className = 'plan-dot';
      dot.title = n === 1 ? '1 planning' : `${n} plannings`;
      top.appendChild(dot);
    }
    if (!top.querySelector('.plan-badge')) {
      const badge = document.createElement('span');
      badge.className = 'plan-badge';
      badge.innerText = String(n);
      top.appendChild(badge);
    }
  }

  // ----- interactions
  onDateClick(dateStr: string) {
    const ref = this.modal.open(DetailPlanningEquipeComponent, { centered: true, size: 'xl', backdrop: 'static' });
    ref.componentInstance.date = dateStr;
    ref.result.finally(() => this.refresh());
  }

  onSelectRange(arg: any) {
    const startISO = arg.startStr, endISO = arg.endStr;
    const defaults = {
      date_debut: startISO.slice(0,10),
      date_fin: endISO.slice(0,10),
      heure_debut: startISO.length>10 ? startISO.slice(11,16) : '09:00',
      heure_fin: endISO.length>10 ? endISO.slice(11,16) : '10:00',
      couleur: '#0d6efd'
    };
    const ref = this.modal.open(AddPlanningEquipeComponent, { centered: true, size: 'lg', backdrop: 'static' });
    ref.componentInstance.defaults = defaults;
    ref.result.then(r => { if (r?.status) this.refresh(); }).catch(() => {});
  }

  openModal_add_planning_equipe() {
    const ref = this.modal.open(AddPlanningEquipeComponent, { centered: true, size: 'lg', backdrop: 'static' });
    ref.result.then(r => { if (r?.status) this.refresh(); }).catch(() => {});
  }
}
