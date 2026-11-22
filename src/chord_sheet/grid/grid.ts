import GridRow from './grid_row';
import { GridShape } from './types';
import type Paragraph from '../paragraph';
import Tag from '../tag';
import parseGridLine from './parse_grid_line';
import parseGridShape from './parse_shape';

export interface GridParseOptions {
  shape?: string | null;
  label?: string | null;
}

function deriveShape(rows: GridRow[]): GridShape {
  // Deliberate difference from the ChordPro reference program, which defaults to a fixed 1+4x4+1:
  // without an explicit shape we fit the shape to the content.
  return {
    leftMargin: rows.some((row) => row.margin !== null) ? 1 : 0,
    cells: Math.max(0, ...rows.map((row) => row.cellCount)),
    rightMargin: rows.some((row) => row.comment !== null) ? 1 : 0,
    measures: null,
    beats: null,
  };
}

function growToFit(shape: GridShape, rows: GridRow[]): GridShape {
  const widest = Math.max(0, ...rows.map((row) => row.cellCount));
  return widest > shape.cells ? { ...shape, cells: widest } : shape;
}

function legacyShapeAndLabel(value: string): { shape: string | null, label: string | null } {
  const match = /^([^\s:]+)\s*:?\s*(.*)$/.exec(value);

  if (match && parseGridShape(match[1])) {
    return { shape: match[1], label: match[2] || null };
  }

  return { shape: null, label: value || null };
}

function startTagOptions(tag: Tag): GridParseOptions {
  const { shape, label } = tag.attributes;
  const legacy = legacyShapeAndLabel(tag.value);

  return {
    shape: shape || legacy.shape,
    label: label || legacy.label,
  };
}

/**
 * A derived, read-only view of a grid section (`{start_of_grid}`) as rows of bars and cells.
 */
class Grid {
  rows: GridRow[];

  shape: GridShape;

  hasExplicitShape: boolean;

  label: string | null;

  constructor(rows: GridRow[], shape: GridShape, hasExplicitShape: boolean, label: string | null) {
    this.rows = rows;
    this.shape = shape;
    this.hasExplicitShape = hasExplicitShape;
    this.label = label;
  }

  static parse(lines: string[], options: GridParseOptions = {}): Grid {
    const rows = lines
      .filter((line) => line.trim() !== '')
      .map((line) => parseGridLine(line));
    const explicit = parseGridShape(options.shape);

    return new Grid(
      rows,
      explicit ? growToFit(explicit, rows) : deriveShape(rows),
      explicit !== null,
      options.label || null,
    );
  }

  static fromParagraph(paragraph: Paragraph): Grid | null {
    if (paragraph.type !== 'grid') return null;

    const startTag = paragraph.sectionStartTag ??
      paragraph.lines[0]?.items.find((item) => item instanceof Tag && item.isSectionDelimiter());
    const options = startTag ? startTagOptions(startTag as Tag) : {};

    return Grid.parse(paragraph.contents.split('\n'), options);
  }
}

export default Grid;
