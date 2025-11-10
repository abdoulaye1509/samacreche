import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMensualiteStructureComponent } from './add-mensualite-structure.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('AddMensualiteStructureComponent', () => {
  let component: AddMensualiteStructureComponent;
  let fixture: ComponentFixture<AddMensualiteStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        NgbActiveModal
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMensualiteStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
