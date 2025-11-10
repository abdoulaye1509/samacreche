import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListHonoraireComponent } from './list-honoraire.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListHonoraireComponent', () => {
  let component: ListHonoraireComponent;
  let fixture: ComponentFixture<ListHonoraireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListHonoraireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
