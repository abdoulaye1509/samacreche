import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEnfantParentComponent } from './add-enfant-parent.component';

describe('AddEnfantParentComponent', () => {
  let component: AddEnfantParentComponent;
  let fixture: ComponentFixture<AddEnfantParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEnfantParentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEnfantParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
