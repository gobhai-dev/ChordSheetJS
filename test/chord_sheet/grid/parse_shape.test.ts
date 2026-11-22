import { parseGridShape } from '../../../src';

describe('parseGridShape', () => {
  it('parses L+MxB+R', () => {
    expect(parseGridShape('1+4x4+1')).toEqual({
      leftMargin: 1, cells: 16, rightMargin: 1, measures: 4, beats: 4,
    });
  });

  it('parses MxB', () => {
    expect(parseGridShape('4x3')).toEqual({
      leftMargin: 0, cells: 12, rightMargin: 0, measures: 4, beats: 3,
    });
  });

  it('parses L+MxB', () => {
    expect(parseGridShape('2+2x4')).toEqual({
      leftMargin: 2, cells: 8, rightMargin: 0, measures: 2, beats: 4,
    });
  });

  it('parses MxB+R', () => {
    expect(parseGridShape('2x4+3')).toEqual({
      leftMargin: 0, cells: 8, rightMargin: 3, measures: 2, beats: 4,
    });
  });

  it('parses a bare cell count', () => {
    expect(parseGridShape('16')).toEqual({
      leftMargin: 0, cells: 16, rightMargin: 0, measures: null, beats: null,
    });
  });

  it.each(['', 'abc', '4x', 'x4', '0x4', '0', '1+4', '4x4+1+1', '-3'])('rejects %j', (shape) => {
    expect(parseGridShape(shape)).toBeNull();
  });

  it('rejects null and undefined', () => {
    expect(parseGridShape(null)).toBeNull();
    expect(parseGridShape(undefined)).toBeNull();
  });
});
