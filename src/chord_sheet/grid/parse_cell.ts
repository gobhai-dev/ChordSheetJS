import {
  GridCell, GridChordCell, GridEmptyCell, GridSlashCell,
} from './types';

type Part = GridChordCell | GridEmptyCell | GridSlashCell;

function parsePart(text: string): Part {
  if (text === '' || text === '.') return { type: 'empty' };
  if (text === '/') return { type: 'slash' };
  return { type: 'chord', chord: text };
}

/**
 * Parses a single whitespace-free token between bar lines into a grid cell.
 * Chord names are kept as written; nothing is validated.
 */
export default function parseGridCell(token: string): GridCell {
  if (token === '.') return { type: 'empty' };
  if (token === '/') return { type: 'slash' };
  if (token === '%') return { type: 'repeat', measures: 1 };
  if (token === '%%') return { type: 'repeat', measures: 2 };
  if (token.includes('~')) return { type: 'chords', parts: token.split('~').map(parsePart) };
  return { type: 'chord', chord: token };
}
