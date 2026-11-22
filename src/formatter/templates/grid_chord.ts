import Chord from '../../chord';
import { HtmlTemplateCssClasses } from '../configuration';
import {
  ChordTextPart, ChordTextPartValue, chordTextParts, displaySuffixPart,
} from '../../rendering/chord_shaper';

interface Classes extends HtmlTemplateCssClasses {
  useUnicodeModifiers?: boolean;
}

export interface Alterations {
  base: string;
  tokens: string[];
}

const ROOT = /^([A-H])([#b♭♯]+)$/;
const ALTERATION_RUN = /^(.*?)((?:[#b♭♯]\d+|sus\d*|add\d+|alt)+)$/;
const ALTERATION = /[#b♭♯]\d+|sus\d*|add\d+|alt/g;

export function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function span(className: string, content: string): string {
  return `<span class="${ className }">${ content }</span>`;
}

/**
 * Splits the extensions of a chord into the text before its trailing run of alterations (`b9`, `#11`, `sus4`,
 * `add9`, `alt`) and the individual alteration tokens, or returns null when there is no such run.
 */
export function splitAlterations(extensions: string): Alterations | null {
  const match = ALTERATION_RUN.exec(extensions);
  if (!match) return null;

  return { base: match[1], tokens: match[2].match(ALTERATION) as string[] };
}

function renderRoot(text: string, c: Classes): string {
  const match = ROOT.exec(text);
  const content = match ? `${ match[1] }${ span(c.chordAccidental, match[2]) }` : escapeHtml(text);

  return span(c.chordRoot, content);
}

function renderAlterations(tokens: string[], unicode: boolean, c: Classes): string {
  const stacked = tokens.length > 1 ? ` ${ c.chordAlterationsStacked }` : '';
  const items = tokens.map((token) => span(c.chordAlteration, escapeHtml(displaySuffixPart(token, unicode))));

  return span(`${ c.chordAlterations }${ stacked }`, items.join(''));
}

function renderExtensions(ascii: string, unicode: boolean, c: Classes): string {
  const split = splitAlterations(ascii);
  const content = split ?
    escapeHtml(displaySuffixPart(split.base, unicode)) + renderAlterations(split.tokens, unicode, c) :
    escapeHtml(displaySuffixPart(ascii, unicode));

  return span(c.chordExtensions, content);
}

function partClass(part: ChordTextPart, c: Classes): string {
  const classes: Record<Exclude<ChordTextPart, 'root' | 'extensions'>, string> = {
    marker: c.chordMarker,
    quality: c.chordQuality,
    bass: c.chordBass,
  };

  return classes[part as keyof typeof classes];
}

function renderPart({ part, text }: ChordTextPartValue, asciiExtensions: string, c: Classes): string {
  if (part === 'root') return renderRoot(text, c);
  if (part === 'extensions') return renderExtensions(asciiExtensions, !!c.useUnicodeModifiers, c);
  return span(partClass(part, c), escapeHtml(text));
}

export function plainChord(text: string, c: Classes): string {
  return span(c.chord, escapeHtml(text));
}

/**
 * Renders chord text as a chord span with nested part spans, or as a plain chord span when it does not parse or
 * its parts do not reassemble to the source text.
 */
export function renderChord(text: string, c: Classes): string {
  const parsed = Chord.parse(text);
  if (!parsed) return plainChord(text, c);

  const ascii = chordTextParts(parsed, false);
  if (!c.useUnicodeModifiers && ascii.map((part) => part.text).join('') !== text) return plainChord(text, c);

  const asciiExtensions = ascii.find(({ part }) => part === 'extensions')?.text || '';
  const parts = chordTextParts(parsed, !!c.useUnicodeModifiers);

  return span(c.chord, parts.map((part) => renderPart(part, asciiExtensions, c)).join(''));
}
