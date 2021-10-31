import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatExpansionModule } from '@angular/material/expansion';
import { ResponsiveTableComponent } from './responsive-table.component';
import { ColumnComponent } from './column/column.component';
import { MobileCardComponent } from './mobile-card/mobile-card.component';
import { PaginatorComponent } from './paginator/paginator.component';

@NgModule({
  declarations: [ResponsiveTableComponent, ColumnComponent, MobileCardComponent, PaginatorComponent],
  imports: [MatExpansionModule, CommonModule, FlexLayoutModule],
  exports: [ResponsiveTableComponent, ColumnComponent],
  providers: [DatePipe],
})
export class ResponsiveTableModule {}
