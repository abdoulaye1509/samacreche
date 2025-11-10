import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddGalerieEnfantComponent } from './add-galerie-enfant.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('AddGalerieEnfantComponent', () => {
  let component: AddGalerieEnfantComponent;
  let fixture: ComponentFixture<AddGalerieEnfantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        NgbActiveModal
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGalerieEnfantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
