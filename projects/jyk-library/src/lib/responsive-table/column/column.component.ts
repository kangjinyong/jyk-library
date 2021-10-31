import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'jyk-table-column',
  template: '',
  styleUrls: [],
})
export class ColumnComponent {
  @ContentChild('columnOverride', { static: false })
  overrideRef: TemplateRef<any> | undefined;
  @Input() headerName: string | undefined;
  @Input() fieldName: string | undefined;
  @Input() dataType: 'string' | 'number' | 'amount' | 'date' = 'string';
  @Input() dateFormat = 'dd MMM yyyy';
  @Input() columnWidth: number | undefined;
  @Input() collapseOrder = 0;
  @Input() sortable = false;
  @Input() wrapWhiteSpace = true;

  curSortDir: 'none' | 'asc' | 'desc' = 'none';
}
