import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../../../service/api/api.service';
import { AddPlanningEnfantComponent } from '../add-planning-enfant/add-planning-enfant.component';
import { DetailPlanningEnfantComponent } from '../detail-planning-enfant/detail-planning-enfant.component';

import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import frLocale from '@fullcalendar/core/locales/fr';
import { CalendarOptions, EventInput } from '@fullcalendar/core';

type Planning = {
  id_planning_enfant: number;
  id_enfant: number;
  titre_planning_enfant: string;
  description_planning_enfant?: string;
  date_debut: string;   // YYYY-MM-DD
  date_fin: string;     // YYYY-MM-DD
  heure_debut?: string; // HH:mm:ss
  heure_fin?: string;   // HH:mm:ss
  couleur?: string;
  prenom_enfant?: string;
  nom_enfant?: string;
};

@Component({
  selector: 'app-list-planning-enfant',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './list-planning-enfant.component.html',
  styleUrls: ['./list-planning-enfant.component.scss'],
})
export class ListPlanningEnfantComponent implements OnInit, OnDestroy {
  @Input() id_enfant = 0;

  loading = false;
  events: EventInput[] = [];

  /** compteur de plannings par jour: 'YYYY-MM-DD' -> n */
  private dayCounts: Record<string, number> = {};

  constructor(public api: ApiService, private modal: NgbModal) {}

  ngOnInit(): void { this.refresh(); }
  ngOnDestroy(): void {}

// + au top du composant
private countByDay: Record<string, number> = {};

private keyFromISO(iso?: string): string {
  return (iso || '').slice(0, 10);
}
private keyFromDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
private eachDay(startISO: string, endISO?: string): string[] {
  const out: string[] = [];
  const start = new Date(startISO);
  const end = new Date((endISO || startISO));
  // normalise à minuit
  start.setHours(0,0,0,0); end.setHours(0,0,0,0);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    out.push(this.keyFromDate(d));
  }
  return out;
}
private recomputeDayCounts(): void {
  this.countByDay = {};
  for (const ev of this.events) {
    const p = ev.extendedProps as any; // Planning
    const days = this.eachDay(this.keyFromISO(p.date_debut), this.keyFromISO(p.date_fin));
    for (const k of days) this.countByDay[k] = (this.countByDay[k] || 0) + 1;
  }
}

private decorateCell = (arg: any) => {
  const key = this.keyFromDate(arg.date);
  const count = this.countByDay[key] || 0;
  if (!count) return;

  const el: HTMLElement = arg.el;
  el.classList.add('has-planning');
  // dispo si tu veux colorer différemment plus tard
  el.style.setProperty('--plan-accent', '#0d6efd');
  el.style.setProperty('--plan-count', String(count));

  const top: HTMLElement | null = el.querySelector('.fc-daygrid-day-top');
  if (top && !top.querySelector('.plan-dot')) {
    const dot = document.createElement('span');
    dot.className = 'plan-dot';     // (facultatif, la pastille avec chiffre est déjà dans dayCellContent)
    dot.title = count === 1 ? '1 planning' : `${count} plannings`;
    top.appendChild(dot);
  }
};




// ----- refresh() : recalcule les points bleus après fetch -----
refresh(): void {
  this.loading = true;
  const params = this.id_enfant ? { 'p.id_enfant': this.id_enfant } : {};
  this.api.taf_post('planning_enfant/get', params, (res: any) => {
    this.loading = false;
    const rows: Planning[] = res?.status ? (res.data || []) : [];
    this.events = rows.map((p) => this.toEvent(p));
    this.recomputeDayCounts();                          // <— calcule le nombre par jour
    this.calendarOptions = {
      ...this.calendarOptions,
      events: [...this.events],                         // on garde les events pour le comptage/logic
      dayCellDidMount: (arg: any) => this.decorateCell(arg) // rebind pour ce render
    };
  }, () => (this.loading = false));
}


  // ---------- FullCalendar ----------
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
    buttonText: { today: 'Aujourd’hui', month: 'Mois', week: 'Semaine', day: 'Jour', list: 'Liste' },
    firstDay: 1,
    height: 'auto',
    nowIndicator: true,

    /** on n’affiche plus les events dans les cases du mois */
    eventDisplay: 'none',

    /** hooks & interactions */
    events: () => this.events,
    dateClick: (arg) => this.onDateClick(arg.dateStr),
    select: (arg) => this.onSelectRange(arg),
    eventClick: (arg) => this.onEventClick(arg),

    /** rendu des jours : badge + style si plannings */
    dayCellContent: (arg) => this.renderDayCell(arg.date),
    dayCellClassNames: (arg) => this.dayCounts[this.ymd(arg.date)] ? ['has-planning'] : [],
  };


  private toEvent(p: Planning): EventInput {
    return {
      id: String(p.id_planning_enfant),
      title: p.titre_planning_enfant,
      start: this.combine(p.date_debut, p.heure_debut),
      end: this.combine(p.date_fin, p.heure_fin),
      backgroundColor: p.couleur || '#4f46e5',
      borderColor: p.couleur || '#4f46e5',
      extendedProps: p,
    };
  }

  private combine(d?: string, t?: string): string {
    const dd = (d || '').slice(0, 10);
    const tt = (t || '').slice(0, 5) || '00:00';
    return `${dd}T${tt}`;
  }

  private ymd(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2,'0');
    const day = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  }

  private buildDayCounts(rows: Planning[]): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const p of rows) {
      const s = new Date(p.date_debut + 'T00:00:00');
      const e = new Date((p.date_fin || p.date_debut) + 'T00:00:00');
      for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
        const key = this.ymd(d);
        counts[key] = (counts[key] || 0) + 1;
      }
    }
    return counts;
  }

private renderDayCell(date: Date) {
  const n = this.dayCounts[this.ymd(date)] || 0;
  const day = String(date.getDate());
  const display = n > 9 ? '9+' : String(n);
  const badge = n
    ? `<span class="plan-badge pulse" title="${n} planning(s)">${display}</span>`
    : '';
  return { html: `<span class="daynum">${day}</span>${badge}` };
}


  // ---------- Interactions ----------
  private humanTime(iso?: string): string { return (iso || '').slice(11, 16) || ''; }

  onEventClick(arg: any) {
    const p: Planning = arg?.event?.extendedProps;
    const ref = this.modal.open(DetailPlanningEnfantComponent, { centered: true, size: 'xl', backdrop: 'static' });
    ref.componentInstance.mode = 'single';
    ref.componentInstance.date = (arg?.event?.startStr || '').slice(0, 10);
    ref.componentInstance.eventsOfDay = [p];
    ref.result.finally(() => this.refresh());
  }

  onDateClick(dateStr: string) {
    // Ouvre le modal “du jour” — ton modal va re-fetch via get_planning_day (jour + structure)
    const ref = this.modal.open(DetailPlanningEnfantComponent, { centered: true, size: 'xl', backdrop: 'static' });
    ref.componentInstance.mode = 'day';
    ref.componentInstance.date = dateStr;
    ref.componentInstance.eventsOfDay = []; // on laisse ton composant faire l’appel serveur
    ref.result.finally(() => this.refresh());
  }

  onSelectRange(arg: any) {
    const startISO = arg.startStr, endISO = arg.endStr;
    const defaults = {
      date_debut: startISO.slice(0, 10),
      date_fin: endISO.slice(0, 10),
      heure_debut: (startISO.length > 10 ? startISO.slice(11, 16) : '09:00'),
      heure_fin: (endISO.length > 10 ? endISO.slice(11, 16) : '10:00'),
      couleur: '#4f46e5',
      id_enfant: this.id_enfant || null
    };
    const ref = this.modal.open(AddPlanningEnfantComponent, { centered: true, size: 'lg', backdrop: 'static' });
    if (this.id_enfant) ref.componentInstance.id_enfant = this.id_enfant;
    ref.componentInstance.defaults = defaults;
    ref.result.then(r => { if (r?.status) this.refresh(); }).catch(() => {});
  }

  // ---------- Utils ----------
  openModal_add_planning_enfant() {
    const ref = this.modal.open(AddPlanningEnfantComponent, { centered: true, size: 'xl', backdrop: 'static' });
    if (this.id_enfant) ref.componentInstance.id_enfant = this.id_enfant;
    ref.result.then(r => { if (r?.status) this.refresh(); }).catch(() => {});
  }
}
