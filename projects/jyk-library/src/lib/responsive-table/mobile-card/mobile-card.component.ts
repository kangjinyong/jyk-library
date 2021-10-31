import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ColumnComponent } from '../column/column.component';

@Component({
  selector: 'table-mobile',
  templateUrl: './mobile-card.component.html',
  styleUrls: ['./mobile-card.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class MobileCardComponent {
  @Input() dataRow: any | undefined;
  @Input() column: ColumnComponent | undefined;
}
