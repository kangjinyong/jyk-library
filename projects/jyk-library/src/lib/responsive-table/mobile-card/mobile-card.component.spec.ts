import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MobileCardComponent } from './mobile-card.component';
import { ColumnComponent } from '../column/column.component';

describe('MobileCardComponent', () => {
  let component: MobileCardComponent;
  let fixture: ComponentFixture<MobileCardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MobileCardComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileCardComponent);
    component = fixture.componentInstance;
    component.column = {
      headerName: 'Test',
      fieldName: 'testFieldName',
      dataType: 'string',
    } as ColumnComponent;
    component.dataRow = {
      testFieldName: 'test',
    };
    fixture.detectChanges();
  });

  it('should create.', () => {
    expect(component).toBeTruthy();
  });
});
