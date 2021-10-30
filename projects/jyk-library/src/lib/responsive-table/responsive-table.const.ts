export const BREAKPOINTS_MAP: Map<number, number> = new Map<number, number>([
  [4, 2],
  [5, 3],
  [6, 4],
  [7, 5],
  [8, 6],
  [9, 7],
]);

export const SORT_MAP: Map<'none' | 'asc' | 'desc', 'asc' | 'desc'> = new Map<'none' | 'asc' | 'desc', 'asc' | 'desc'>([
  ['none', 'asc'],
  ['asc', 'desc'],
  ['desc', 'asc'],
]);

export const PAGE_SIZE = 20;

export const MOBILE_WIDTH = 600;
