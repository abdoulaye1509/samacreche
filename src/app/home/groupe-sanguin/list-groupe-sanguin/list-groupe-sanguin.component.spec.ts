import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListGroupeSanguinComponent } from './list-groupe-sanguin.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListGroupeSanguinComponent', () => {
  let component: ListGroupeSanguinComponent;
  let fixture: ComponentFixture<ListGroupeSanguinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListGroupeSanguinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
