import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  Input,
  Output,
  OnDestroy,
  OnInit,
  EventEmitter,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { fromEvent, Subscription, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TableRowData } from './responsive-table.model';
import { MOBILE_WIDTH, BREAKPOINTS_MAP, PAGE_SIZE, SORT_MAP } from './responsive-table.const';
import { ColumnComponent } from './column/column.component';

@Component({
  selector: 'responsive-table',
  templateUrl: './responsive-table.component.html',
  styleUrls: ['./responsive-table.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ResponsiveTableComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  @Input() set data(val: any[]) {
    this.sortedData = Array.isArray(val)
      ? (JSON.parse(JSON.stringify(val)) as any[]).map((r) => {
          return {
            data: r,
            onCurrentPage: false,
          } as TableRowData;
        })
      : [];
    this.updateTableOnDataChange();
  }
  @Input() openPanels: Observable<boolean> | undefined;
  @Output() collapsed: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ContentChildren(ColumnComponent) columnChildren: QueryList<ColumnComponent> | undefined;
  @ViewChild(MatAccordion) accordion: MatAccordion | undefined;

  sortedData: TableRowData[] = [];
  totalWidth = 1;
  collapsedColumns: ColumnComponent[] = [];
  displayedColumns: ColumnComponent[] = [];
  hasCollapsibleColumns = false;
  currentPage = 1;
  totalPages = 1;
  pageRange: { text: string; value: number }[] = [];
  isMobile = false;

  private resizeSubscription: Subscription = Subscription.EMPTY;
  private openPanelsSubscription: Subscription = Subscription.EMPTY;
  private visibleColumnCount = 0;
  private widthHundred = 0;
  private pageSize = PAGE_SIZE;
  private mobileWidth = MOBILE_WIDTH;
  private breakpointsMap = BREAKPOINTS_MAP;
  private sortMap = SORT_MAP;

  ngOnInit(): void {
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe((e) => {
        const windowWidth = (e.target as Window).innerWidth;
        this.isMobile = windowWidth < this.mobileWidth;
        this.calculateVisibleColumnCount(windowWidth);
        this.accordion?.closeAll();
        this.isCollapsed() ? this.collapsed.emit(true) : this.collapsed.emit(false);
      });
  }

  ngAfterViewInit(): void {
    if (this.openPanels) {
      this.openPanelsSubscription = this.openPanels.subscribe((open) => {
        open ? this.accordion?.openAll : this.accordion?.closeAll();
      });
    }
  }

  ngAfterContentInit(): void {
    this.displayedColumns = Array.from(this.columnChildren || []);
    this.isMobile = window.innerWidth < this.mobileWidth;
    this.hasCollapsibleColumns = this.columnChildren?.some((c) => !!c.collapseOrder) || false;
    this.calculateVisibleColumnCount(window.innerWidth);
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
    this.openPanelsSubscription.unsubscribe();
  }

  getViewedRecordsRange(): string {
    const firstRecordOfPage = (this.currentPage - 1) * this.pageSize + 1;
    return this.sortedData
      ? `${Math.min(firstRecordOfPage, this.sortedData.length)} - ${Math.min(firstRecordOfPage + this.pageSize - 1, this.sortedData.length)} of ${
          this.sortedData.length
        } Record(s)`
      : '';
  }

  isCollapsed(): boolean {
    return this.collapsedColumns && this.collapsedColumns.length > 0;
  }

  hasDataOnDisplay(): boolean {
    return this.sortedData && this.sortedData.filter((r) => r.onCurrentPage).length > 0;
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.calculateCurrentPageData();
      this.calculatePageRange();
    }
  }

  sortColumn(sortable: boolean, field: string, type: 'string' | 'number' | 'amount' | 'date', curSortDir: 'none' | 'asc' | 'desc'): void {
    if (sortable && field) {
      const newDir = this.sortMap.get(curSortDir) || 'asc';
      this.sort(field, type, newDir);
      this.updateSortDirection(field, newDir);
    }
  }

  private updateTableOnDataChange(): void {}

  private calculateVisibleColumnCount(width: number): void {
    if (this.widthHundred !== Math.floor(width / 100)) {
      this.widthHundred = Math.floor(width / 100);
      this.visibleColumnCount = this.breakpointsMap.get(Math.min(Math.max(this.widthHundred, 4), 9)) || 2;
      this.calculateCollapsedColumns();
      this.calculateTotalWidth();
    }
  }

  private calculateCollapsedColumns(): void {
    if (this.columnChildren) {
      this.displayedColumns = this.columnChildren.filter(
        (c) => !c.collapseOrder || c.collapseOrder > (this.columnChildren?.length || 0) - this.visibleColumnCount
      );
      this.collapsedColumns = this.columnChildren
        .filter((c) => c.collapseOrder > 0 && c.collapseOrder <= (this.columnChildren?.length || 0) - this.visibleColumnCount)
        .sort((a, b) => a.collapseOrder - b.collapseOrder);
    }
  }

  private calculateTotalWidth(): void {
    this.totalWidth = this.displayedColumns.map((c) => c.columnWidth).reduce((prev, cur) => Number(prev) + Number(cur), 0) || 0;
  }

  private calculateCurrentPageData(): void {
    let i = 0;
    this.sortedData.forEach((r) => {
      r.onCurrentPage = i >= (this.currentPage - 1) * this.pageSize && i < this.currentPage * this.pageSize;
      i++;
    });
  }

  private calculatePageRange(): void {
    if (this.totalPages > 1) {
      this.pageRange = [...Array(Math.min(this.totalPages - Math.floor((this.currentPage - 1) / 10) * 10, 10)).keys()].map((p) => {
        const num = p + 1 + Math.floor(((this.currentPage - 1) / 10) * 10);
        return { text: String(num), value: num };
      });
      if (this.pageRange[9] && this.pageRange[9].value < this.totalPages) {
        this.pageRange.push({ text: '...', value: this.pageRange[9].value + 1 });
      }
      if (this.pageRange[0] && this.pageRange[0].value !== 1) {
        this.pageRange.unshift({ text: '...', value: this.pageRange[9].value - 1 });
      }
    }
  }

  private sort(field: string, type: 'string' | 'number' | 'amount' | 'date', direction: 'none' | 'asc' | 'desc') {
    switch (direction) {
      case 'asc': {
        this.sortByType(field, type);
        break;
      }
      case 'desc': {
        this.sortByType(field, type);
        break;
      }
      default: {
        break;
      }
    }
    this.calculateCurrentPageData();
  }

  private sortByType(field: string, type: 'string' | 'number' | 'amount' | 'date', desc: boolean = false) {
    const multiplier = desc ? -1 : 1;
    switch (type) {
      case 'string': {
        this.sortedData.sort((a, b) => (a.data[field] < b.data[field] ? -1 : 1) * multiplier);
        break;
      }
      case 'number':
      case 'amount': {
        this.sortedData.sort((a, b) => {
          if (!a.data[field] && a.data[field] !== 0) {
            return -1 * multiplier;
          } else if (!b.data[field] && b.data[field] !== 0) {
            return 1 * multiplier;
          }
          return (a.data[field] - b.data[field]) * multiplier;
        });
        break;
      }
      case 'date': {
        this.sortedData.sort((a, b) => {
          const date1 = new Date(a.data[field]);
          const date2 = new Date(b.data[field]);
          if (date1 && date2) {
            return (date1.getTime() - date2.getTime()) * multiplier;
          }
          return 0;
        });
        break;
      }
    }
  }

  private updateSortDirection(field: string, newDir: 'asc' | 'desc'): void {
    this.columnChildren?.forEach((c) => {
      if (c.fieldName === field) {
        c.curSortDir = newDir;
      } else {
        c.curSortDir = 'none';
      }
    });
  }
}
