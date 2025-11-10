import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListUtilisateurComponent } from './list-utilisateur.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListUtilisateurComponent', () => {
  let component: ListUtilisateurComponent;
  let fixture: ComponentFixture<ListUtilisateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
