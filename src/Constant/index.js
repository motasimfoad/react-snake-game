const CANVAS_SIZE = [700, 700];
const SNAKE_START = [
  [11, 10],
  [11, 11]
];
const APPLE_START = [11, 7];
const SCALE = 30;
const SPEED = 100;
const DIRECTIONS = {
  38: [0, -1], // up
  40: [0, 1], // down
  37: [-1, 0], // left
  39: [1, 0] // right
};

export {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS
};