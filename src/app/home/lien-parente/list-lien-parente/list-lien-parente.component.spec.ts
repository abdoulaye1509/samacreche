import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListLienParenteComponent } from './list-lien-parente.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListLienParenteComponent', () => {
  let component: ListLienParenteComponent;
  let fixture: ComponentFixture<ListLienParenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListLienParenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
