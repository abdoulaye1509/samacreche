import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListActiviteComponent } from './list-activite.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListActiviteComponent', () => {
  let component: ListActiviteComponent;
  let fixture: ComponentFixture<ListActiviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListActiviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
