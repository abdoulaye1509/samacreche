import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddStatutUtilisateurComponent } from './add-statut-utilisateur.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('AddStatutUtilisateurComponent', () => {
  let component: AddStatutUtilisateurComponent;
  let fixture: ComponentFixture<AddStatutUtilisateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        NgbActiveModal
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStatutUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
