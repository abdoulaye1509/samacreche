import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPlanningEquipeComponent } from './detail-planning-equipe.component';

describe('DetailPlanningEquipeComponent', () => {
  let component: DetailPlanningEquipeComponent;
  let fixture: ComponentFixture<DetailPlanningEquipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPlanningEquipeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailPlanningEquipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
