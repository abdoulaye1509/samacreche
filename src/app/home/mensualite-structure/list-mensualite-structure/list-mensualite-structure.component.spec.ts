import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListMensualiteStructureComponent } from './list-mensualite-structure.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListMensualiteStructureComponent', () => {
  let component: ListMensualiteStructureComponent;
  let fixture: ComponentFixture<ListMensualiteStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMensualiteStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
