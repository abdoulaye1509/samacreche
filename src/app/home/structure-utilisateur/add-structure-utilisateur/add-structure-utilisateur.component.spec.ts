import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddStructureUtilisateurComponent } from './add-structure-utilisateur.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('AddStructureUtilisateurComponent', () => {
  let component: AddStructureUtilisateurComponent;
  let fixture: ComponentFixture<AddStructureUtilisateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        NgbActiveModal
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStructureUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
