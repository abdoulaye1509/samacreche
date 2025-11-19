import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detail-activite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-activite.component.html',
  styleUrl: './detail-activite.component.scss'
})
export class DetailActiviteComponent implements OnInit, OnDestroy {
  @Input() selected_activite: any;
  form: any[] = [];

  constructor(@Optional() public activeModal?: NgbActiveModal) {}

  ngOnInit(): void {
     console.groupCollapsed("DetailActiviteComponent");
    this.form = this.safeParse(this.selected_activite?.contenu) ?? [];
    console.log("Selected activite:", this.selected_activite);
    console.log("Parsed form content:", this.form);
    console.log("longueur contenu",this.selected_activite.contenu.length);

  }
 ngOnDestroy(): void {
    console.groupEnd();
  }
  private safeParse(src: any): any[] {
    try {
      if (!src) return [];
      return typeof src === 'string' ? JSON.parse(src) : src;
    } catch {
      return [];
    }
  }

  get formattedArriveeDate(): Date | null {
    if (!this.selected_activite?.date_activite) return null;
    const d = new Date(this.selected_activite.date_activite);

    const h = this.selected_activite?.heure_activite;
    if (!h || typeof h !== 'string') return d;

    const m = /^(\d{2}):(\d{2})/.exec(h);
    if (!m) return d;

    d.setHours(+m[1], +m[2], 0, 0);
    return d;
  }
}
