import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListStatutStructureComponent } from './list-statut-structure.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListStatutStructureComponent', () => {
  let component: ListStatutStructureComponent;
  let fixture: ComponentFixture<ListStatutStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListStatutStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
