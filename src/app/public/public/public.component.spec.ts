import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicComponent } from './home.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('PublicComponent', () => {
  let component: PublicComponent;
  let fixture: ComponentFixture<PublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicComponent],
       providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),         // ou { id: 123 }
            queryParams: of({}),
            snapshot: {
              paramMap: {
                get: () => null     // ou retourne une valeur simulée
              }
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
