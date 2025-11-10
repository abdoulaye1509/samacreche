import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListGalerieEnfantComponent } from './list-galerie-enfant.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListGalerieEnfantComponent', () => {
  let component: ListGalerieEnfantComponent;
  let fixture: ComponentFixture<ListGalerieEnfantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListGalerieEnfantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
