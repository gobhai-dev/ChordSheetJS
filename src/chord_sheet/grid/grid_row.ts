import {
  GridBar, GridCell, GridRowKind, GridToken,
} from './types';

/**
 * A single line of a grid: optional left margin text, bars and cells, optional right margin comment.
 */
class GridRow {
  margin: string | null;

  tokens: GridToken[];

  comment: string | null;

  kind: GridRowKind;

  constructor(
    {
      margin = null, tokens = [], comment = null, kind = 'cells',
    }: Partial<Pick<GridRow, 'margin' | 'tokens' | 'comment' | 'kind'>> = {},
  ) {
    this.margin = margin;
    this.tokens = tokens;
    this.comment = comment;
    this.kind = kind;
  }

  get cells(): GridCell[] {
    return this.tokens.filter((token): token is GridCell => token.type !== 'bar');
  }

  get bars(): GridBar[] {
    return this.tokens.filter((token): token is GridBar => token.type === 'bar');
  }

  get cellCount(): number {
    return this.cells.length;
  }
}

export default GridRow;
