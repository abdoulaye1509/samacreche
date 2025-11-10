import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListPrivilegeComponent } from './list-privilege.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListPrivilegeComponent', () => {
  let component: ListPrivilegeComponent;
  let fixture: ComponentFixture<ListPrivilegeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPrivilegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
