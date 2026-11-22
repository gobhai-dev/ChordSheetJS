import { GridShape } from './types';

const FULL_SHAPE = /^(?:(\d+)\+)?(\d+)x(\d+)(?:\+(\d+))?$/i;
const CELL_COUNT = /^\d+$/;

/**
 * Parses a grid shape string: `L+MxB+R`, `MxB`, `L+MxB`, `MxB+R` or a bare cell count (`16`).
 * Returns null for anything else (including zero sized shapes).
 */
export default function parseGridShape(shape: string | null | undefined): GridShape | null {
  const text = (shape || '').trim();
  const full = FULL_SHAPE.exec(text);

  if (full) {
    const [, left, measures, beats, right] = full;
    const [m, b] = [parseInt(measures, 10), parseInt(beats, 10)];
    if (m === 0 || b === 0) return null;

    return {
      leftMargin: left ? parseInt(left, 10) : 0,
      cells: m * b,
      rightMargin: right ? parseInt(right, 10) : 0,
      measures: m,
      beats: b,
    };
  }

  if (CELL_COUNT.test(text) && parseInt(text, 10) > 0) {
    return {
      leftMargin: 0, cells: parseInt(text, 10), rightMargin: 0, measures: null, beats: null,
    };
  }

  return null;
}
