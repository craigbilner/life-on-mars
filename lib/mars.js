/* eslint-disable id-length */

export const createSurface = ({x = 0, y = 0} = {}) => {
  if (!x && !y) {
    return [];
  }

  const surface = new Array(y + 1);
  const row = new Array(x + 1);
  row.fill(1);
  surface.fill(row);

  return surface;
};
