import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JykLibraryComponent } from './jyk-library.component';

describe('JykLibraryComponent', () => {
  let component: JykLibraryComponent;
  let fixture: ComponentFixture<JykLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JykLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JykLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
