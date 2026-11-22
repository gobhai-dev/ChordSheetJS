import GridRow from './grid_row';
import parseGridBar from './parse_bar';
import parseGridCell from './parse_cell';
import { GridBar, GridToken } from './types';

const STRUM_BAR = /^\|[Ss]$/;

function textOrNull(words: string[]): string | null {
  return words.length > 0 ? words.join(' ') : null;
}

function parseBody(words: string[]): { tokens: GridToken[], strum: boolean } {
  const strum = STRUM_BAR.test(words[0]);
  const tokens = words.map((word, index): GridToken => {
    if (strum && index === 0) return parseGridBar('|') as GridBar;
    return parseGridBar(word) || parseGridCell(word);
  });

  return { tokens, strum };
}

/**
 * Parses one grid line into a {@link GridRow}. Never throws; a line without any bar is margin text only.
 * Strum words (`dn`, `up`, ...) on strum lines currently come out as chord cells.
 */
export default function parseGridLine(line: string): GridRow {
  const words = line.trim().split(/\s+/).filter((word) => word !== '');
  const isBar = (word: string): boolean => STRUM_BAR.test(word) || parseGridBar(word) !== null;
  const first = words.findIndex(isBar);

  if (first === -1) {
    return new GridRow({ margin: textOrNull(words), kind: 'text' });
  }

  const last = words.length - 1 - [...words].reverse().findIndex(isBar);
  const { tokens, strum } = parseBody(words.slice(first, last + 1));

  return new GridRow({
    margin: textOrNull(words.slice(0, first)),
    tokens,
    comment: textOrNull(words.slice(last + 1)),
    kind: strum ? 'strum' : 'cells',
  });
}
