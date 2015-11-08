import assert from 'assert';
import { createSurface } from './mars';
import { missionControl } from './robots';
import { moveMap, rotationMap, compassRotationMap, rotationCompassMap } from './robotConfig';

describe('moveRobots should', () => {
  const surface = createSurface({x: 5, y: 3});
  const control = missionControl({
    moveMap,
    rotationMap,
    compassRotationMap,
    rotationCompassMap,
    surface,
  });

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

    it('move it forward one square from 0,0 East for an instruction of F', () => {
      const robot = {
        id: 1,
        origX: 0,
        origY: 0,
        origOrient: 'E',
        instructions: 'F',
      };
      const robots = [robot];
      const actual = control(robots)['1'].curX;
      const expected = 1;

      assert.deepEqual(actual, expected);
    });

    it('move it forward one square from 3,3 South for an instruction of F', () => {
      const robot = {
        id: 1,
        origX: 3,
        origY: 3,
        origOrient: 'S',
        instructions: 'F',
      };
      const robots = [robot];
      const actual = control(robots)['1'].curY;
      const expected = 2;

      assert.deepEqual(actual, expected);
    });

    it('move it to 1,1 E from 1,1 E for an instruction of RFRFRFRF', () => {
      const robot = {
        id: 1,
        origX: 1,
        origY: 1,
        origOrient: 'E',
        instructions: 'RFRFRFRF',
      };
      const robots = [robot];
      const { curX, curY, curOrient } = control(robots)['1'];
      const actual = `${curX} ${curY} ${curOrient}`;
      const expected = '1 1 E';

      assert.deepEqual(actual, expected);
    });

    it('move it to 3,3 N from 0,3 W for an instruction of LLFFFLFLFL', () => {
      const robot = {
        id: 1,
        origX: 0,
        origY: 3,
        origOrient: 'W',
        instructions: 'LLFFFLFLFL',
      };
      const robots = [robot];

      const { curX, curY, curOrient } = control(robots)['1'];
      const actual = `${curX} ${curY} ${curOrient}`;
      const expected = '3 3 N';

      assert.deepEqual(actual, expected);
    });

    it('mark it as lost if moving from 0,3 W for an instruction of LLFFFLFLFL', () => {
      const robot = {
        id: 1,
        origX: 0,
        origY: 3,
        origOrient: 'W',
        instructions: 'LLFFFLFLFL',
      };
      const robots = [robot];

      assert(control(robots)['1'].isLost);
    });
  });

  describe('for three robots', () => {
    describe('making one move forward from the origin', () => {
      const robot1 = {
        id: 1,
        origX: 0,
        origY: 0,
        origOrient: 'N',
        instructions: 'F',
      };
      const robot2 = {
        id: 2,
        origX: 0,
        origY: 0,
        origOrient: 'N',
        instructions: 'F',
      };
      const robot3 = {
        id: 3,
        origX: 0,
        origY: 0,
        origOrient: 'N',
        instructions: 'F',
      };
      const robots = [robot1, robot2, robot3];
      const result = control(robots);

      it('move the first forward one square from 0,0 North for an instruction of F', () => {
        const actual = result['1'].curY;
        const expected = 1;

        assert.deepEqual(actual, expected);
      });

      it('move the second forward one square from 0,0 North for an instruction of F', () => {
        const actual = result['2'].curY;
        const expected = 1;

        assert.deepEqual(actual, expected);
      });

      it('move the third forward one square from 0,0 North for an instruction of F', () => {
        const actual = result['3'].curY;
        const expected = 1;

        assert.deepEqual(actual, expected);
      });
    });

    describe('with previous losses', () => {
      const robot1 = {
        id: 1,
        origX: 1,
        origY: 1,
        origOrient: 'E',
        instructions: 'RFRFRFRF',
      };
      const robot2 = {
        id: 2,
        origX: 3,
        origY: 2,
        origOrient: 'N',
        instructions: 'FRRFLLFFRRFLL',
      };
      const robot3 = {
        id: 3,
        origX: 0,
        origY: 3,
        origOrient: 'W',
        instructions: 'LLFFFLFLFL',
      };
      const robots = [robot1, robot2, robot3];
      const result = control(robots);

      it('move the first robot from 1,1 E to 1,1 E for an instruction of RFRFRFRF', () => {
        const { curX, curY, curOrient } = result['1'];
        const actual = `${curX} ${curY} ${curOrient}`;
        const expected = '1 1 E';

        assert.deepEqual(actual, expected);
      });

      it('not lose the first robot moving from 1,1 E for an instruction of RFRFRFRF', () => {
        assert(!result['1'].isLost);
      });

      it('move the second robot from 3,2 N to 3,3 N for an instruction of FRRFLLFFRRFLL with no scent', () => {
        const { curX, curY, curOrient } = result['2'];
        const actual = `${curX} ${curY} ${curOrient}`;
        const expected = '3 3 N';

        assert.deepEqual(actual, expected);
      });

      it('lose the second robot moving from 3,2 N for an instruction of RFRFRFRF with no scent', () => {
        assert(result['2'].isLost);
      });

      it('move the third robot from 0,3 W to 2,3 S for an instruction of LLFFFLFLFL with a previous scent', () => {
        const { curX, curY, curOrient } = result['3'];
        const actual = `${curX} ${curY} ${curOrient}`;
        const expected = '2 3 S';

        assert.deepEqual(actual, expected);
      });

      it('not lose the third robot moving from 0,3 W for an instruction of LLFFFLFLFL with a previous scent', () => {
        assert(!result['3'].isLost);
      });
    });
  });
});
