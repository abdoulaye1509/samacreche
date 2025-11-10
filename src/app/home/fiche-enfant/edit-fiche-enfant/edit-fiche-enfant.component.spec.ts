import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditFicheEnfantComponent } from './edit-fiche-enfant.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('EditFicheEnfantComponent', () => {
  let component: EditFicheEnfantComponent;
  let fixture: ComponentFixture<EditFicheEnfantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        NgbActiveModal
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFicheEnfantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
