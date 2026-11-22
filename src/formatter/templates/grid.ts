import Grid from '../../chord_sheet/grid/grid';
import GridRow from '../../chord_sheet/grid/grid_row';
import { HtmlTemplateCssClasses } from '../configuration';
import Paragraph from '../../chord_sheet/paragraph';
import { tokenClasses } from '../../template_helpers';
import { escapeHtml, renderChord, span } from './grid_chord';

import {
  GridBar, GridBarVariant, GridCell, GridChordCell, GridEmptyCell, GridSlashCell,
} from '../../chord_sheet/grid/types';

interface Classes extends HtmlTemplateCssClasses {
  useUnicodeModifiers?: boolean;
}
type Part = GridChordCell | GridEmptyCell | GridSlashCell;

interface Columns {
  left: number;
  cells: number;
  right: number;
}

interface BodyCell {
  bars: GridBar[];
  cell: GridCell | null;
}

const BAR_SYMBOLS: Record<GridBarVariant, string> = {
  'single': '|',
  'double': '||',
  'end': '|.',
  'repeat-start': '|:',
  'repeat-end': ':|',
  'repeat-end-start': ':|:',
};

function renderBar(bar: GridBar, c: Classes): string {
  const volta = bar.volta === null ? '' : span(c.gridVolta, String(bar.volta));

  return span(tokenClasses(c.barline, bar.variant), BAR_SYMBOLS[bar.variant]) + volta;
}

function renderSlash(c: Classes): string {
  return span(tokenClasses(c.rhythmSymbol, 'continuation'), '/');
}

function renderPart(part: Part, c: Classes): string {
  if (part.type === 'chord') return renderChord(part.chord, c);
  if (part.type === 'slash') return renderSlash(c);
  return span(c.gridMultiEmpty, '');
}

function renderCell(cell: GridCell, c: Classes): string {
  switch (cell.type) {
    case 'chord': return renderChord(cell.chord, c);
    case 'slash': return renderSlash(c);
    case 'repeat': return span(c.gridRepeat, cell.measures === 2 ? '%%' : '%');
    case 'chords': return span(c.gridMulti, cell.parts.map((part) => renderPart(part, c)).join(''));
    case 'text': return span(c.gridText, escapeHtml(cell.text));
    default: return '';
  }
}

function td(className: string, content: string, colspan: number | null = null): string {
  const attribute = colspan === null ? '' : ` colspan="${ colspan }"`;

  return `<td class="${ className }"${ attribute }>${ content }</td>`;
}

function renderBars(bars: GridBar[], c: Classes): string {
  return bars.map((bar) => renderBar(bar, c)).join('');
}

function bodyCell({ bars, cell }: BodyCell, c: Classes): string {
  const empty = cell === null || cell.type === 'empty';
  const className = empty ? `${ c.gridCell } ${ c.gridCellEmpty }` : c.gridCell;
  const content = renderBars(bars, c) + (cell ? renderCell(cell, c) : '');

  return td(className, content);
}

function splitRow(row: GridRow): { body: BodyCell[], closing: GridBar[] } {
  const body: BodyCell[] = [];
  let bars: GridBar[] = [];

  row.tokens.forEach((token) => {
    if (token.type === 'bar') {
      bars.push(token);
    } else {
      body.push({ bars, cell: token });
      bars = [];
    }
  });

  return { body, closing: bars };
}

function renderCells(row: GridRow, cells: number, c: Classes): string {
  const { body, closing } = splitRow(row);
  const missing = Math.max(0, cells - body.length);
  const padding: BodyCell[] = Array.from({ length: missing }, () => ({ bars: [], cell: null }));

  if (missing === 0) {
    return body.map((item) => bodyCell(item, c)).join('') + td(c.gridEnd, renderBars(closing, c));
  }

  padding[0].bars = closing;
  return [...body, ...padding].map((item) => bodyCell(item, c)).join('') + td(c.gridEnd, '');
}

function renderTextRow(row: GridRow, total: number, c: Classes): string {
  return `<tr class="${ c.gridRow } ${ c.gridRowText }">${ td(c.gridText, escapeHtml(row.margin || ''), total) }</tr>`;
}

function renderCellRow(row: GridRow, columns: Columns, c: Classes): string {
  const classes = row.kind === 'strum' ? `${ c.gridRow } ${ c.gridRowStrum }` : c.gridRow;
  const left = columns.left > 0 ? td(c.gridMargin, escapeHtml(row.margin || ''), columns.left) : '';
  const right = columns.right > 0 ? td(c.gridComment, escapeHtml(row.comment || ''), columns.right) : '';

  return `<tr class="${ classes }">${ left }${ renderCells(row, columns.cells, c) }${ right }</tr>`;
}

function columnsFor(grid: Grid): Columns {
  const { leftMargin, cells, rightMargin } = grid.shape;
  const cellRows = grid.rows.filter((row) => row.kind !== 'text');

  return {
    left: leftMargin === 0 && cellRows.some((row) => row.margin !== null) ? 1 : leftMargin,
    cells,
    right: rightMargin === 0 && cellRows.some((row) => row.comment !== null) ? 1 : rightMargin,
  };
}

function renderColgroup(columns: Columns, c: Classes): string {
  return [
    columns.left > 0 ? `<col class="${ c.gridColMargin }" span="${ columns.left }">` : '',
    `<col class="${ c.gridColCell }" span="${ columns.cells }">`,
    `<col class="${ c.gridColEnd }">`,
    columns.right > 0 ? `<col class="${ c.gridColComment }" span="${ columns.right }">` : '',
  ].join('');
}

/**
 * Renders a {@link Grid} as a fixed-layout HTML table inside a horizontally scrolling container, one `<tr>` per
 * grid row. No whitespace is emitted between elements and no inline styles are used.
 */
export function renderGrid(grid: Grid, classes: HtmlTemplateCssClasses, useUnicodeModifiers = false): string {
  const c: Classes = { ...classes, useUnicodeModifiers };
  const columns = columnsFor(grid);
  const total = columns.left + columns.cells + 1 + columns.right;
  const rows = grid.rows.map((row) => (
    row.kind === 'text' ? renderTextRow(row, total, c) : renderCellRow(row, columns, c)
  ));

  const colgroup = `<colgroup>${ renderColgroup(columns, c) }</colgroup>`;
  const table = `<table class="${ c.gridTable }">${ colgroup }${ rows.join('') }</table>`;

  return `<div class="${ c.gridScroll }">${ table }</div>`;
}

/**
 * Whether a paragraph is to be rendered with the built-in grid renderer.
 */
export function rendersAsGrid(paragraph: Paragraph, renderGrids: boolean | undefined): boolean {
  return !!renderGrids && paragraph.grid !== null;
}

/**
 * The section label to show for a literal paragraph. A grid paragraph rendered as a grid shows the grid label,
 * so that a legacy shape value (`{start_of_grid: 2x2}`) is not shown as the label.
 */
export function sectionLabel(paragraph: Paragraph, renderGrids: boolean | undefined): string | null {
  return rendersAsGrid(paragraph, renderGrids) ? (paragraph.grid as Grid).label : paragraph.label;
}

/**
 * Renders a grid paragraph, or an empty string for any other paragraph.
 */
export function renderGridParagraph(
  paragraph: Paragraph,
  c: HtmlTemplateCssClasses,
  useUnicodeModifiers = false,
): string {
  const { grid } = paragraph;
  return grid ? renderGrid(grid, c, useUnicodeModifiers) : '';
}
