import { ChordProParser, Grid } from '../../../src';

const parse = (text: string) => new ChordProParser().parse(text);
const gridOf = (text: string) => parse(text).paragraphs.find((p) => p.type === 'grid')?.grid as Grid;

describe('Grid', () => {
  describe('.parse', () => {
    it('ignores blank lines', () => {
      expect(Grid.parse(['| A |', '', '   ', '| B |']).rows).toHaveLength(2);
    });

    it('uses an explicit shape', () => {
      const grid = Grid.parse(['| A . . . |'], { shape: '1+4x4+1', label: 'Intro' });

      expect(grid.hasExplicitShape).toBe(true);
      expect(grid.shape).toEqual({
        leftMargin: 1, cells: 16, rightMargin: 1, measures: 4, beats: 4,
      });
      expect(grid.label).toEqual('Intro');
    });

    it('derives a shape from the content', () => {
      const grid = Grid.parse(['Intro | A . . | B . . . . | x2', '| C |']);

      expect(grid.hasExplicitShape).toBe(false);
      expect(grid.shape).toEqual({
        leftMargin: 1, cells: 8, rightMargin: 1, measures: null, beats: null,
      });
      expect(grid.label).toBeNull();
    });

    it('derives no margins when there are none', () => {
      expect(Grid.parse(['| A . |']).shape).toEqual({
        leftMargin: 0, cells: 2, rightMargin: 0, measures: null, beats: null,
      });
    });

    it('derives a shape when the given one is invalid', () => {
      const grid = Grid.parse(['| A . |'], { shape: 'nonsense' });

      expect(grid.hasExplicitShape).toBe(false);
      expect(grid.shape.cells).toEqual(2);
    });

    it('grows an explicit shape that is too small', () => {
      const grid = Grid.parse(['| A . . . . . |'], { shape: '2x2' });

      expect(grid.hasExplicitShape).toBe(true);
      expect(grid.shape.cells).toEqual(6);
      expect(grid.shape.measures).toEqual(2);
    });
  });

  describe('paragraph.grid', () => {
    const body = 'Intro | Am . . . | C . . . | x2\n|: G / / / | % | D~Em . . . :|';

    it('works for {start_of_grid}', () => {
      const grid = gridOf(`{start_of_grid}\n${body}\n{end_of_grid}`);

      expect(grid.rows).toHaveLength(2);
      expect(grid.rows[0].margin).toEqual('Intro');
      expect(grid.rows[0].comment).toEqual('x2');
      expect(grid.hasExplicitShape).toBe(false);
      expect(grid.label).toBeNull();
    });

    it('works for {sog}', () => {
      const grid = gridOf(`{sog}\n${body}\n{eog}`);

      expect(grid.rows).toHaveLength(2);
    });

    it('reads a legacy shape value', () => {
      const grid = gridOf(`{start_of_grid: 4x4}\n${body}\n{end_of_grid}`);

      expect(grid.hasExplicitShape).toBe(true);
      expect(grid.shape.cells).toEqual(16);
      expect(grid.label).toBeNull();
    });

    it('reads a legacy shape followed by a label', () => {
      const grid = gridOf(`{start_of_grid: 4x4 Intro}\n${body}\n{end_of_grid}`);

      expect(grid.shape.cells).toEqual(16);
      expect(grid.label).toEqual('Intro');
    });

    it('reads a legacy label without a shape', () => {
      const grid = gridOf(`{start_of_grid: Intro}\n${body}\n{end_of_grid}`);

      expect(grid.hasExplicitShape).toBe(false);
      expect(grid.label).toEqual('Intro');
    });

    it('reads shape and label attributes', () => {
      const grid = gridOf(`{start_of_grid shape="1+4x4+1" label="Intro"}\n${body}\n{end_of_grid}`);

      expect(grid.hasExplicitShape).toBe(true);
      expect(grid.shape).toEqual({
        leftMargin: 1, cells: 16, rightMargin: 1, measures: 4, beats: 4,
      });
      expect(grid.label).toEqual('Intro');
    });

    describe('without a renderable start tag line', () => {
      const rows = '| A . | B . |\n| C . | D . |';
      const cells = { leftMargin: 0, rightMargin: 0 };

      it.each([
        ['{start_of_grid: shape="2x2"}', '{end_of_grid}', 2],
        ['{start_of_grid shape="2x2"}', '{end_of_grid}', 2],
        ['{start_of_grid shape="1+2x2+1"}', '{end_of_grid}', 2],
        ['{sog: shape="2x2"}', '{eog}', 2],
      ])('reads the shape of %s', (startTag, endTag) => {
        const grid = gridOf(`${startTag}\n${rows}\n${endTag}`);
        const expected = startTag.includes('1+2x2+1') ? { leftMargin: 1, rightMargin: 1 } : cells;

        expect(grid.hasExplicitShape).toBe(true);
        expect(grid.shape).toEqual({
          ...expected, cells: 4, measures: 2, beats: 2,
        });
        expect(grid.label).toBeNull();
        expect(grid.rows).toHaveLength(2);
        expect(grid.rows[0].cells).toHaveLength(4);
      });

      it('keeps the paragraph lines as they were', () => {
        const song = parse(`{start_of_grid: shape="2x2"}\n${rows}\n{end_of_grid}`);

        expect(song.paragraphs[0].lines).toHaveLength(2);
      });

      it('gives a second grid section its own shape', () => {
        const song = parse(
          `{start_of_grid: shape="2x2"}\n${rows}\n{end_of_grid}\n\n{start_of_grid}\n| A . . . . . |\n{end_of_grid}`,
        );
        const [first, second] = song.paragraphs.filter((p) => p.type === 'grid').map((p) => p.grid as Grid);

        expect(first.hasExplicitShape).toBe(true);
        expect(second.hasExplicitShape).toBe(false);
        expect(second.shape.cells).toEqual(6);
      });

      it('keeps the explicit shape after transpose and clone', () => {
        const song = parse(`{start_of_grid shape="2x2"}\n${rows}\n{end_of_grid}`);
        const transposed = song.transpose(2).paragraphs.find((p) => p.type === 'grid')?.grid as Grid;
        const cloned = song.clone().paragraphs.find((p) => p.type === 'grid')?.grid as Grid;

        expect(transposed.hasExplicitShape).toBe(true);
        expect(transposed.shape.measures).toEqual(2);
        expect(transposed.rows[0].cells[0]).toEqual({ type: 'chord', chord: 'B' });
        expect(cloned.hasExplicitShape).toBe(true);
      });

      it('keeps working for the labelled forms', () => {
        const grid = gridOf(`{start_of_grid shape="2x2" label="Intro"}\n${rows}\n{end_of_grid}`);

        expect(grid.hasExplicitShape).toBe(true);
        expect(grid.label).toEqual('Intro');
        expect(grid.rows).toHaveLength(2);
      });
    });

    it('returns null for a non-grid paragraph', () => {
      const song = parse('{start_of_verse}\n| A |\n{end_of_verse}');

      expect(song.paragraphs.every((paragraph) => paragraph.grid === null)).toBe(true);
      expect(Grid.fromParagraph(song.paragraphs[0])).toBeNull();
    });

    it('exposes transposed chords after song.transpose', () => {
      const song = parse('{start_of_grid}\n| C . G/B . |\n{end_of_grid}');
      const grid = song.transpose(2).paragraphs.find((p) => p.type === 'grid')?.grid as Grid;

      expect(grid.rows[0].cells).toEqual([
        { type: 'chord', chord: 'D' },
        { type: 'empty' },
        { type: 'chord', chord: 'A/C#' },
        { type: 'empty' },
      ]);
    });
  });
});
