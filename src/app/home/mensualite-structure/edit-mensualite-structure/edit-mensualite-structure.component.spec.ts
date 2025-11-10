import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditMensualiteStructureComponent } from './edit-mensualite-structure.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('EditMensualiteStructureComponent', () => {
  let component: EditMensualiteStructureComponent;
  let fixture: ComponentFixture<EditMensualiteStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        NgbActiveModal
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMensualiteStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
