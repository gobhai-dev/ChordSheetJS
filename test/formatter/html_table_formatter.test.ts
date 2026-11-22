import '../util/matchers';
import ChordSheetSerializer from '../../src/chord_sheet_serializer';

import { ContentType } from '../../src/serialized_types';
import { GRID } from '../../src/constants';
import { stripHTML } from '../../src/template_helpers';
import { exampleSongSolfege, exampleSongSymbol } from '../fixtures/song';

import {
  ABC,
  HtmlTableFormatter,
  LILYPOND,
  SVG,
  TAB,
  TEXTBLOCK,
} from '../../src';

import {
  chordLyricsPair,
  createSongFromAst,
  heredoc,
  html,
  section,
  tag,
} from '../util/utilities';

describe('HtmlTableFormatter', () => {
  it('formats a symbol song to a html chord sheet correctly', () => {
    const expectedChordSheet = stripHTML(`
      <h1 class="title">Let it be</h1>
      <h2 class="subtitle">ChordSheetJS example version</h2>
      <div class="chord-sheet">
        <div class="paragraph">
          <table class="row">
            <tr>
              <td class="lyrics">Written by: </td>
              <td class="lyrics">John Lennon,Paul McCartney</td>
            </tr>
          </table>
        </div>
        <div class="paragraph verse">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Verse 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord"></td>
              <td class="chord">Am</td>
              <td class="chord"></td>
              <td class="chord">C/G</td>
              <td class="chord">F</td>
              <td class="chord">C</td>
            </tr>
            <tr>
              <td class="lyrics">Let it </td>
              <td class="lyrics">be, </td>
              <td class="lyrics">let it </td>
              <td class="lyrics">be, let it </td>
              <td class="lyrics">be, let it </td>
              <td class="lyrics">be</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">D</td>
              <td class="annotation">strong</td>
              <td class="chord">G</td>
              <td class="chord">A</td>
              <td class="chord">G</td>
              <td class="chord">D/F#</td>
              <td class="chord">Em</td>
              <td class="chord">D</td>
            </tr>
            <tr>
              <td class="lyrics">Whisper </td>
              <td class="lyrics">words of </td>
              <td class="lyrics">wis</td>
              <td class="lyrics">dom, let it </td>
              <td class="lyrics">be </td>
              <td class="lyrics"> </td>
              <td class="lyrics"> </td>
              <td class="lyrics"></td>
            </tr>
          </table>
        </div>

        <div class="paragraph chorus">
          <table class="row">
            <tr>
              <td class="comment">Breakdown</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">Em</td>
              <td class="chord">F</td>
              <td class="chord">C</td>
              <td class="chord">G</td>
            </tr>
            <tr>
              <td class="lyrics">Whisper words of </td>
              <td class="lyrics">wisdom, let it </td>
              <td class="lyrics">be </td>
              <td class="lyrics"></td>
            </tr>
          </table>
        </div>

        <div class="paragraph chorus">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Chorus 2</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">G</td>
              <td class="chord">F</td>
              <td class="chord">C</td>
              <td class="chord">G</td>
            </tr>
            <tr>
              <td class="lyrics">Whisper words of </td>
              <td class="lyrics">wisdom, let it </td>
              <td class="lyrics">be </td>
              <td class="lyrics"></td>
            </tr>
          </table>
        </div>

        <div class="paragraph solo">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Solo 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">G</td>
            </tr>
            <tr>
              <td class="lyrics">Solo line 1</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">C</td>
            </tr>
            <tr>
              <td class="lyrics">Solo line 2</td>
            </tr>
          </table>
        </div>

        <div class="paragraph tab">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Tab 1</h3>
              </td>
            </tr>
          </table>

          <table class="literal">
            <tr>
              <td class="contents">
                Tab line 1<br>
                Tab line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="paragraph abc">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">ABC 1</h3>
              </td>
            </tr>
          </table>

          <table class="literal">
            <tr>
              <td class="contents">
                ABC line 1<br>
                ABC line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="paragraph ly">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">LY 1</h3>
              </td>
            </tr>
          </table>

          <table class="literal">
            <tr>
              <td class="contents">
                LY line 1<br>
                LY line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="paragraph bridge">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Bridge 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
          <tr>
            <td class="lyrics">Bridge line</td>
          </tr>
        </table>
      </div>

      <div class="paragraph grid">
        <table class="row">
          <tr>
            <td class="label-wrapper">
              <h3 class="label">Grid 1</h3>
            </td>
          </tr>
        </table>

        <table class="literal">
          <tr>
            <td class="contents">
              Grid line 1<br>
              Grid line 2
            </td>
          </tr>
        </table>
      </div>

      <div class="paragraph textblock">
        <table class="row">
          <tr>
            <td class="label-wrapper">
              <h3 class="label">Disclaimer</h3>
            </td>
          </tr>
        </table>

        <table class="literal">
          <tr>
            <td class="contents">
              Textblock line 1<br>
              Textblock line 2
            </td>
          </tr>
        </table>
      </div>
    </div>`);

    expect(new HtmlTableFormatter().format(exampleSongSymbol)).toEqual(expectedChordSheet);
  });

  it('formats a solfege song to a html chord sheet correctly', () => {
    const expectedChordSheet = stripHTML(`
      <h1 class="title">Let it be</h1>
      <h2 class="subtitle">ChordSheetJS example version</h2>
      <div class="chord-sheet">
        <div class="paragraph">
          <table class="row">
            <tr>
              <td class="lyrics">Written by: </td>
              <td class="lyrics">John Lennon,Paul McCartney</td>
            </tr>
          </table>
        </div>
        <div class="paragraph verse">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Verse 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord"></td>
              <td class="chord">Lam</td>
              <td class="chord">Do/Sol</td>
              <td class="chord">Fa</td>
              <td class="chord">Do</td>
            </tr>
            <tr>
              <td class="lyrics">Let it </td>
              <td class="lyrics">be, let it </td>
              <td class="lyrics">be, let it </td>
              <td class="lyrics">be, let it </td>
              <td class="lyrics">be</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">Re</td>
              <td class="annotation">strong</td>
              <td class="chord">Sol</td>
              <td class="chord">La</td>
              <td class="chord">Sol</td>
              <td class="chord">Re/Fa#</td>
              <td class="chord">Mim</td>
              <td class="chord">Re</td>
            </tr>
            <tr>
              <td class="lyrics">Whisper </td>
              <td class="lyrics">words of </td>
              <td class="lyrics">wis</td>
              <td class="lyrics">dom, let it </td>
              <td class="lyrics">be </td>
              <td class="lyrics"> </td>
              <td class="lyrics"> </td>
              <td class="lyrics"></td>
            </tr>
          </table>
        </div>

        <div class="paragraph chorus">
          <table class="row">
            <tr>
              <td class="comment">Breakdown</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">Mim</td>
              <td class="chord">Fa</td>
              <td class="chord">Do</td>
              <td class="chord">Sol</td>
            </tr>
            <tr>
              <td class="lyrics">Whisper words of </td>
              <td class="lyrics">wisdom, let it </td>
              <td class="lyrics">be </td>
              <td class="lyrics"></td>
            </tr>
          </table>
        </div>

        <div class="paragraph chorus">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Chorus 2</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">Mim</td>
              <td class="chord">Fa</td>
              <td class="chord">Do</td>
              <td class="chord">Sol</td>
            </tr>
            <tr>
              <td class="lyrics">Whisper words of </td>
              <td class="lyrics">wisdom, let it </td>
              <td class="lyrics">be </td>
              <td class="lyrics"></td>
            </tr>
          </table>
        </div>

        <div class="paragraph solo">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Solo 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">Sol</td>
            </tr>
            <tr>
              <td class="lyrics">Solo line 1</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">Do</td>
            </tr>
            <tr>
              <td class="lyrics">Solo line 2</td>
            </tr>
          </table>
        </div>

        <div class="paragraph tab">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Tab 1</h3>
              </td>
            </tr>
          </table>

          <table class="literal">
            <tr>
              <td class="contents">
                Tab line 1<br>
                Tab line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="paragraph abc">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">ABC 1</h3>
              </td>
            </tr>
          </table>

          <table class="literal">
            <tr>
              <td class="contents">
                ABC line 1<br>
                ABC line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="paragraph ly">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">LY 1</h3>
              </td>
            </tr>
          </table>

          <table class="literal">
            <tr>
              <td class="contents">
                LY line 1<br>
                LY line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="paragraph bridge">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Bridge 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="lyrics">Bridge line</td>
            </tr>
          </table>
        </div>

        <div class="paragraph grid">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Grid 1</h3>
              </td>
            </tr>
          </table>

          <table class="literal">
            <tr>
              <td class="contents">
                Grid line 1<br>
                Grid line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="paragraph textblock">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Disclaimer</h3>
              </td>
            </tr>
          </table>

          <table class="literal">
            <tr>
              <td class="contents">
                Textblock line 1<br>
                Textblock line 2
              </td>
            </tr>
          </table>
        </div>
      </div>
    `);

    expect(new HtmlTableFormatter().format(exampleSongSolfege)).toEqual(expectedChordSheet);
  });

  it('applies custom css classes', () => {
    const expectedChordSheet = stripHTML(`
      <h1 class="TITLE">Let it be</h1>
      <h2 class="SUBTITLE">ChordSheetJS example version</h2>
      <div class="CHORD-SHEET">
        <div class="PARAGRAPH">
          <table class="ROW">
            <tr>
              <td class="LYRICS">Written by: </td>
              <td class="LYRICS">John Lennon,Paul McCartney</td>
            </tr>
          </table>
        </div>
        <div class="PARAGRAPH verse">
          <table class="ROW">
            <tr>
              <td class="LABEL-WRAPPER">
                <h3 class="LABEL">Verse 1</h3>
              </td>
            </tr>
          </table>
          <table class="ROW">
            <tr>
              <td class="CHORD"></td>
              <td class="CHORD">Am</td>
              <td class="CHORD"></td>
              <td class="CHORD">C/G</td>
              <td class="CHORD">F</td>
              <td class="CHORD">C</td>
            </tr>
            <tr>
              <td class="LYRICS">Let it </td>
              <td class="LYRICS">be, </td>
              <td class="LYRICS">let it </td>
              <td class="LYRICS">be, let it </td>
              <td class="LYRICS">be, let it </td>
              <td class="LYRICS">be</td>
            </tr>
          </table>
          <table class="ROW">
            <tr>
              <td class="CHORD">D</td>
              <td class="ANNOTATION">strong</td>
              <td class="CHORD">G</td>
              <td class="CHORD">A</td>
              <td class="CHORD">G</td>
              <td class="CHORD">D/F#</td>
              <td class="CHORD">Em</td>
              <td class="CHORD">D</td>
            </tr>
            <tr>
              <td class="LYRICS">Whisper </td>
              <td class="LYRICS">words of </td>
              <td class="LYRICS">wis</td>
              <td class="LYRICS">dom, let it </td>
              <td class="LYRICS">be </td>
              <td class="LYRICS"> </td>
              <td class="LYRICS"> </td>
              <td class="LYRICS"></td>
            </tr>
          </table>
        </div>

        <div class="PARAGRAPH chorus">
          <table class="ROW">
            <tr>
              <td class="COMMENT">Breakdown</td>
            </tr>
          </table>
          <table class="ROW">
            <tr>
              <td class="CHORD">Em</td>
              <td class="CHORD">F</td>
              <td class="CHORD">C</td>
              <td class="CHORD">G</td>
            </tr>
            <tr>
              <td class="LYRICS">Whisper words of </td>
              <td class="LYRICS">wisdom, let it </td>
              <td class="LYRICS">be </td>
              <td class="LYRICS"></td>
            </tr>
          </table>
        </div>

        <div class="PARAGRAPH chorus">
          <table class="ROW">
            <tr>
              <td class="LABEL-WRAPPER">
                <h3 class="LABEL">Chorus 2</h3>
              </td>
            </tr>
          </table>
          <table class="ROW">
            <tr>
              <td class="CHORD">G</td>
              <td class="CHORD">F</td>
              <td class="CHORD">C</td>
              <td class="CHORD">G</td>
            </tr>
            <tr>
              <td class="LYRICS">Whisper words of </td>
              <td class="LYRICS">wisdom, let it </td>
              <td class="LYRICS">be </td>
              <td class="LYRICS"></td>
            </tr>
          </table>
        </div>

        <div class="PARAGRAPH solo">
          <table class="ROW">
            <tr>
              <td class="LABEL-WRAPPER">
                <h3 class="LABEL">Solo 1</h3>
              </td>
            </tr>
          </table>
          <table class="ROW">
            <tr>
              <td class="CHORD">G</td>
            </tr>
            <tr>
              <td class="LYRICS">Solo line 1</td>
            </tr>
          </table>
          <table class="ROW">
            <tr>
              <td class="CHORD">C</td>
            </tr>
            <tr>
              <td class="LYRICS">Solo line 2</td>
            </tr>
          </table>
        </div>

        <div class="PARAGRAPH tab">
          <table class="ROW">
            <tr>
              <td class="LABEL-WRAPPER">
                <h3 class="LABEL">Tab 1</h3>
              </td>
            </tr>
          </table>

          <table class="LITERAL">
            <tr>
              <td class="CONTENTS">
                Tab line 1<br>
                Tab line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="PARAGRAPH abc">
          <table class="ROW">
            <tr>
              <td class="LABEL-WRAPPER">
                <h3 class="LABEL">ABC 1</h3>
              </td>
            </tr>
          </table>

          <table class="LITERAL">
            <tr>
              <td class="CONTENTS">
                ABC line 1<br>
                ABC line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="PARAGRAPH ly">
          <table class="ROW">
            <tr>
              <td class="LABEL-WRAPPER">
                <h3 class="LABEL">LY 1</h3>
              </td>
            </tr>
          </table>

          <table class="LITERAL">
            <tr>
              <td class="CONTENTS">
                LY line 1<br>
                LY line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="PARAGRAPH bridge">
          <table class="ROW">
            <tr>
              <td class="LABEL-WRAPPER">
                <h3 class="LABEL">Bridge 1</h3>
              </td>
            </tr>
          </table>
          <table class="ROW">
          <tr>
            <td class="LYRICS">Bridge line</td>
          </tr>
        </table>
      </div>

      <div class="PARAGRAPH grid">
        <table class="ROW">
          <tr>
            <td class="LABEL-WRAPPER">
              <h3 class="LABEL">Grid 1</h3>
            </td>
          </tr>
        </table>

        <table class="LITERAL">
          <tr>
            <td class="CONTENTS">
              Grid line 1<br>
              Grid line 2
            </td>
          </tr>
        </table>
      </div>

      <div class="PARAGRAPH textblock">
        <table class="ROW">
          <tr>
            <td class="LABEL-WRAPPER">
              <h3 class="LABEL">Disclaimer</h3>
            </td>
          </tr>
        </table>

        <table class="LITERAL">
          <tr>
            <td class="CONTENTS">
              Textblock line 1<br>
              Textblock line 2
            </td>
          </tr>
        </table>
      </div>
    </div>`);

    const formatter = new HtmlTableFormatter({
      cssClasses: {
        annotation: 'ANNOTATION',
        chord: 'CHORD',
        chordSheet: 'CHORD-SHEET',
        column: 'COLUMN',
        comment: 'COMMENT',
        emptyLine: 'EMPTY-LINE',
        image: 'IMAGE',
        label: 'LABEL',
        labelWrapper: 'LABEL-WRAPPER',
        line: 'LINE',
        literal: 'LITERAL',
        literalContents: 'CONTENTS',
        lyrics: 'LYRICS',
        paragraph: 'PARAGRAPH',
        row: 'ROW',
        subtitle: 'SUBTITLE',
        title: 'TITLE',
      },
    });
    expect(formatter.format(exampleSongSymbol)).toEqual(expectedChordSheet);
  });

  describe('with option renderBlankLines:false', () => {
    it('does not include HTML for blank lines', () => {
      const songWithBlankLine = createSongFromAst([
        [
          chordLyricsPair('C', 'Whisper words of wisdom'),
        ],

        [],

        [
          chordLyricsPair('Am', 'Whisper words of wisdom'),
        ],
      ]);

      const expectedChordSheet = stripHTML(`
        <div class="chord-sheet">
          <div class="paragraph">
            <table class="row">
              <tr>
                <td class="chord">C</td>
              </tr>
              <tr>
                <td class="lyrics">Whisper words of wisdom</td>
              </tr>
            </table>
          </div>
          <div class="paragraph">
            <table class="row">
              <tr>
                <td class="chord">Am</td>
              </tr>
              <tr>
                <td class="lyrics">Whisper words of wisdom</td>
              </tr>
            </table>
          </div>
        </div>
      `);

      const formatter = new HtmlTableFormatter({ renderBlankLines: false });

      expect(formatter.format(songWithBlankLine)).toEqual(expectedChordSheet);
    });
  });

  it('generates a CSS string', () => {
    const expectedCss = heredoc`
      .title {
        font-size: 1.5em;
      }

      .subtitle {
        font-size: 1.1em;
      }

      .row,
      .line,
      .literal {
        border-spacing: 0;
        color: inherit;
      }

      .annotation,
      .chord,
      .comment,
      .contents,
      .label-wrapper,
      .literal,
      .lyrics {
        padding: 3px 0;
      }

      .chord:not(:last-child) {
        padding-right: 10px;
      }

      .paragraph {
        margin-bottom: 1em;
      }

      .grid-scroll {
        overflow-x: auto;
      }

      .grid-table {
        table-layout: fixed;
        width: 100%;
        border-collapse: collapse;
      }

      .grid-col-cell {
        width: 2.2em;
      }

      .grid-col-margin,
      .grid-col-comment {
        width: 6ch;
      }

      .grid-col-end {
        width: 1.4em;
      }

      .grid-cell,
      .grid-end,
      .grid-margin,
      .grid-comment {
        white-space: nowrap;
        padding: 0;
        text-align: left;
      }

      .grid-comment {
        padding-left: 0.4em;
      }

      .grid-cell,
      .grid-end {
        height: 2.8em;
        vertical-align: middle;
      }

      .grid-cell {
        position: relative;
      }

      .grid-cell > *,
      .grid-end > * {
        vertical-align: middle;
      }

      .grid-margin,
      .grid-comment {
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 0.85em;
        font-style: italic;
      }

      .grid-cell .chord,
      .grid-repeat,
      .grid-table .rhythm-symbol {
        font-weight: 700;
      }

      .grid-cell .chord {
        white-space: nowrap;
      }

      .grid-cell .chord-root {
        font-size: 1.5em;
      }

      .grid-cell .chord-quality,
      .grid-cell .chord-extensions {
        font-size: 0.8em;
        margin-left: 0.04em;
      }

      .grid-cell .chord-accidental {
        display: inline-block;
        width: 0;
        font-size: 0.62em;
        vertical-align: 0.62em;
        margin-left: 0.03em;
      }

      .grid-cell .chord-root:last-child > .chord-accidental {
        width: auto;
      }

      .grid-cell .chord-alterations {
        font-size: 0.9em;
        margin-left: 0.12em;
      }

      .grid-cell .chord-alterations-stacked {
        display: inline-grid;
        font-size: 0.8em;
        grid-template-rows: auto auto;
        grid-auto-flow: column;
        column-gap: 0.15em;
        line-height: 1;
        vertical-align: middle;
      }

      .grid-cell .chord-bass {
        font-size: 0.72em;
        position: relative;
        top: 0.3em;
        margin-left: 0.05em;
      }

      .grid-multi .chord {
        font-size: 0.78em;
      }

      .grid-multi .chord + .chord {
        margin-left: 0.35em;
      }

      .grid-repeat,
      .grid-table .rhythm-symbol {
        font-size: 1.3em;
        opacity: 0.75;
      }

      .grid-table .barline {
        display: inline-block;
        box-sizing: content-box;
        height: 2.2em;
        width: 0;
        margin-right: 0.35em;
        vertical-align: middle;
        overflow: hidden;
        white-space: nowrap;
        text-indent: -99em;
        border-left: 0.1em solid currentColor;
      }

      .grid-table .barline-double {
        width: 0.16em;
        border-right: 0.1em solid currentColor;
      }

      .grid-table .barline-end {
        width: 0.16em;
        border-right: 0.3em solid currentColor;
      }

      .grid-table .barline-repeat-start {
        width: 0.72em;
        border-left-width: 0.3em;
        background: linear-gradient(currentColor, currentColor) 0.16em 0 / 0.1em 100% no-repeat,
          radial-gradient(circle closest-side, currentColor 92%, transparent) 100% 36% / 0.26em 0.26em no-repeat,
          radial-gradient(circle closest-side, currentColor 92%, transparent) 100% 64% / 0.26em 0.26em no-repeat;
      }

      .grid-table .barline-repeat-end {
        width: 0.72em;
        border-left: 0;
        border-right: 0.3em solid currentColor;
        background: linear-gradient(currentColor, currentColor) calc(100% - 0.16em) 0 / 0.1em 100% no-repeat,
          radial-gradient(circle closest-side, currentColor 92%, transparent) 0 36% / 0.26em 0.26em no-repeat,
          radial-gradient(circle closest-side, currentColor 92%, transparent) 0 64% / 0.26em 0.26em no-repeat;
      }

      .grid-table .barline-repeat-end-start {
        width: 1.3em;
        border-left: 0;
        background: linear-gradient(currentColor, currentColor) 50% 0 / 0.3em 100% no-repeat,
          linear-gradient(currentColor, currentColor) calc(50% - 0.31em) 0 / 0.1em 100% no-repeat,
          linear-gradient(currentColor, currentColor) calc(50% + 0.31em) 0 / 0.1em 100% no-repeat,
          radial-gradient(circle closest-side, currentColor 92%, transparent) 0 36% / 0.26em 0.26em no-repeat,
          radial-gradient(circle closest-side, currentColor 92%, transparent) 0 64% / 0.26em 0.26em no-repeat,
          radial-gradient(circle closest-side, currentColor 92%, transparent) 100% 36% / 0.26em 0.26em no-repeat,
          radial-gradient(circle closest-side, currentColor 92%, transparent) 100% 64% / 0.26em 0.26em no-repeat;
      }

      .grid-volta {
        position: absolute;
        top: 0;
        left: 0;
        min-width: 2.6em;
        padding-left: 0.35em;
        border-top: 0.12em solid currentColor;
        border-left: 0.12em solid currentColor;
        font-size: 0.7em;
        font-weight: 700;
        line-height: 1.3;
      }`;

    const actualCss = new HtmlTableFormatter().cssString();
    expect(actualCss).toEqual(expectedCss);
  });

  it('generates a scoped CSS string from the instance method', () => {
    const expectedCss = heredoc`
      .someScope .title {
        font-size: 1.5em;
      }

      .someScope .subtitle {
        font-size: 1.1em;
      }

      .someScope .row,
      .someScope .line,
      .someScope .literal {
        border-spacing: 0;
        color: inherit;
      }

      .someScope .annotation,
      .someScope .chord,
      .someScope .comment,
      .someScope .contents,
      .someScope .label-wrapper,
      .someScope .literal,
      .someScope .lyrics {
        padding: 3px 0;
      }

      .someScope .chord:not(:last-child) {
        padding-right: 10px;
      }

      .someScope .paragraph {
        margin-bottom: 1em;
      }

      .someScope .grid-scroll {
        overflow-x: auto;
      }

      .someScope .grid-table {
        table-layout: fixed;
        width: 100%;
        border-collapse: collapse;
      }

      .someScope .grid-col-cell {
        width: 2.2em;
      }

      .someScope .grid-col-margin,
      .someScope .grid-col-comment {
        width: 6ch;
      }

      .someScope .grid-col-end {
        width: 1.4em;
      }

      .someScope .grid-cell,
      .someScope .grid-end,
      .someScope .grid-margin,
      .someScope .grid-comment {
        white-space: nowrap;
        padding: 0;
        text-align: left;
      }

      .someScope .grid-comment {
        padding-left: 0.4em;
      }

      .someScope .grid-cell,
      .someScope .grid-end {
        height: 2.8em;
        vertical-align: middle;
      }

      .someScope .grid-cell {
        position: relative;
      }

      .someScope .grid-cell > *,
      .someScope .grid-end > * {
        vertical-align: middle;
      }

      .someScope .grid-margin,
      .someScope .grid-comment {
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 0.85em;
        font-style: italic;
      }

      .someScope .grid-cell .chord,
      .someScope .grid-repeat,
      .someScope .grid-table .rhythm-symbol {
        font-weight: 700;
      }

      .someScope .grid-cell .chord {
        white-space: nowrap;
      }

      .someScope .grid-cell .chord-root {
        font-size: 1.5em;
      }

      .someScope .grid-cell .chord-quality,
      .someScope .grid-cell .chord-extensions {
        font-size: 0.8em;
        margin-left: 0.04em;
      }

      .someScope .grid-cell .chord-accidental {
        display: inline-block;
        width: 0;
        font-size: 0.62em;
        vertical-align: 0.62em;
        margin-left: 0.03em;
      }

      .someScope .grid-cell .chord-root:last-child > .chord-accidental {
        width: auto;
      }

      .someScope .grid-cell .chord-alterations {
        font-size: 0.9em;
        margin-left: 0.12em;
      }

      .someScope .grid-cell .chord-alterations-stacked {
        display: inline-grid;
        font-size: 0.8em;
        grid-template-rows: auto auto;
        grid-auto-flow: column;
        column-gap: 0.15em;
        line-height: 1;
        vertical-align: middle;
      }

      .someScope .grid-cell .chord-bass {
        font-size: 0.72em;
        position: relative;
        top: 0.3em;
        margin-left: 0.05em;
      }

      .someScope .grid-multi .chord {
        font-size: 0.78em;
      }

      .someScope .grid-multi .chord + .chord {
        margin-left: 0.35em;
      }

      .someScope .grid-repeat,
      .someScope .grid-table .rhythm-symbol {
        font-size: 1.3em;
        opacity: 0.75;
      }

      .someScope .grid-table .barline {
        display: inline-block;
        box-sizing: content-box;
        height: 2.2em;
        width: 0;
        margin-right: 0.35em;
        vertical-align: middle;
        overflow: hidden;
        white-space: nowrap;
        text-indent: -99em;
        border-left: 0.1em solid currentColor;
      }

      .someScope .grid-table .barline-double {
        width: 0.16em;
        border-right: 0.1em solid currentColor;
      }

      .someScope .grid-table .barline-end {
        width: 0.16em;
        border-right: 0.3em solid currentColor;
      }

      .someScope .grid-table .barline-repeat-start {
        width: 0.72em;
        border-left-width: 0.3em;
        background: linear-gradient(currentColor, currentColor) 0.16em 0 / 0.1em 100% no-repeat,
          radial-gradient(circle closest-side, currentColor 92%, transparent) 100% 36% / 0.26em 0.26em no-repeat,
          radial-gradient(circle closest-side, currentColor 92%, transparent) 100% 64% / 0.26em 0.26em no-repeat;
      }

      .someScope .grid-table .barline-repeat-end {
        width: 0.72em;
        border-left: 0;
        border-right: 0.3em solid currentColor;
        background: linear-gradient(currentColor, currentColor) calc(100% - 0.16em) 0 / 0.1em 100% no-repeat,
          radial-gradient(circle closest-side, currentColor 92%, transparent) 0 36% / 0.26em 0.26em no-repeat,
          radial-gradient(circle closest-side, currentColor 92%, transparent) 0 64% / 0.26em 0.26em no-repeat;
      }

      .someScope .grid-table .barline-repeat-end-start {
        width: 1.3em;
        border-left: 0;
        background: linear-gradient(currentColor, currentColor) 50% 0 / 0.3em 100% no-repeat,
          linear-gradient(currentColor, currentColor) calc(50% - 0.31em) 0 / 0.1em 100% no-repeat,
          linear-gradient(currentColor, currentColor) calc(50% + 0.31em) 0 / 0.1em 100% no-repeat,
          radial-gradient(circle closest-side, currentColor 92%, transparent) 0 36% / 0.26em 0.26em no-repeat,
          radial-gradient(circle closest-side, currentColor 92%, transparent) 0 64% / 0.26em 0.26em no-repeat,
          radial-gradient(circle closest-side, currentColor 92%, transparent) 100% 36% / 0.26em 0.26em no-repeat,
          radial-gradient(circle closest-side, currentColor 92%, transparent) 100% 64% / 0.26em 0.26em no-repeat;
      }

      .someScope .grid-volta {
        position: absolute;
        top: 0;
        left: 0;
        min-width: 2.6em;
        padding-left: 0.35em;
        border-top: 0.12em solid currentColor;
        border-left: 0.12em solid currentColor;
        font-size: 0.7em;
        font-weight: 700;
        line-height: 1.3;
      }`;

    const actualCss = new HtmlTableFormatter().cssString('.someScope');
    expect(actualCss).toEqual(expectedCss);
  });

  it('generates a CSS object', () => {
    const { cssObject } = new HtmlTableFormatter();
    expect(typeof cssObject).toEqual('object');
  });

  it('applies the correct normalization when a capo is active and decapo is on', () => {
    const songWithCapo = new ChordSheetSerializer().deserialize({
      type: 'chordSheet',
      lines: [
        {
          type: 'line',
          items: [{ type: 'tag', name: 'key', value: 'F' }],
        },
        {
          type: 'line',
          items: [{ type: 'tag', name: 'capo', value: '1' }],
        },
        {
          type: 'line',
          items: [
            { type: 'chordLyricsPair', chords: '', lyrics: 'My ' },
            { type: 'chordLyricsPair', chords: 'Dm7', lyrics: 'heart has always ' },
            { type: 'chordLyricsPair', chords: 'C/E', lyrics: 'longed for something ' },
            { type: 'chordLyricsPair', chords: 'F', lyrics: 'more' },
          ],
        },
      ],
    });

    const expectedChordSheet = stripHTML(`
      <div class="chord-sheet">
        <div class="paragraph">
          <table class="row">
            <tr>
              <td class="chord"></td>
              <td class="chord">D#m7</td>
              <td class="chord">C#/E#</td>
              <td class="chord">F#</td>
            </tr>
            <tr>
              <td class="lyrics">My </td>
              <td class="lyrics">heart has always </td>
              <td class="lyrics">longed for something </td>
              <td class="lyrics">more</td>
            </tr>
          </table>
        </div>
      </div>
    `);

    expect(new HtmlTableFormatter({ decapo: true }).format(songWithCapo)).toEqual(expectedChordSheet);
  });

  it('does not apply normalization for capo when decapo is off', () => {
    const songWithCapo = new ChordSheetSerializer().deserialize({
      type: 'chordSheet',
      lines: [
        {
          type: 'line',
          items: [{ type: 'tag', name: 'key', value: 'F' }],
        },
        {
          type: 'line',
          items: [{ type: 'tag', name: 'capo', value: '1' }],
        },
        {
          type: 'line',
          items: [
            { type: 'chordLyricsPair', chords: '', lyrics: 'My ' },
            { type: 'chordLyricsPair', chords: 'Dm7', lyrics: 'heart has always ' },
            { type: 'chordLyricsPair', chords: 'C/E', lyrics: 'longed for something ' },
            { type: 'chordLyricsPair', chords: 'F', lyrics: 'more' },
          ],
        },
      ],
    });

    const expectedChordSheet = stripHTML(`
      <div class="chord-sheet">
        <div class="paragraph">
          <table class="row">
            <tr>
              <td class="chord"></td>
              <td class="chord">Dm7</td>
              <td class="chord">C/E</td>
              <td class="chord">F</td>
            </tr>
            <tr>
              <td class="lyrics">My </td>
              <td class="lyrics">heart has always </td>
              <td class="lyrics">longed for something </td>
              <td class="lyrics">more</td>
            </tr>
          </table>
        </div>
      </div>
    `);

    expect(new HtmlTableFormatter().format(songWithCapo)).toEqual(expectedChordSheet);
  });

  it('can render in a different key', () => {
    const expectedChordSheet = stripHTML(`
      <h1 class="title">Let it be</h1>
      <h2 class="subtitle">ChordSheetJS example version</h2>
      <div class="chord-sheet">
        <div class="paragraph">
          <table class="row">
            <tr>
              <td class="lyrics">Written by: </td>
              <td class="lyrics">John Lennon,Paul McCartney</td>
            </tr>
          </table>
        </div>
        <div class="paragraph verse">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Verse 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord"></td>
              <td class="chord">Cm</td>
              <td class="chord"></td>
              <td class="chord">Eb/Bb</td>
              <td class="chord">Ab</td>
              <td class="chord">Eb</td>
            </tr>
            <tr>
              <td class="lyrics">Let it </td>
              <td class="lyrics">be, </td>
              <td class="lyrics">let it </td>
              <td class="lyrics">be, let it </td>
              <td class="lyrics">be, let it </td>
              <td class="lyrics">be</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">F</td>
              <td class="annotation">strong</td>
              <td class="chord">Bb</td>
              <td class="chord">C</td>
              <td class="chord">Bb</td>
              <td class="chord">F/A</td>
              <td class="chord">Gm</td>
              <td class="chord">F</td>
            </tr>
            <tr>
              <td class="lyrics">Whisper </td>
              <td class="lyrics">words of </td>
              <td class="lyrics">wis</td>
              <td class="lyrics">dom, let it </td>
              <td class="lyrics">be </td>
              <td class="lyrics"> </td>
              <td class="lyrics"> </td>
              <td class="lyrics"></td>
            </tr>
          </table>
        </div>

        <div class="paragraph chorus">
          <table class="row">
            <tr>
              <td class="comment">Breakdown</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">Gm</td>
              <td class="chord">Ab</td>
              <td class="chord">Eb</td>
              <td class="chord">Bb</td>
            </tr>
            <tr>
              <td class="lyrics">Whisper words of </td>
              <td class="lyrics">wisdom, let it </td>
              <td class="lyrics">be </td>
              <td class="lyrics"></td>
            </tr>
          </table>
        </div>

        <div class="paragraph chorus">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Chorus 2</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">Bb</td>
              <td class="chord">Ab</td>
              <td class="chord">Eb</td>
              <td class="chord">Bb</td>
            </tr>
            <tr>
              <td class="lyrics">Whisper words of </td>
              <td class="lyrics">wisdom, let it </td>
              <td class="lyrics">be </td>
              <td class="lyrics"></td>
            </tr>
          </table>
        </div>

        <div class="paragraph solo">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Solo 1</h3>
              </td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">Bb</td>
            </tr>
            <tr>
              <td class="lyrics">Solo line 1</td>
            </tr>
          </table>
          <table class="row">
            <tr>
              <td class="chord">Eb</td>
            </tr>
            <tr>
              <td class="lyrics">Solo line 2</td>
            </tr>
          </table>
        </div>

        <div class="paragraph tab">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">Tab 1</h3>
              </td>
            </tr>
          </table>

          <table class="literal">
            <tr>
              <td class="contents">
                Tab line 1<br>
                Tab line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="paragraph abc">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">ABC 1</h3>
              </td>
            </tr>
          </table>

          <table class="literal">
            <tr>
              <td class="contents">
                ABC line 1<br>
                ABC line 2
              </td>
            </tr>
          </table>
        </div>

        <div class="paragraph ly">
          <table class="row">
            <tr>
              <td class="label-wrapper">
                <h3 class="label">LY 1</h3>
              </td>
            </tr>
          </table>

          <table class="literal">
            <tr>
              <td class="contents">
                LY line 1<br>
                LY line 2</td>
              </tr>
            </table>
          </div>

          <div class="paragraph bridge">
            <table class="row">
              <tr>
                <td class="label-wrapper">
                  <h3 class="label">Bridge 1</h3>
                </td>
              </tr>
            </table>
            <table class="row">
              <tr>
                <td class="lyrics">Bridge line</td>
              </tr>
            </table>
          </div>

          <div class="paragraph grid">
            <table class="row">
              <tr>
                <td class="label-wrapper">
                  <h3 class="label">Grid 1</h3>
                </td>
              </tr>
            </table>

            <table class="literal">
              <tr>
                <td class="contents">
                  Grid line 1<br>
                  Grid line 2
                </td>
              </tr>
            </table>
          </div>

          <div class="paragraph textblock">
            <table class="row">
              <tr>
                <td class="label-wrapper">
                  <h3 class="label">Disclaimer</h3>
                </td>
              </tr>
            </table>

            <table class="literal">
              <tr>
                <td class="contents">
                  Textblock line 1<br>
                  Textblock line 2
                </td>
              </tr>
            </table>
          </div>
      </div>
    `);

    expect(new HtmlTableFormatter({ key: 'Eb' }).format(exampleSongSymbol)).toEqual(expectedChordSheet);
  });

  it('correctly renders blank lines', () => {
    const song = createSongFromAst([
      [chordLyricsPair('C', 'Whisper words of wisdom')],
      [],
      [],
    ]);

    expect(song.bodyParagraphs).toHaveLength(3);

    const expectedOutput = html`
      <div class="chord-sheet">
        <div class="paragraph">
          <table class="row">
            <tr>
              <td class="chord">C</td>
            </tr>
            <tr>
              <td class="lyrics">Whisper words of wisdom</td>
            </tr>
          </table>
        </div>
        <div class="paragraph"></div>
        <div class="paragraph"></div>
      </div>
    `;

    const output = new HtmlTableFormatter().format(song);
    expect(output).toEqual(expectedOutput);
  });

  it('does not render empty section labels', () => {
    const song = createSongFromAst([
      ...section('tab', '', {}, 'Line 1\nLine 2'),
    ]);

    const expectedOutput = html`
      <div class="chord-sheet">
        <div class="paragraph tab">
          <table class="literal">
            <tr>
              <td class="contents">
                Line 1<br>
                Line 2
              </td>
            </tr>
          </table>
        </div>
      </div>
    `;

    expect(new HtmlTableFormatter().format(song)).toEqual(expectedOutput);
  });

  describe('with option useUnicodeModifiers:true', () => {
    it('replaces # with unicode sharp', () => {
      const songWithSharps = createSongFromAst([
        [
          chordLyricsPair('C#', 'Whisper words of wisdom'),
        ],

        [],

        [
          chordLyricsPair('A#m', 'Whisper words of wisdom'),
        ],
      ]);

      const expectedChordSheet = stripHTML(`
        <div class="chord-sheet">
          <div class="paragraph">
            <table class="row">
              <tr>
                <td class="chord">C♯</td>
              </tr>
              <tr>
                <td class="lyrics">Whisper words of wisdom</td>
              </tr>
            </table>
          </div>
          <div class="paragraph">
            <table class="row">
              <tr>
                <td class="chord">A♯m</td>
              </tr>
              <tr>
                <td class="lyrics">Whisper words of wisdom</td>
              </tr>
            </table>
          </div>
        </div>
      `);

      const formatter = new HtmlTableFormatter({ renderBlankLines: false, useUnicodeModifiers: true });

      expect(formatter.format(songWithSharps)).toEqual(expectedChordSheet);
    });

    it('can skip chord normalization', () => {
      const songWithSus2 = createSongFromAst([
        [chordLyricsPair('Asus2', 'Let it be')],
      ]);

      const expectedHTML = stripHTML(`
        <div class="chord-sheet">
          <div class="paragraph">
            <table class="row">
              <tr>
                <td class="chord">Asus2</td>
              </tr>
              <tr>
                <td class="lyrics">Let it be</td>
              </tr>
            </table>
          </div>
        </div>
      `);

      const formatted = new HtmlTableFormatter({ normalizeChords: false }).format(songWithSus2);

      expect(formatted).toEqual(expectedHTML);
    });
  });

  it('renders image directive with src attribute', () => {
    const song = createSongFromAst([
      [tag('image', '', { src: 'myimage.png' })],
    ]);

    const expectedOutput = html`
      <div class="chord-sheet">
        <div class="paragraph">
          <table class="row">
            <tr>
              <td class="image"><img src="myimage.png"></td>
            </tr>
          </table>
        </div>
      </div>
    `;

    expect(new HtmlTableFormatter().format(song)).toEqual(expectedOutput);
  });

  it('renders image directive with width and height attributes', () => {
    const song = createSongFromAst([
      [tag('image', '', { src: 'photo.jpg', width: '200', height: '150' })],
    ]);

    const expectedOutput = html`
      <div class="chord-sheet">
        <div class="paragraph">
          <table class="row">
            <tr>
              <td class="image"><img src="photo.jpg" width="200" height="150"></td>
            </tr>
          </table>
        </div>
      </div>
    `;

    expect(new HtmlTableFormatter().format(song)).toEqual(expectedOutput);
  });

  it('renders image directive with value-based src', () => {
    const song = createSongFromAst([
      [tag('image', 'myimage.png')],
    ]);

    const expectedOutput = html`
      <div class="chord-sheet">
        <div class="paragraph">
          <table class="row">
            <tr>
              <td class="image"><img src="myimage.png"></td>
            </tr>
          </table>
        </div>
      </div>
    `;

    expect(new HtmlTableFormatter().format(song)).toEqual(expectedOutput);
  });

  describe('delegates', () => {
    [ABC, GRID, LILYPOND, SVG, TAB, TEXTBLOCK].forEach((type) => {
      describe(`for ${type}`, () => {
        it('uses a configured delegate', () => {
          const song = createSongFromAst([
            ...section(type as ContentType, `${type} section`, {}, `${type} line 1\n${type} line 2`),
          ]);

          const configuration = {
            delegates: {
              [type]: (content: string) => content.toUpperCase(),
            },
          };

          const expectedOutput = html`
            <div class="chord-sheet">
              <div class="paragraph ${type}">
                <table class="row">
                  <tr>
                    <td class="label-wrapper">
                      <h3 class="label">${type} section</h3>
                    </td>
                  </tr>
                </table>

                <table class="literal">
                  <tr>
                    <td class="contents">
                      ${type.toUpperCase()} LINE 1<br>
                      ${type.toUpperCase()} LINE 2
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          `;

          expect(new HtmlTableFormatter(configuration).format(song)).toEqual(expectedOutput);
        });

        it('defaults to the default delegate', () => {
          const song = createSongFromAst([
            ...section(type as ContentType, `${type} section`, {}, `${type} line 1\n${type} line 2`),
          ]);

          const configuration = {};

          const expectedOutput = html`
            <div class="chord-sheet">
              <div class="paragraph ${type}">
                <table class="row">
                  <tr>
                    <td class="label-wrapper">
                      <h3 class="label">${type} section</h3>
                    </td>
                  </tr>
                </table>

                <table class="literal">
                  <tr>
                    <td class="contents">
                      ${type} line 1<br>
                      ${type} line 2
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          `;

          expect(new HtmlTableFormatter(configuration).format(song)).toEqual(expectedOutput);
        });
      });
    });
  });

  describe('rhythm symbols', () => {
    it('renders rhythm symbols with rhythm-symbol class instead of chord class', () => {
      const song = createSongFromAst([
        [
          { type: 'chordLyricsPair', chords: 'Am', lyrics: '' },
          {
            type: 'chordLyricsPair', chords: '/', lyrics: '', isRhythmSymbol: true,
          },
          {
            type: 'chordLyricsPair', chords: '/', lyrics: '', isRhythmSymbol: true,
          },
          {
            type: 'chordLyricsPair', chords: '|', lyrics: '', isRhythmSymbol: true,
          },
        ],
      ]);

      const formatted = new HtmlTableFormatter().format(song);

      expect(formatted).toContain('<td class="chord">Am</td>');
      expect(formatted).toContain('<td class="rhythm-symbol rhythm-symbol-continuation">/</td>');
      expect(formatted).toContain('<td class="barline barline-single">|</td>');
      expect(formatted).not.toMatch(/<td class="chord">[/|]<\/td>/);
    });

    it('allows customizing the rhythm symbol CSS class', () => {
      const song = createSongFromAst([
        [
          {
            type: 'chordLyricsPair', chords: '/', lyrics: '', isRhythmSymbol: true,
          },
        ],
      ]);

      const formatted = new HtmlTableFormatter({ cssClasses: { rhythmSymbol: 'custom-rhythm' } }).format(song);

      expect(formatted).toContain('<td class="custom-rhythm custom-rhythm-continuation">/</td>');
    });

    it('uses semantic classes for non-chord tokens', () => {
      const song = createSongFromAst([[
        { type: 'chordLyricsPair', chords: ':||', lyrics: '' },
        { type: 'chordLyricsPair', chords: '(6x)', lyrics: '' },
        { type: 'chordLyricsPair', chords: 'N.C.', lyrics: '' },
      ]]);

      const formatted = new HtmlTableFormatter().format(song);

      expect(formatted).toContain('<td class="barline barline-repeat-end">:||</td>');
      expect(formatted).toContain('<td class="instruction instruction-repeat-count">(6x)</td>');
      expect(formatted).toContain('<td class="no-chord no-chord-marker">N.C.</td>');
      expect(formatted).not.toContain('<td class="chord">(6x)</td>');
    });
  });

  describe('pango markup', () => {
    it('converts pango markup in lyrics to HTML', () => {
      const song = createSongFromAst([
        [chordLyricsPair('C', 'Roses are <span color="red">red</span>')],
      ]);

      const formatted = new HtmlTableFormatter().format(song);

      expect(formatted).toContain('Roses are <span style="color: red">red</span>');
    });

    it('converts pango bold tags in lyrics', () => {
      const song = createSongFromAst([
        [chordLyricsPair('G', '<b>bold text</b>')],
      ]);

      const formatted = new HtmlTableFormatter().format(song);

      expect(formatted).toContain('<b>bold text</b>');
    });

    it('uses a custom pangoRenderer when provided', () => {
      const song = createSongFromAst([
        [chordLyricsPair('C', 'Roses are <span color="red">red</span>')],
      ]);

      const customRenderer = {
        convert: (text: string) => text.replace(/<span color="red">/g, '<span class="red">'),
      };

      const formatted = new HtmlTableFormatter({ pangoRenderer: customRenderer }).format(song);

      expect(formatted).toContain('Roses are <span class="red">red</span>');
      expect(formatted).not.toContain('style="color: red"');
    });
  });
});
