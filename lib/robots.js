/* eslint-disable id-length */

export const missionControl = ({
  moveMap,
  rotationMap,
  compassRotationMap,
  rotationCompassMap,
  surface,
  }) => (robots) => {
  return robots.reduce((result, robot) => { // eslint-disable-line indent
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

      if (route[route.length - 1] === 'LOST') {
        return thisRoute;
      }

      const movement = moveMap.get(instruction);
      const rotation = rotationMap.get(instruction);
      const { x: curX, y: curY, orient: curOrient } = route[route.length - 1];

      if (movement) {
        let adjX = 0;
        let adjY = 0;

        switch (compassRotationMap.get(curOrient)) {
        case 90:
          adjX = movement.y;
          adjY = movement.x;
          break;
        case 180:
          adjX = movement.x * -1;
          adjY = movement.y * -1;
          break;
        case 270:
          adjX = movement.y * -1;
          adjY = movement.x * -1;
          break;
        default:
          adjX = movement.x;
          adjY = movement.y;
        }

        const newX = curX + adjX;
        const newY = curY + adjY;

        if (newX < 0 || newY < 0 || !surface[newY] || !surface[newY][newX]) {
          if (!result.scent[`${curX}|${curY}`]) {
            thisRoute.push('LOST');
          }
        } else {
          thisRoute.push({
            x: newX,
            y: newY,
            orient: curOrient,
          });
        }
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
    let isLost = false;
    let lastPosition = robotRoute[robotRoute.length - 1];
    if (lastPosition === 'LOST') {
      isLost = true;
      lastPosition = robotRoute[robotRoute.length - 2];
      newResult.scent[`${lastPosition.x}|${lastPosition.y}`] = true;
    }
    const { x: curX, y: curY, orient: curOrient } = lastPosition;
    newResult[id] = Object.assign({}, robot, {
      route: robotRoute,
      curX,
      curY,
      curOrient,
      isLost,
    });

    return newResult;
  }, {scent: {}});
}; // eslint-disable-line indent
