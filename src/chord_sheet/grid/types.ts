export type GridBarVariant =
  | 'single'
  | 'double'
  | 'end'
  | 'repeat-start'
  | 'repeat-end'
  | 'repeat-end-start';

export interface GridBar {
  type: 'bar';
  symbol: string;
  variant: GridBarVariant;
  volta: number | null;
  alignVolta: boolean;
}

export interface GridChordCell { type: 'chord'; chord: string; }
export interface GridEmptyCell { type: 'empty'; }
export interface GridSlashCell { type: 'slash'; }
export interface GridRepeatCell { type: 'repeat'; measures: 1 | 2; }
export interface GridMultiCell { type: 'chords'; parts: (GridChordCell | GridEmptyCell | GridSlashCell)[]; }
export interface GridTextCell { type: 'text'; text: string; }

export type GridCell =
  | GridChordCell
  | GridEmptyCell
  | GridSlashCell
  | GridRepeatCell
  | GridMultiCell
  | GridTextCell;

export type GridToken = GridBar | GridCell;

export interface GridShape {
  leftMargin: number;
  cells: number;
  rightMargin: number;
  measures: number | null;
  beats: number | null;
}

export type GridRowKind = 'cells' | 'strum' | 'text';
