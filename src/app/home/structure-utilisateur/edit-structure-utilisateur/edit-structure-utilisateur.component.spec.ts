import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditStructureUtilisateurComponent } from './edit-structure-utilisateur.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('EditStructureUtilisateurComponent', () => {
  let component: EditStructureUtilisateurComponent;
  let fixture: ComponentFixture<EditStructureUtilisateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        NgbActiveModal
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStructureUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
