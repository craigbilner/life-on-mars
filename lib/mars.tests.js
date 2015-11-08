import assert from 'assert';
import { createSurface } from './mars';

describe('createSurface should', () => {
  it('return an empty array if no arguments are passed', () => {
    const actual = createSurface();
    const expected = [];

    assert.deepEqual(actual, expected);
  });

  it('return an array with four rows if 0,3 is passed', () => {
    const actual = createSurface({y: 3}).length;
    const expected = 4;

    assert.deepEqual(actual, expected);
  });

  it('return an array with one column if 0,3 is passed', () => {
    const actual = createSurface({y: 3})[0].length;
    const expected = 1;

    assert.deepEqual(actual, expected);
  });

  it('return an array with one row if 3,0 is passed', () => {
    const actual = createSurface({x: 3}).length;
    const expected = 1;

    assert.deepEqual(actual, expected);
  });

  it('return an array with four rows if 5,3 is passed', () => {
    const actual = createSurface({x: 5, y: 3}).length;
    const expected = 4;

    assert.deepEqual(actual, expected);
  });

  it('return an array with fix columns if 5,3 is passed', () => {
    const actual = createSurface({x: 5, y: 3})[0].length;
    const expected = 6;

    assert.deepEqual(actual, expected);
  });
});
