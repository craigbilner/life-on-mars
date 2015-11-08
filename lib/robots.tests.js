import assert from 'assert';
import { missionControl } from './robots';
import { moveMap } from './robotConfig';

describe('moveRobots should', () => {
  const control = missionControl({moveMap});

  describe('for one robot', () => {
    it('move it forward one square from 0,0 North for an instruction of F', () => {
      const robot = {
        id: 1,
        origX: 0,
        origY: 0,
        origOrient: 'N',
        instructions: 'F',
      };
      const robots = [robot];
      const actual = control(robots)['1'].curY;
      const expected = 1;

      assert.deepEqual(actual, expected);
    });
  });
});
