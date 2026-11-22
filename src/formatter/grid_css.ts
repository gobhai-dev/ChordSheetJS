import { CSS } from './html_formatter';
import { HtmlTemplateCssClasses } from './configuration';

type Classes = HtmlTemplateCssClasses;

const DOT_SIZE = '0.26em 0.26em';

function line(position: string, size: string): string {
  return `linear-gradient(currentColor, currentColor) ${position} / ${size} no-repeat`;
}

function dot(position: string): string {
  return `radial-gradient(circle closest-side, currentColor 92%, transparent) ${position} / ${DOT_SIZE} no-repeat`;
}

function background(...layers: string[]): string {
  return layers.join(',\n    ');
}

function layoutRules(c: Classes): CSS {
  return {
    [`.${c.gridScroll}`]: {
      overflowX: 'auto',
    },
    [`.${c.gridTable}`]: {
      tableLayout: 'fixed',
      width: '100%',
      borderCollapse: 'collapse',
    },
    [`.${c.gridColCell}`]: {
      width: '2.2em',
    },
    [`.${c.gridColMargin}, .${c.gridColComment}`]: {
      width: '6ch',
    },
    [`.${c.gridColEnd}`]: {
      width: '1.4em',
    },
  };
}

function cellRules(c: Classes): CSS {
  return {
    [`.${c.gridCell}, .${c.gridEnd}, .${c.gridMargin}, .${c.gridComment}`]: {
      whiteSpace: 'nowrap',
      padding: '0',
      textAlign: 'left',
    },
    [`.${c.gridComment}`]: {
      paddingLeft: '0.4em',
    },
    [`.${c.gridCell}, .${c.gridEnd}`]: {
      height: '2.8em',
      verticalAlign: 'middle',
    },
    [`.${c.gridCell}`]: {
      position: 'relative',
    },
    [`.${c.gridCell} > *, .${c.gridEnd} > *`]: {
      verticalAlign: 'middle',
    },
  };
}

function marginRules(c: Classes): CSS {
  return {
    [`.${c.gridMargin}, .${c.gridComment}`]: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: '0.85em',
      fontStyle: 'italic',
    },
  };
}

function chordPartRules(c: Classes): CSS {
  const cell = `.${c.gridCell}`;

  return {
    [`${cell} .${c.chord}`]: { whiteSpace: 'nowrap' },
    [`${cell} .${c.chordRoot}`]: { fontSize: '1.5em' },
    [`${cell} .${c.chordQuality}, ${cell} .${c.chordExtensions}`]: {
      fontSize: '0.8em',
      marginLeft: '0.04em',
    },
  };
}

function chordStackRules(c: Classes): CSS {
  const cell = `.${c.gridCell}`;

  return {
    [`${cell} .${c.chordAccidental}`]: {
      display: 'inline-block',
      width: '0',
      fontSize: '0.62em',
      verticalAlign: '0.62em',
      marginLeft: '0.03em',
    },
    [`${cell} .${c.chordRoot}:last-child > .${c.chordAccidental}`]: { width: 'auto' },
    [`${cell} .${c.chordAlterations}`]: { fontSize: '0.9em', marginLeft: '0.12em' },
    [`${cell} .${c.chordAlterationsStacked}`]: {
      display: 'inline-grid',
      fontSize: '0.8em',
      gridTemplateRows: 'auto auto',
      gridAutoFlow: 'column',
      columnGap: '0.15em',
      lineHeight: '1',
      verticalAlign: 'middle',
    },
  };
}

function chordRules(c: Classes): CSS {
  const symbols = `.${c.gridRepeat}, .${c.gridTable} .${c.rhythmSymbol}`;
  const cell = `.${c.gridCell}`;

  return {
    [`${cell} .${c.chord}, ${symbols}`]: { fontWeight: '700' },
    ...chordPartRules(c),
    ...chordStackRules(c),
    [`${cell} .${c.chordBass}`]: {
      fontSize: '0.72em',
      position: 'relative',
      top: '0.3em',
      marginLeft: '0.05em',
    },
    [`.${c.gridMulti} .${c.chord}`]: { fontSize: '0.78em' },
    [`.${c.gridMulti} .${c.chord} + .${c.chord}`]: { marginLeft: '0.35em' },
    [symbols]: { fontSize: '1.3em', opacity: '0.75' },
  };
}

function barlineRules(c: Classes): CSS {
  const bar = `.${c.gridTable} .${c.barline}`;

  return {
    [bar]: {
      display: 'inline-block',
      boxSizing: 'content-box',
      height: '2.2em',
      width: '0',
      marginRight: '0.35em',
      verticalAlign: 'middle',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textIndent: '-99em',
      borderLeft: '0.1em solid currentColor',
    },
    [`${bar}-double`]: { width: '0.16em', borderRight: '0.1em solid currentColor' },
    [`${bar}-end`]: { width: '0.16em', borderRight: '0.3em solid currentColor' },
  };
}

function repeatBarlineRules(c: Classes): CSS {
  const bar = `.${c.gridTable} .${c.barline}`;

  return {
    [`${bar}-repeat-start`]: {
      width: '0.72em',
      borderLeftWidth: '0.3em',
      background: background(line('0.16em 0', '0.1em 100%'), dot('100% 36%'), dot('100% 64%')),
    },
    [`${bar}-repeat-end`]: {
      width: '0.72em',
      borderLeft: '0',
      borderRight: '0.3em solid currentColor',
      background: background(line('calc(100% - 0.16em) 0', '0.1em 100%'), dot('0 36%'), dot('0 64%')),
    },
  };
}

function repeatEndStartRule(c: Classes): CSS {
  const bar = `.${c.gridTable} .${c.barline}`;

  return {
    [`${bar}-repeat-end-start`]: {
      width: '1.3em',
      borderLeft: '0',
      background: background(
        line('50% 0', '0.3em 100%'),
        line('calc(50% - 0.31em) 0', '0.1em 100%'),
        line('calc(50% + 0.31em) 0', '0.1em 100%'),
        dot('0 36%'),
        dot('0 64%'),
        dot('100% 36%'),
        dot('100% 64%'),
      ),
    },
  };
}

function voltaRules(c: Classes): CSS {
  return {
    [`.${c.gridVolta}`]: {
      position: 'absolute',
      top: '0',
      left: '0',
      minWidth: '2.6em',
      paddingLeft: '0.35em',
      borderTop: '0.12em solid currentColor',
      borderLeft: '0.12em solid currentColor',
      fontSize: '0.7em',
      fontWeight: '700',
      lineHeight: '1.3',
    },
  };
}

/**
 * CSS for the table produced when the `renderGrids` option is enabled. It draws bar lines, repeat signs and volta
 * brackets, and sizes chord parts like a lead-sheet chart. It only uses `currentColor` and no fonts, so colours and
 * typeface come from the page.
 */
export default function gridCss(cssClasses: HtmlTemplateCssClasses): CSS {
  return {
    ...layoutRules(cssClasses),
    ...cellRules(cssClasses),
    ...marginRules(cssClasses),
    ...chordRules(cssClasses),
    ...barlineRules(cssClasses),
    ...repeatBarlineRules(cssClasses),
    ...repeatEndStartRule(cssClasses),
    ...voltaRules(cssClasses),
  };
}
