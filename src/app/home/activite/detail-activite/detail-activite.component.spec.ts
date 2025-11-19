import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailActiviteComponent } from './detail-activite.component';

describe('DetailActiviteComponent', () => {
  let component: DetailActiviteComponent;
  let fixture: ComponentFixture<DetailActiviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailActiviteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailActiviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
