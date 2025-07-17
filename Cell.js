class Cell {
  constructor(i, j, x, y, walls) {
    this.i = i;
    this.j = j;
    this.x = x;
    this.y = y;
    this.walls = walls;
    this.visited = false;
  }
  toggleWall(maze, wallDirection, wallActivity, ROWS, COLS) {
    var cellNeighbour, cellNeighbourDirection;
    cellNeighbour = this.findCellAccordingToDirection(
      maze,
      wallDirection,
      ROWS,
      COLS
    );
    console.log(
      "Cell Neighbour is [" + cellNeighbour.i + ", " + cellNeighbour.j + "]"
    );
    if (cellNeighbour) {
      cellNeighbourDirection = findCellDirection(wallDirection);
    }
    this.walls[wallDirection] = wallActivity;
    if (cellNeighbour)
      cellNeighbour.walls[cellNeighbourDirection] = wallActivity;
  }
  findCellAccordingToDirection(maze, wallDirection, ROWS, COLS) {
    var i = this.i;
    var j = this.j;
    if (wallDirection == Direction.UP && j - 1 >= 0) {
      return maze[i][j - 1];
    } else if (wallDirection == Direction.RIGHT && i + 1 <= COLS - 1) {
      return maze[i + 1][j];
    } else if (wallDirection == Direction.BOTTOM && j + 1 <= ROWS - 1) {
      return maze[i][j + 1];
    } else if (wallDirection == Direction.LEFT && i - 1 >= 0) {
      return maze[i - 1][j];
    }
    return null;
  }
}

function findCellDirection(wallDirection) {
  // Give opposite direction of current cell
  switch (wallDirection) {
    case Direction.UP:
      return Direction.BOTTOM;
    case Direction.RIGHT:
      return Direction.LEFT;
    case Direction.BOTTOM:
      return Direction.UP;
    case Direction.LEFT:
      return Direction.RIGHT;
  }
}
