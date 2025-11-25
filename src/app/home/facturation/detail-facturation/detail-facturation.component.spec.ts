import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailFacturationComponent } from './detail-facturation.component';

describe('DetailFacturationComponent', () => {
  let component: DetailFacturationComponent;
  let fixture: ComponentFixture<DetailFacturationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailFacturationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailFacturationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
