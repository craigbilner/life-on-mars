import assert from 'assert';
import { missionControl } from './robots';
import { moveMap, rotationMap, compassRotationMap, rotationCompassMap } from './robotConfig';

describe('moveRobots should', () => {
  const control = missionControl({moveMap, rotationMap, compassRotationMap, rotationCompassMap});

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

    it('rotate it left 90deg for an instruction of L starting N', () => {
      const robot = {
        id: 1,
        origX: 0,
        origY: 0,
        origOrient: 'N',
        instructions: 'L',
      };
      const robots = [robot];
      const actual = control(robots)['1'].curOrient;
      const expected = 'W';

      assert.deepEqual(actual, expected);
    });

    it('rotate it right 90deg for an instruction of R starting W', () => {
      const robot = {
        id: 1,
        origX: 0,
        origY: 0,
        origOrient: 'W',
        instructions: 'R',
      };
      const robots = [robot];
      const actual = control(robots)['1'].curOrient;
      const expected = 'N';

      assert.deepEqual(actual, expected);
    });
  });
});
