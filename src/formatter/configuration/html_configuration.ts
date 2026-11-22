import {
  BaseFormatterConfiguration,
  ConfigurationProperties,
} from './base_configuration';

import { PangoRenderer } from '../../pango/pango_helpers';

export type CSS = Record<string, string | number>;

export interface HtmlTemplateCssClasses {
  annotation: string,
  barline: string,
  chord: string,
  chordMarker: string,
  chordRoot: string,
  chordQuality: string,
  chordExtensions: string,
  chordBass: string,
  chordAccidental: string,
  chordAlterations: string,
  chordAlterationsStacked: string,
  chordAlteration: string,
  chordSheet: string,
  column: string,
  comment: string,
  emptyLine: string,
  gridCell: string,
  gridCellEmpty: string,
  gridColCell: string,
  gridColComment: string,
  gridColEnd: string,
  gridColMargin: string,
  gridComment: string,
  gridEnd: string,
  gridMargin: string,
  gridMulti: string,
  gridMultiEmpty: string,
  gridRepeat: string,
  gridRow: string,
  gridRowStrum: string,
  gridRowText: string,
  gridScroll: string,
  gridTable: string,
  gridText: string,
  gridVolta: string,
  image: string,
  instruction: string,
  label: string,
  labelWrapper: string,
  line: string,
  literal: string,
  literalContents: string,
  lyrics: string,
  noChord: string,
  paragraph: string,
  rhythmSymbol: string,
  row: string,
  subtitle: string,
  title: string,
}

// HTML formatter configuration
export interface HTMLFormatterConfiguration extends BaseFormatterConfiguration {
  cssClasses: HtmlTemplateCssClasses;
  customCSS?: CSS;
  pangoRenderer?: PangoRenderer;
  renderBlankLines?: boolean;
  /**
   * Renders `{start_of_grid}` sections as an aligned table of cells instead of literal text.
   * When enabled the `delegates.grid` delegate is not called for grid sections. Defaults to `false`.
   */
  renderGrids?: boolean;
}

// Default CSS classes

export const defaultCssClasses: HtmlTemplateCssClasses = {
  annotation: 'annotation',
  barline: 'barline',
  chord: 'chord',
  chordMarker: 'chord-marker',
  chordRoot: 'chord-root',
  chordQuality: 'chord-quality',
  chordExtensions: 'chord-extensions',
  chordBass: 'chord-bass',
  chordAccidental: 'chord-accidental',
  chordAlterations: 'chord-alterations',
  chordAlterationsStacked: 'chord-alterations-stacked',
  chordAlteration: 'chord-alteration',
  chordSheet: 'chord-sheet',
  column: 'column',
  comment: 'comment',
  emptyLine: 'empty-line',
  gridCell: 'grid-cell',
  gridCellEmpty: 'grid-cell-empty',
  gridColCell: 'grid-col-cell',
  gridColComment: 'grid-col-comment',
  gridColEnd: 'grid-col-end',
  gridColMargin: 'grid-col-margin',
  gridComment: 'grid-comment',
  gridEnd: 'grid-end',
  gridMargin: 'grid-margin',
  gridMulti: 'grid-multi',
  gridMultiEmpty: 'grid-multi-empty',
  gridRepeat: 'grid-repeat',
  gridRow: 'grid-row',
  gridRowStrum: 'grid-row-strum',
  gridRowText: 'grid-row-text',
  gridScroll: 'grid-scroll',
  gridTable: 'grid-table',
  gridText: 'grid-text',
  gridVolta: 'grid-volta',
  image: 'image',
  instruction: 'instruction',
  label: 'label',
  labelWrapper: 'label-wrapper',
  line: 'line',
  literal: 'literal',
  literalContents: 'contents',
  lyrics: 'lyrics',
  noChord: 'no-chord',
  paragraph: 'paragraph',
  rhythmSymbol: 'rhythm-symbol',
  row: 'row',
  subtitle: 'subtitle',
  title: 'title',
};

// HTML ConfigurationProperties type
export interface HTMLConfigurationProperties extends ConfigurationProperties {
  cssClasses?: Partial<HtmlTemplateCssClasses>;
  customCSS?: CSS;
  pangoRenderer?: PangoRenderer;
  renderBlankLines?: boolean;
  /**
   * Renders `{start_of_grid}` sections as an aligned table of cells instead of literal text.
   * When enabled the `delegates.grid` delegate is not called for grid sections. Defaults to `false`.
   */
  renderGrids?: boolean;
}

export const htmlSpecificDefaults: Partial<HTMLFormatterConfiguration> = {
  cssClasses: {
    annotation: 'annotation',
    barline: 'barline',
    chord: 'chord',
    chordMarker: 'chord-marker',
    chordRoot: 'chord-root',
    chordQuality: 'chord-quality',
    chordExtensions: 'chord-extensions',
    chordBass: 'chord-bass',
    chordAccidental: 'chord-accidental',
    chordAlterations: 'chord-alterations',
    chordAlterationsStacked: 'chord-alterations-stacked',
    chordAlteration: 'chord-alteration',
    chordSheet: 'chord-sheet',
    column: 'column',
    comment: 'comment',
    emptyLine: 'empty-line',
    gridCell: 'grid-cell',
    gridCellEmpty: 'grid-cell-empty',
    gridColCell: 'grid-col-cell',
    gridColComment: 'grid-col-comment',
    gridColEnd: 'grid-col-end',
    gridColMargin: 'grid-col-margin',
    gridComment: 'grid-comment',
    gridEnd: 'grid-end',
    gridMargin: 'grid-margin',
    gridMulti: 'grid-multi',
    gridMultiEmpty: 'grid-multi-empty',
    gridRepeat: 'grid-repeat',
    gridRow: 'grid-row',
    gridRowStrum: 'grid-row-strum',
    gridRowText: 'grid-row-text',
    gridScroll: 'grid-scroll',
    gridTable: 'grid-table',
    gridText: 'grid-text',
    gridVolta: 'grid-volta',
    image: 'image',
    instruction: 'instruction',
    label: 'label',
    labelWrapper: 'label-wrapper',
    line: 'line',
    literal: 'literal',
    literalContents: 'contents',
    lyrics: 'lyrics',
    noChord: 'no-chord',
    paragraph: 'paragraph',
    rhythmSymbol: 'rhythm-symbol',
    row: 'row',
    subtitle: 'subtitle',
    title: 'title',
  },
};
