import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPlanningEnfantComponent } from './detail-planning-enfant.component';

describe('DetailPlanningEnfantComponent', () => {
  let component: DetailPlanningEnfantComponent;
  let fixture: ComponentFixture<DetailPlanningEnfantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPlanningEnfantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailPlanningEnfantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
