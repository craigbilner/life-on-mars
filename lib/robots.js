/* eslint-disable id-length */

export const missionControl = ({moveMap}) => (robots) => {
  return robots.reduce((result, robot) => {
    const { id, origX, origY } = robot;
    const robotStart = [
      {
        x: origX,
        y: origY,
      },
    ];
    const robotRoute = robot.instructions.split('').reduce((route, instruction) => {
      const thisRoute = route.slice(0);
      const movement = moveMap.get(instruction);
      const { x: curX, y: curY } = route[route.length - 1];

      if (movement) {
        const newX = curX + movement.x;
        const newY = curY + movement.y;

        thisRoute.push({
          x: newX,
          y: newY,
        });
      }

      return thisRoute;
    }, robotStart);

    const newResult = Object.assign({}, result);
    const { x: curX, y: curY } = robotRoute[robotRoute.length - 1];
    newResult[id] = Object.assign({}, robot, {
      route: robotRoute,
      curX,
      curY,
    });

    return newResult;
  }, {});
};
