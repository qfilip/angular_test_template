import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudExampleComponent } from './crud-example.component';

describe('CrudExampleComponent', () => {
  let component: CrudExampleComponent;
  let fixture: ComponentFixture<CrudExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
