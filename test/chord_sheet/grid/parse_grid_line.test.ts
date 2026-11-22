import { parseGridLine } from '../../../src';

const bars = (line: string) => parseGridLine(line).tokens.filter((t) => t.type === 'bar');

describe('parseGridLine', () => {
  describe('bars', () => {
    it.each([
      ['|', 'single'],
      ['||', 'double'],
      ['|.', 'end'],
      ['|:', 'repeat-start'],
      [':|', 'repeat-end'],
      [':|:', 'repeat-end-start'],
      ['{', 'repeat-start'],
      ['}', 'repeat-end'],
      ['}{', 'repeat-end-start'],
    ])('parses %s as %s', (symbol, variant) => {
      expect(bars(`${symbol} A . ${symbol}`)[0]).toEqual({
        type: 'bar', symbol, variant, volta: null, alignVolta: false,
      });
    });

    it('parses voltas', () => {
      expect(bars('|1 A . :|2')).toEqual([
        {
          type: 'bar', symbol: '|', variant: 'single', volta: 1, alignVolta: false,
        },
        {
          type: 'bar', symbol: ':|', variant: 'repeat-end', volta: 2, alignVolta: false,
        },
      ]);
    });

    it('parses volta alignment', () => {
      expect(bars('|: A . :|2>')[1]).toEqual(
        {
          type: 'bar', symbol: ':|', variant: 'repeat-end', volta: 2, alignVolta: true,
        },
      );
    });

    it('parses a line with only bars', () => {
      const row = parseGridLine('| | |');

      expect(row.kind).toEqual('cells');
      expect(row.cellCount).toEqual(0);
      expect(row.tokens).toHaveLength(3);
    });
  });

  describe('cells', () => {
    it('parses every cell kind', () => {
      const row = parseGridLine('| . / % %% Am7/G N.C. F#m7b5 |');

      expect(row.cells).toEqual([
        { type: 'empty' },
        { type: 'slash' },
        { type: 'repeat', measures: 1 },
        { type: 'repeat', measures: 2 },
        { type: 'chord', chord: 'Am7/G' },
        { type: 'chord', chord: 'N.C.' },
        { type: 'chord', chord: 'F#m7b5' },
      ]);
      expect(row.cellCount).toEqual(7);
    });

    it('parses multi-chord cells with empty and slash parts', () => {
      expect(parseGridLine('| A~B~.~/~ |').cells).toEqual([{
        type: 'chords',
        parts: [
          { type: 'chord', chord: 'A' },
          { type: 'chord', chord: 'B' },
          { type: 'empty' },
          { type: 'slash' },
          { type: 'empty' },
        ],
      }]);
    });

    it('ignores whitespace amount', () => {
      expect(parseGridLine('| A    . |').cells).toEqual(parseGridLine('|  A .  |').cells);
      expect(parseGridLine('|   A   .   |').cells).toHaveLength(2);
    });
  });

  describe('margins', () => {
    it('extracts the left margin and right comment', () => {
      const row = parseGridLine('Intro  | Am . . . | C . . . | x2');

      expect(row.margin).toEqual('Intro');
      expect(row.comment).toEqual('x2');
      expect(row.cellCount).toEqual(8);
    });

    it('has no margin or comment when absent', () => {
      const row = parseGridLine('| G . |');

      expect(row.margin).toBeNull();
      expect(row.comment).toBeNull();
    });

    it('treats a line without bars as margin text', () => {
      const row = parseGridLine('  Just some text  ');

      expect(row.kind).toEqual('text');
      expect(row.margin).toEqual('Just some text');
      expect(row.tokens).toEqual([]);
      expect(row.comment).toBeNull();
    });

    it('does not throw on empty input', () => {
      expect(() => parseGridLine('')).not.toThrow();
    });
  });

  describe('strum lines', () => {
    it('detects strum lines and strips the marker', () => {
      const row = parseGridLine('|S dn up . dn |');

      expect(row.kind).toEqual('strum');
      expect(row.tokens[0]).toEqual({
        type: 'bar', symbol: '|', variant: 'single', volta: null, alignVolta: false,
      });
      expect(row.cells).toEqual([
        { type: 'chord', chord: 'dn' },
        { type: 'chord', chord: 'up' },
        { type: 'empty' },
        { type: 'chord', chord: 'dn' },
      ]);
    });

    it('accepts a lowercase marker', () => {
      expect(parseGridLine('|s dn |').kind).toEqual('strum');
    });
  });
});
