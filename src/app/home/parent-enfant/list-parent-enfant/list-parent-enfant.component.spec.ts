import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListParentEnfantComponent } from './list-parent-enfant.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListParentEnfantComponent', () => {
  let component: ListParentEnfantComponent;
  let fixture: ComponentFixture<ListParentEnfantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListParentEnfantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
