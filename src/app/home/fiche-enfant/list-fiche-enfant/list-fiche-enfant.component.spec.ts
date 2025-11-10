import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListFicheEnfantComponent } from './list-fiche-enfant.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListFicheEnfantComponent', () => {
  let component: ListFicheEnfantComponent;
  let fixture: ComponentFixture<ListFicheEnfantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListFicheEnfantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
