import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListPlanningEquipeComponent } from './list-planning-equipe.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListPlanningEquipeComponent', () => {
  let component: ListPlanningEquipeComponent;
  let fixture: ComponentFixture<ListPlanningEquipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPlanningEquipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
