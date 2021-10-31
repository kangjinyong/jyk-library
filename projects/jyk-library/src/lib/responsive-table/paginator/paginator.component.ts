import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'table-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class PaginatorComponent {
  @Input() currentPage = 0;
  @Input() totalPages = 1;
  @Input() pageRange: { text: string; value: number }[] = [];
  @Output() goToPage: EventEmitter<number> = new EventEmitter<number>(undefined);
}
