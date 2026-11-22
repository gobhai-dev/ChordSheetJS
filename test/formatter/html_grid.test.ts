/* eslint-disable jest/expect-expect -- assertions live in the expectGrid helper */
import '../util/matchers';

import { stripHTML } from '../../src/template_helpers';

import { ChordProParser, HtmlDivFormatter, HtmlTableFormatter } from '../../src';

const bar = (variant: string, symbol: string, volta = ''): string => (
  `<span class="barline barline-${variant}">${symbol}</span>${volta}`
);
const single = bar('single', '|');
const part = (name: string, text: string): string => (text ? `<span class="chord-${name}">${text}</span>` : '');
const plainChord = (name: string): string => `<span class="chord">${name}</span>`;
const chord = (root: string, quality = '', extensions = '', bass = '', optional = false): string => (
  `<span class="chord">${[
    optional ? part('marker', '(') : '', part('root', root), part('quality', quality),
    part('extensions', extensions), part('bass', bass), optional ? part('marker', ')') : '',
  ].join('')}</span>`
);
const acc = (letter: string, accidental: string): string => (
  `${letter}<span class="chord-accidental">${accidental}</span>`
);
const alts = (base: string, ...tokens: string[]): string => {
  const stacked = tokens.length > 1 ? ' chord-alterations-stacked' : '';
  const items = tokens.map((token) => `<span class="chord-alteration">${token}</span>`).join('');

  return `${base}<span class="chord-alterations${stacked}">${items}</span>`;
};
const cell = (content = ''): string => `<td class="grid-cell">${content}</td>`;
const emptyCell = (content = ''): string => `<td class="grid-cell grid-cell-empty">${content}</td>`;
const end = (content = ''): string => `<td class="grid-end">${content}</td>`;
const row = (...tds: string[]): string => `<tr class="grid-row">${tds.join('')}</tr>`;
const strumRow = (...tds: string[]): string => `<tr class="grid-row grid-row-strum">${tds.join('')}</tr>`;
const textRow = (colspan: number, text: string): string => (
  `<tr class="grid-row grid-row-text"><td class="grid-text" colspan="${colspan}">${text}</td></tr>`
);
const margin = (text = '', colspan = 1): string => `<td class="grid-margin" colspan="${colspan}">${text}</td>`;
const comment = (text = '', colspan = 1): string => `<td class="grid-comment" colspan="${colspan}">${text}</td>`;

const cols = (cells: number, leftMargin = 0, rightMargin = 0): string => [
  leftMargin > 0 ? `<col class="grid-col-margin" span="${leftMargin}">` : '',
  `<col class="grid-col-cell" span="${cells}">`,
  '<col class="grid-col-end">',
  rightMargin > 0 ? `<col class="grid-col-comment" span="${rightMargin}">` : '',
].join('');

const table = (colgroup: string, ...rows: string[]): string => (
  `<div class="grid-scroll"><table class="grid-table"><colgroup>${colgroup}</colgroup>${rows.join('')}</table></div>`
);

type Formatter = typeof HtmlDivFormatter | typeof HtmlTableFormatter;

const wrappers: Record<string, { label: (text: string) => string, wrap: (body: string) => string }> = {
  HtmlDivFormatter: {
    label: (text) => `<div class="row"><h3 class="label">${text}</h3></div>`,
    wrap: (body) => `<div class="chord-sheet"><div class="paragraph grid">${body}</div></div>`,
  },
  HtmlTableFormatter: {
    label: (text) => (
      `<table class="row"><tr><td class="label-wrapper"><h3 class="label">${text}</h3></td></tr></table>`
    ),
    wrap: (body) => `<div class="chord-sheet"><div class="paragraph grid">${body}</div></div>`,
  },
};

const grid = (lines: string[], attributes = ''): string => (
  `{start_of_grid${attributes}}\n${lines.join('\n')}\n{end_of_grid}`
);

describe.each([
  ['HtmlDivFormatter', HtmlDivFormatter],
  ['HtmlTableFormatter', HtmlTableFormatter],
] as [string, Formatter][])('%s grid rendering', (name, FormatterClass) => {
  const { label, wrap } = wrappers[name];
  const render = (chordPro: string, configuration: Record<string, any> = { renderGrids: true }): string => (
    new FormatterClass(configuration).format(new ChordProParser().parse(chordPro))
  );
  const expectGrid = (chordPro: string, expected: string, labelText = ''): void => {
    const body = (labelText ? label(labelText) : '') + expected;
    expect(render(chordPro)).toEqual(stripHTML(wrap(body)));
  };

  it('renders a simple two-row grid', () => {
    expectGrid(
      grid(['| A . | B . |', '| C . | D . |']),
      table(
        cols(4),
        row(cell(single + chord('A')), emptyCell(), cell(single + chord('B')), emptyCell(), end(single)),
        row(cell(single + chord('C')), emptyCell(), cell(single + chord('D')), emptyCell(), end(single)),
      ),
    );
  });

  it('renders left margin and right comment columns on every row', () => {
    expectGrid(
      grid(['Intro | A . | B . | x2', '| C . | D . |']),
      table(
        cols(4, 1, 1),
        row(
          margin('Intro'),
          cell(single + chord('A')),
          emptyCell(),
          cell(single + chord('B')),
          emptyCell(),
          end(single),
          comment('x2'),
        ),
        row(
          margin(),
          cell(single + chord('C')),
          emptyCell(),
          cell(single + chord('D')),
          emptyCell(),
          end(single),
          comment(),
        ),
      ),
    );
  });

  it('pads short rows and attaches the closing bar to the next empty cell', () => {
    expectGrid(
      grid(['| A . | B . |', '| C |']),
      table(
        cols(4),
        row(cell(single + chord('A')), emptyCell(), cell(single + chord('B')), emptyCell(), end(single)),
        row(cell(single + chord('C')), emptyCell(single), emptyCell(), emptyCell(), end()),
      ),
    );
  });

  it('puts every closing bar of a full row in the end cell', () => {
    expectGrid(
      grid(['| A . |', '| B . || |']),
      table(
        cols(2),
        row(cell(single + chord('A')), emptyCell(), end(single)),
        row(cell(single + chord('B')), emptyCell(), end(bar('double', '||') + single)),
      ),
    );
  });

  it('attaches consecutive bars to the cell that follows', () => {
    expectGrid(
      grid(['| :| A |']),
      table(cols(1), row(cell(single + bar('repeat-end', ':|') + chord('A')), end(single))),
    );
  });

  it('renders every bar variant with its canonical symbol', () => {
    expectGrid(
      grid(['|: A || B |. C :| D :|: E | F { G } H }{ I |']),
      table(
        cols(9),
        row(
          cell(bar('repeat-start', '|:') + chord('A')),
          cell(bar('double', '||') + chord('B')),
          cell(bar('end', '|.') + chord('C')),
          cell(bar('repeat-end', ':|') + chord('D')),
          cell(bar('repeat-end-start', ':|:') + chord('E')),
          cell(single + chord('F')),
          cell(bar('repeat-start', '|:') + chord('G')),
          cell(bar('repeat-end', ':|') + chord('H')),
          cell(bar('repeat-end-start', ':|:') + chord('I')),
          end(single),
        ),
      ),
    );
  });

  it('renders a volta number after the bar', () => {
    expectGrid(
      grid(['| A | B :|1 C |2 D |']),
      table(
        cols(4),
        row(
          cell(single + chord('A')),
          cell(single + chord('B')),
          cell(bar('repeat-end', ':|', '<span class="grid-volta">1</span>') + chord('C')),
          cell(bar('single', '|', '<span class="grid-volta">2</span>') + chord('D')),
          end(single),
        ),
      ),
    );
  });

  it('renders empty, slash, repeat and multi-chord cells', () => {
    const slash = '<span class="rhythm-symbol rhythm-symbol-continuation">/</span>';
    const multi = (...parts: string[]): string => `<span class="grid-multi">${parts.join('')}</span>`;

    expectGrid(
      grid(['| A . / % %% D~Em ~G .~/ |']),
      table(
        cols(8),
        row(
          cell(single + chord('A')),
          emptyCell(),
          cell(slash),
          cell('<span class="grid-repeat">%</span>'),
          cell('<span class="grid-repeat">%%</span>'),
          cell(multi(chord('D'), chord('E', 'm'))),
          cell(multi('<span class="grid-multi-empty"></span>', chord('G'))),
          cell(multi('<span class="grid-multi-empty"></span>', slash)),
          end(single),
        ),
      ),
    );
  });

  it('escapes HTML in chord and margin text', () => {
    expectGrid(
      grid(['a<b | A&B |']),
      table(cols(1, 1), row(margin('a&lt;b'), cell(single + plainChord('A&amp;B')), end(single))),
    );
  });

  it('renders a text row spanning all columns', () => {
    expectGrid(
      grid(['Intro | A . | x2', 'just some text', '| B . |']),
      table(
        cols(2, 1, 1),
        row(margin('Intro'), cell(single + chord('A')), emptyCell(), end(single), comment('x2')),
        textRow(5, 'just some text'),
        row(margin(), cell(single + chord('B')), emptyCell(), end(single), comment()),
      ),
    );
  });

  it('renders a strum row', () => {
    expectGrid(
      grid(['| A . |', '|s dn up |']),
      table(
        cols(2),
        row(cell(single + chord('A')), emptyCell(), end(single)),
        strumRow(cell(single + plainChord('dn')), cell(plainChord('up')), end(single)),
      ),
    );
  });

  it('renders an explicit shape wider than the content', () => {
    expectGrid(
      grid(['| A . |'], ': 1+4x4+1'),
      table(
        cols(16, 1, 1),
        row(
          margin(),
          cell(single + chord('A')),
          emptyCell(),
          emptyCell(single),
          ...Array(13).fill(emptyCell()),
          end(),
          comment(),
        ),
      ),
    );
  });

  it('uses a margin column when an explicit shape has none but a row has margin text', () => {
    expectGrid(
      grid(['Intro | A . | B . | x2', '| C . | D . |'], ': 2x2'),
      table(
        cols(4, 1, 1),
        row(
          margin('Intro'),
          cell(single + chord('A')),
          emptyCell(),
          cell(single + chord('B')),
          emptyCell(),
          end(single),
          comment('x2'),
        ),
        row(
          margin(),
          cell(single + chord('C')),
          emptyCell(),
          cell(single + chord('D')),
          emptyCell(),
          end(single),
          comment(),
        ),
      ),
    );
  });

  it('does not show a legacy shape value as the section label', () => {
    const html = render(grid(['| A |'], ': 2x2'));

    expect(html).not.toContain('class="label"');
    expect(html).not.toContain('2x2');
  });

  it('shows only the label of a legacy shape followed by a label', () => {
    expectGrid(
      grid(['| A |'], ': 2x2 Intro'),
      table(cols(4), row(cell(single + chord('A')), emptyCell(single), emptyCell(), emptyCell(), end())),
      'Intro',
    );
  });

  it('keeps rendering the section label', () => {
    expectGrid(
      grid(['| A |'], ': label="Intro"'),
      table(cols(1), row(cell(single + chord('A')), end(single))),
      'Intro',
    );
  });

  it('renders transposed chords', () => {
    const song = new ChordProParser().parse(grid(['| C . | G7 . |'])).transpose(2);
    const html = new FormatterClass({ renderGrids: true }).format(song);

    expect(html).toContain(chord('D'));
    expect(html).toContain(chord('A', '', '7'));
    expect(html).not.toContain(chord('G', '', '7'));
  });

  it('honours a custom scroll container class', () => {
    const html = render(grid(['| A . |']), { renderGrids: true, cssClasses: { gridScroll: 'my-scroll' } });

    expect(html).toContain('<div class="my-scroll"><table class="grid-table">');
    expect(html).toContain('</table></div>');
  });

  it('honours custom css classes', () => {
    const html = render(grid(['| A . |']), {
      renderGrids: true,
      cssClasses: {
        gridTable: 'my-grid', gridCell: 'my-cell', gridCellEmpty: 'my-empty', chord: 'my-chord',
      },
    });

    expect(html).toContain('<div class="grid-scroll"><table class="my-grid">');
    expect(html).toContain('<td class="my-cell"><span class="barline barline-single">|</span>');
    expect(html).toContain('<span class="my-chord"><span class="chord-root">A</span></span>');
    expect(html).toContain('<td class="my-cell my-empty"></td>');
  });

  describe('chord parts', () => {
    const cellOf = (source: string, configuration: Record<string, any> = { renderGrids: true }): string => (
      render(grid([`| ${source} |`]), configuration)
    );

    it.each([
      ['C', chord('C')],
      ['Am', chord('A', 'm')],
      ['Cmaj7', chord('C', 'maj', '7')],
      ['F#m7b5', chord(acc('F', '#'), 'm', alts('7', 'b5'))],
      ['Bb7#9', chord(acc('B', 'b'), '', alts('7', '#9'))],
      ['G7sus4', chord('G', '', alts('7', 'sus4'))],
      ['C/G', chord('C', '', '', '/G')],
      ['Am7/G', chord('A', 'm', '7', '/G')],
      ['(C)', chord('C', '', '', '', true)],
      ['(Am7)', chord('A', 'm', '7', '', true)],
    ])('wraps the parts of %s', (source, expected) => {
      expect(cellOf(source)).toContain(`${single}${expected}</td>`);
    });

    describe('accidentals and alterations', () => {
      const cases: [string, string][] = [
        ['C', chord('C')],
        ['Am', chord('A', 'm')],
        ['Bb', chord(acc('B', 'b'))],
        ['F#m7b5', chord(acc('F', '#'), 'm', alts('7', 'b5'))],
        ['Cmaj7', chord('C', 'maj', '7')],
        ['Ebmaj7#11', chord(acc('E', 'b'), 'maj', alts('7', '#11'))],
        ['Ab13b9', chord(acc('A', 'b'), '', alts('13', 'b9'))],
        ['C7b9#5', chord('C', '', alts('7', 'b9', '#5'))],
        ['Bb7#9#11', chord(acc('B', 'b'), '', alts('7', '#9', '#11'))],
        ['G7b9sus', chord('G', '', alts('7', 'b9', 'sus'))],
        ['D7b9b13', chord('D', '', alts('7', 'b9', 'b13'))],
        ['Db7b9#11b13', chord(acc('D', 'b'), '', alts('7', 'b9', '#11', 'b13'))],
        ['Eb7alt', chord(acc('E', 'b'), '', alts('7', 'alt'))],
        ['C7sus4', chord('C', '', alts('7', 'sus4'))],
        ['Csus4', chord('C', 'sus4')],
        ['Cadd9', chord('C', '', alts('', 'add9'))],
        ['C69', chord('C', '', '69')],
        ['C7', chord('C', '', '7')],
        ['Bb/F', chord(acc('B', 'b'), '', '', '/F')],
        ['C/Bb', chord('C', '', '', '/Bb')],
      ];

      it.each(cases)('renders %s', (source, expected) => {
        expect(cellOf(source)).toContain(`${single}${expected}</td>`);
      });

      it.each(cases.map(([source]) => [source]))('keeps the text of %s equal to the source', (source) => {
        const html = cellOf(source);
        const text = html.match(/<span class="chord">.*?<\/span><\/td>/)![0].replace(/<[^>]*>/g, '');

        expect(text).toEqual(source);
      });

      it('renders each chord of a multi-chord cell', () => {
        expect(cellOf('Bb7b9~Eb7#9#5')).toContain(
          `<span class="grid-multi">${
            chord(acc('B', 'b'), '', alts('7', 'b9'))}${chord(acc('E', 'b'), '', alts('7', '#9', '#5'))}</span>`,
        );
      });

      it('shows unicode alterations with useUnicodeModifiers', () => {
        expect(cellOf('Bb7b9#5', { renderGrids: true, useUnicodeModifiers: true })).toContain(
          chord(acc('B', '\u266d'), '', alts('7', '\u266d9', '\u266f5')),
        );
      });
    });

    it.each(['N.C.', 'dn', 'up', 'x2'])('keeps %s as plain text', (source) => {
      expect(cellOf(source)).toContain(`${single}${plainChord(source)}</td>`);
    });

    it('wraps each part of a multi-chord cell', () => {
      const html = cellOf('F#m7b5~B7');

      expect(html).toContain(
        `<span class="grid-multi">${chord(acc('F', '#'), 'm', alts('7', 'b5'))}${chord('B', '', '7')}</span>`,
      );
    });

    it('keeps accidentals as written by default', () => {
      expect(cellOf('Bb7#9')).not.toMatch(/[\u266d\u266f]/);
    });

    it('uses unicode accidentals with useUnicodeModifiers', () => {
      const html = cellOf('Bb7#9', { renderGrids: true, useUnicodeModifiers: true });

      expect(html).toContain(chord(acc('B', '\u266d'), '', alts('7', '\u266f9')));
    });

    it('wraps transposed chords', () => {
      const song = new ChordProParser().parse(grid(['| Am7/G |'])).transpose(2);

      expect(new FormatterClass({ renderGrids: true }).format(song)).toContain(chord('B', 'm', '7', '/A'));
    });

    it('uses the configured part class names', () => {
      const html = cellOf('Am7/G', {
        renderGrids: true,
        cssClasses: {
          chordRoot: 'r', chordQuality: 'q', chordExtensions: 'e', chordBass: 'b',
        },
      });

      expect(html).toContain(
        '<span class="chord"><span class="r">A</span><span class="q">m</span>' +
        '<span class="e">7</span><span class="b">/G</span></span>',
      );
    });

    it('uses the configured accidental and alteration class names', () => {
      const html = cellOf('Bb7b9#5', {
        renderGrids: true,
        cssClasses: {
          chordAccidental: 'acc', chordAlterations: 'alts', chordAlterationsStacked: 'stack', chordAlteration: 'alt',
        },
      });

      expect(html).toContain(
        '<span class="chord"><span class="chord-root">B<span class="acc">b</span></span>' +
        '<span class="chord-extensions">7<span class="alts stack"><span class="alt">b9</span>' +
        '<span class="alt">#5</span></span></span></span>',
      );
    });

    it('omits empty parts', () => {
      expect(cellOf('C')).not.toContain('chord-quality');
    });

    it('does not wrap chords when renderGrids is off', () => {
      expect(render(grid(['| Am |']), {})).not.toContain('chord-root');
    });
  });

  it('keeps the literal output when renderGrids is off', () => {
    const literal = '| A . |<br>| B . |';
    const expected = stripHTML(wrap(label('x') + (name === 'HtmlDivFormatter' ? (
      `<div class="row"><div class="literal">${literal}</div></div>`
    ) : (
      `<table class="literal"><tr><td class="contents">${literal}</td></tr></table>`
    ))));
    const chordPro = grid(['| A . |', '| B . |'], ': label="x"');

    expect(render(chordPro, {})).toEqual(expected);
    expect(render(chordPro, { renderGrids: false })).toEqual(render(chordPro, {}));
  });

  it('still uses the grid delegate when renderGrids is off', () => {
    const delegates = { grid: (text: string) => `<pre>${text}</pre>` };
    const html = render(grid(['| A |']), { delegates });

    expect(html).toContain('<pre>| A |</pre>');
    expect(html).not.toContain('grid-table');
  });

  it('does not call the grid delegate when renderGrids is on', () => {
    const delegate = jest.fn((text: string) => text);
    const html = render(grid(['| A |']), { renderGrids: true, delegates: { grid: delegate } });

    expect(delegate).not.toHaveBeenCalled();
    expect(html).toContain('grid-table');
  });

  it('leaves other literal sections unaffected', () => {
    const chordPro = '{start_of_tab}\ne|---|\n{end_of_tab}';

    expect(render(chordPro, { renderGrids: true })).toEqual(render(chordPro, {}));
    expect(render(chordPro, {})).toContain('e|---|');
  });

  it('leaves lyric sections unaffected', () => {
    const chordPro = '[C]Let it [G]be';

    expect(render(chordPro, { renderGrids: true })).toEqual(render(chordPro, {}));
  });
});

describe('default CSS', () => {
  it.each([
    ['HtmlDivFormatter', HtmlDivFormatter],
    ['HtmlTableFormatter', HtmlTableFormatter],
  ] as [string, Formatter][])('%s includes the grid rules', (_name, FormatterClass) => {
    const css = new FormatterClass().cssString();

    expect(css).toContain('.grid-table {\n  table-layout: fixed;\n  width: 100%;\n  border-collapse: collapse;\n}');
    expect(css).toContain('.grid-scroll {\n  overflow-x: auto;\n}');
    expect(css).toContain('.grid-col-cell {\n  width: 2.2em;\n}');
    expect(css).toContain('.grid-col-margin,\n.grid-col-comment {\n  width: 6ch;\n}');
    expect(css).toContain('.grid-col-end {\n  width: 1.4em;\n}');
    expect(css).toContain('.grid-cell,\n.grid-end,\n.grid-margin,\n.grid-comment {');
    expect(css).toContain('.grid-comment {\n  padding-left: 0.4em;\n}');
    expect(css).toContain('.grid-table .barline {\n  display: inline-block;');
    expect(css).toContain('.grid-table .barline-repeat-end-start {');
    expect(css).toContain('.grid-volta {\n  position: absolute;');
    expect(css).toContain('.grid-multi .chord + .chord {\n  margin-left: 0.35em;\n}');
    expect(css).not.toMatch(/#[0-9a-f]{3,6}\b|font-family/i);
  });
});
