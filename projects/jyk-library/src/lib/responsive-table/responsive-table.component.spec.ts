import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ResponsiveTableComponent } from './responsive-table.component';
import { ResponsiveTableModule } from './responsive-table.module';

@Component({
  selector: 'responsive-table-host-component',
  template: `<div class="responsive-table-showcase">
    <jyk-table [pageSize]="3" [data]="observableData | async">
      <jyk-table-column headerName="ID" fieldName="employeeId" [sortable]="true" [columnWidth]="10" [collapseOrder]="4"> </jyk-table-column>
      <jyk-table-column headerName="Name" fieldName="name" [columnWidth]="20"> </jyk-table-column>
      <jyk-table-column headerName="Gender" fieldName="gender" [columnWidth]="10" [collapseOrder]="2"> </jyk-table-column>
      <jyk-table-column headerName="Date of Birth" fieldName="dateOfBirth" dataType="date" [sortable]="true" [columnWidth]="20" [collapseOrder]="1">
      </jyk-table-column>
      <jyk-table-column headerName="Position" fieldName="position" [columnWidth]="20"> </jyk-table-column>
      <jyk-table-column headerName="Salary ($)" fieldName="salary" [sortable]="true" dataType="amount" [columnWidth]="20" [collapseOrder]="3">
      </jyk-table-column>
    </jyk-table>
  </div>`,
})
class ResponsiveTableHostComponent {
  @ViewChild(ResponsiveTableComponent) responsiveTableComponent: ResponsiveTableComponent | undefined;

  sampleData = [
    {
      employeeId: '00001',
      name: 'Iron Man',
      gender: 'M',
      dateOfBirth: new Date(2001, 3, 24),
      position: 'Engineer',
      salary: 50000,
    },
    {
      employeeId: '00002',
      name: 'Captain America',
      gender: 'M',
      dateOfBirth: new Date(1993, 4, 14),
      position: 'Captain',
      salary: 84000,
    },
    {
      employeeId: '00003',
      name: 'Natasha Romanoff',
      gender: 'F',
      dateOfBirth: new Date(1995, 10, 1),
      position: 'Commander',
      salary: 100000,
    },
    {
      employeeId: '00004',
      name: 'Thor',
      gender: 'M',
      dateOfBirth: new Date(1987, 9, 4),
      position: 'God',
      salary: 66000,
    },
    {
      employeeId: '00005',
      name: 'Hulk',
      gender: 'M',
      dateOfBirth: new Date(1989, 5, 23),
      position: 'Chemist',
      salary: 30000,
    },
    {
      employeeId: '00006',
      name: 'Nick Fury',
      gender: 'M',
      dateOfBirth: new Date(1977, 4, 13),
      position: 'Manager',
      salary: 110000,
    },
    {
      employeeId: '00007',
      name: 'Wasp',
      gender: 'F',
      dateOfBirth: new Date(1984, 7, 17),
      position: 'Scientist',
      salary: 90000,
    },
    {
      employeeId: '00008',
      name: 'Ant-Man',
      gender: 'M',
      dateOfBirth: new Date(1983, 3, 30),
      position: 'Test Subject',
      salary: 11000,
    },
    {
      employeeId: '00009',
      name: 'Falcon',
      gender: 'M',
      dateOfBirth: new Date(1982, 11, 11),
      position: 'Test Pilot',
      salary: 23000,
    },
    {
      employeeId: '00010',
      name: 'Hawkeye',
      gender: 'M',
      dateOfBirth: new Date(1979, 8, 10),
      position: 'Archer',
      salary: 28000,
    },
  ];
  observableData = of(this.sampleData.reverse());
}

describe('ResponsiveTableComponent', () => {
  let hostComponent: ResponsiveTableHostComponent;
  let fixture: ComponentFixture<ResponsiveTableHostComponent>;
  let tableComponent: ResponsiveTableComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ResponsiveTableHostComponent],
        imports: [ResponsiveTableModule, BrowserAnimationsModule],
        providers: [
          {
            provide: ComponentFixtureAutoDetect,
            useValue: true,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveTableHostComponent);
    hostComponent = fixture.componentInstance;
    tableComponent = hostComponent.responsiveTableComponent as ResponsiveTableComponent;
    fixture.detectChanges();
  });

  it('should create.', () => {
    expect(tableComponent).toBeTruthy();
  });

  it('should go to last page.', () => {
    const componentSpy = spyOn(tableComponent, 'goToPage').and.callThrough();

    const lastPageButtonComponent = fixture.debugElement.query(By.css('.paginator__last-page'));
    lastPageButtonComponent.triggerEventHandler('click', undefined);

    expect(componentSpy).toHaveBeenCalled();
    expect(tableComponent.sortedData.length).toBe(10);
    expect(tableComponent.currentPage).toBe(4);
  });

  it('should sort by string.', () => {
    const componentSpy = spyOn(tableComponent, 'sortColumn').and.callThrough();

    const sortableFieldComponent = fixture.debugElement.queryAll(By.css('.responsive-table__header-field-container__sortable'));
    sortableFieldComponent[0].triggerEventHandler('click', undefined);

    expect(componentSpy).toHaveBeenCalled();
    expect(tableComponent.sortedData[0].data.employeeId).toBe('00001');
  });

  it('should sort by date.', () => {
    const componentSpy = spyOn(tableComponent, 'sortColumn').and.callThrough();

    const sortableFieldComponent = fixture.debugElement.queryAll(By.css('.responsive-table__header-field-container__sortable'));
    sortableFieldComponent[1].triggerEventHandler('click', undefined);

    expect(componentSpy).toHaveBeenCalled();
    expect(tableComponent.sortedData[0].data.name).toBe('Nick Fury');
  });

  it('should sort by amount.', () => {
    const componentSpy = spyOn(tableComponent, 'sortColumn').and.callThrough();

    const sortableFieldComponent = fixture.debugElement.queryAll(By.css('.responsive-table__header-field-container__sortable'));
    sortableFieldComponent[2].triggerEventHandler('click', undefined);

    expect(componentSpy).toHaveBeenCalled();
    expect(tableComponent.sortedData[0].data.salary).toBe(11000);
  });
});
