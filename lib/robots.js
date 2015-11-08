/* eslint-disable id-length */

export const missionControl = ({moveMap, rotationMap, compassRotationMap, rotationCompassMap}) => (robots) => {
  return robots.reduce((result, robot) => {
    const { id, origX, origY, origOrient } = robot;
    const robotStart = [
      {
        x: origX,
        y: origY,
        orient: origOrient,
      },
    ];
    const robotRoute = robot.instructions.split('').reduce((route, instruction) => {
      const thisRoute = route.slice(0);
      const movement = moveMap.get(instruction);
      const rotation = rotationMap.get(instruction);
      const { x: curX, y: curY, orient: curOrient } = route[route.length - 1];

      if (movement) {
        const newX = curX + movement.x;
        const newY = curY + movement.y;

        thisRoute.push({
          x: newX,
          y: newY,
          orient: curOrient,
        });
      } else if (rotation) {
        const curRotation = compassRotationMap.get(curOrient);
        const newRotation = curRotation + rotation;
        let adjRotation = 0;

        if (newRotation < 0) {
          adjRotation = 360 + newRotation;
        } else if (newRotation === 360) {
          adjRotation = 0;
        } else {
          adjRotation = newRotation;
        }

        const newOrient = rotationCompassMap.get(adjRotation);
        thisRoute.push({
          x: curX,
          y: curY,
          orient: newOrient,
        });
      }

      return thisRoute;
    }, robotStart);

    const newResult = Object.assign({}, result);
    const { x: curX, y: curY, orient: curOrient } = robotRoute[robotRoute.length - 1];
    newResult[id] = Object.assign({}, robot, {
      route: robotRoute,
      curX,
      curY,
      curOrient,
    });

    return newResult;
  }, {});
};
