import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailHonoraireComponent } from './detail-honoraire.component';

describe('DetailHonoraireComponent', () => {
  let component: DetailHonoraireComponent;
  let fixture: ComponentFixture<DetailHonoraireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailHonoraireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailHonoraireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
