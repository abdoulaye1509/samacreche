import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListStatutUtilisateurComponent } from './list-statut-utilisateur.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListStatutUtilisateurComponent', () => {
  let component: ListStatutUtilisateurComponent;
  let fixture: ComponentFixture<ListStatutUtilisateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListStatutUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
