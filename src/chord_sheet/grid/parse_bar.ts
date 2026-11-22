import { classifyChordLineToken } from '../chord_line_token';
import { GridBar, GridBarVariant } from './types';

const BAR_PATTERN = /^(:\|:|:\|\||:\||\|\||\|\.|\|:|\|\}\{|\}\{|\{|\}|\|)(\d+)?(>)?$/;

const ALTERNATES = new Map<string, GridBarVariant>([
  ['{', 'repeat-start'],
  ['}', 'repeat-end'],
  ['}{', 'repeat-end-start'],
]);

function variantFor(symbol: string): GridBarVariant | null {
  const alternate = ALTERNATES.get(symbol);
  if (alternate) return alternate;

  const { kind, variant } = classifyChordLineToken(symbol);
  return kind === 'barline' ? variant as GridBarVariant : null;
}

/**
 * Parses a bar token (`|`, `||`, `|.`, `|:`, `:|`, `:|:`, `{`, `}`, `}{`, optionally with a
 * volta number and `>` alignment marker, e.g. `:|2>`). Returns null if the token is not a bar.
 */
export default function parseGridBar(token: string): GridBar | null {
  const match = BAR_PATTERN.exec(token);
  if (!match) return null;

  const [, symbol, volta, align] = match;
  const variant = variantFor(symbol);
  if (!variant) return null;

  return {
    type: 'bar',
    symbol,
    variant,
    volta: volta ? parseInt(volta, 10) : null,
    alignVolta: !!align,
  };
}
