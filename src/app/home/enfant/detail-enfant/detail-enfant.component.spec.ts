import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEnfantComponent } from './detail-enfant.component';

describe('DetailEnfantComponent', () => {
  let component: DetailEnfantComponent;
  let fixture: ComponentFixture<DetailEnfantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailEnfantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailEnfantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
