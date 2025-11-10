import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListStructureComponent } from './list-structure.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListStructureComponent', () => {
  let component: ListStructureComponent;
  let fixture: ComponentFixture<ListStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
