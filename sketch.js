const ROWS = 7;
const COLS = 3;
// Size of each square(width, height)
const squareWidth = 50;
const squareHeight = 50;
// Getting Dimensions of screen (generally good practice)
const windowWidth = 800;
const windowHeight = 800;
// Calculating the center to print the top left first square
const centerPositionOfX = windowWidth / 2 - (ROWS * squareWidth) / 2;
const centerPositionOfY = windowHeight / 2 - (COLS * squareHeight) / 2;
var maze = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
var userClickedScreen = false;
var startingPointCell = null;
var lastingPointCell = null;

var path = [];
const debugging = false;
function setup() {
  createCanvas(windowWidth, windowHeight);
  let closedWall = true;
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      var x = centerPositionOfX + squareWidth * i;
      var y = centerPositionOfY + squareHeight * j;
      var tmp = new Cell(i, j, x, y, [
        closedWall,
        closedWall,
        closedWall,
        closedWall,
      ]);
      maze[i][j] = tmp;
    }
  }
}
function sleep(millisecondsDuration) {
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  });
}
function draw() {
  background(0);
  if (userClickedScreen) {
    if (startingPointCell) {
      fill(0, 208, 0);
      stroke("black");
      square(startingPointCell.x, startingPointCell.y, squareWidth);
    }
    if (lastingPointCell) {
      fill(208, 0, 0);
      stroke("black");
      square(lastingPointCell.x, lastingPointCell.y, squareWidth);
    }
  }
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      var cell = maze[i][j];
      stroke("white");
      drawSquare(cell.x, cell.y, cell.walls, squareWidth, squareHeight);
    }
  }
  if (debugging) {
    stroke("orange");
    for (let i = 0; i < path.length - 1; i++) {
      line(path[i][0], path[i][1], path[i + 1][0], path[i + 1][1]);
    }
  }
}
function keyPressed(key) {
  if (keyCode === ENTER && startingPointCell && lastingPointCell) {
    GenerateDFSMaze(startingPointCell);
  }
}
function mouseClicked(event) {
  if (!startingPointCell) {
    // Init Cell Point with Green Color
    initializeCellPoint(CellColor.GREEN);
  } else if (!lastingPointCell && startingPointCell) {
    // Same but with Red
    initializeCellPoint(CellColor.RED);
  }
}
function initializeCellPoint(typeOfCell) {
  var topLeftCellPosition = null;
  var bottomRightCellPosition = null;
  if (ROWS >= 0 && COLS >= 0) {
    topLeftCellPosition = [maze[0][0].x, maze[0][0].y];
    bottomRightCellPosition = [
      maze[ROWS - 1][COLS - 1].x + squareWidth,
      maze[ROWS - 1][COLS - 1].y + squareHeight,
    ];
  }
  if (
    cursorIsInsideMaze(
      mouseX,
      mouseY,
      topLeftCellPosition,
      bottomRightCellPosition
    )
  ) {
    pointedCell = findCellThatUserClicked(mouseX, mouseY);
    if (typeOfCell == CellColor.GREEN) {
      startingPointCell = pointedCell;
      userClickedScreen = true;
    } else if (
      typeOfCell == CellColor.RED &&
      pointedCell.i != startingPointCell.i &&
      pointedCell.j != startingPointCell.j
    ) {
      lastingPointCell = pointedCell;
      userClickedScreen = true;
    }
  }
}
function findCellThatUserClicked(mouseX, mouseY) {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (
        mouseX >= maze[i][j].x &&
        mouseX <= maze[i][j].x + squareWidth &&
        mouseY >= maze[i][j].y &&
        mouseY <= maze[i][j].y + squareHeight
      ) {
        var cell = maze[i][j];
        return new Cell(i, j, cell.x, cell.y, [true, true, true, true]);
      }
    }
  }
  return null;
}
function cursorIsInsideMaze(
  mouseX,
  mouseY,
  topLeftCellPosition,
  bottomRightCellPosition
) {
  if (
    mouseX >= topLeftCellPosition[0] &&
    mouseX <= bottomRightCellPosition[0] &&
    mouseY >= topLeftCellPosition[1] &&
    mouseY <= bottomRightCellPosition[1]
  ) {
    return true;
  }
  return false;
}
function drawSquare(x, y, walls, squareWidth, squareHeight) {
  if (walls[0]) {
    drawWall(Direction.UP, x, y);
  }

  if (walls[1]) {
    drawWall(Direction.RIGHT, x, y);
  }

  if (walls[2]) {
    drawWall(Direction.BOTTOM, x, y);
  }
  if (walls[3]) {
    drawWall(Direction.LEFT, x, y);
  }
}

function drawWall(direction, x, y) {
  switch (direction) {
    case Direction.UP: {
      line(x, y, x + squareWidth, y);
      break;
    }
    case Direction.RIGHT: {
      line(x + squareWidth, y, x + squareWidth, y + squareHeight);
      break;
    }
    case Direction.BOTTOM: {
      line(x, y + squareHeight, x + squareWidth, y + squareHeight);
      break;
    }
    case Direction.LEFT: {
      line(x, y, x, y + squareHeight);
      break;
    }
  }
}

function GenerateDFSMaze(start) {
  start.visited = true;
  path.push([start.x + squareWidth / 2, start.y + squareHeight / 2]);
  var newCell;
  var allUnvisitedNeighbours = getAllNeighbours(start);
  while (allUnvisitedNeighbours.length > 0) {
    if (allUnvisitedNeighbours) {
      newCell = getRandomNeighbour(allUnvisitedNeighbours);
      var direction = findDirectionAccordingToCell(start, newCell);
      console.log(
        "Removing from " +
          start.i +
          ", " +
          start.j +
          " from " +
          newCell.i +
          ", " +
          newCell.j +
          " with Direction : " +
          direction
      );

      start.toggleWall(maze, direction, Wall.OPEN, ROWS, COLS);
      if (direction == Direction.UP) {
        console.log("Action : Went Up");
      } else if (direction == Direction.RIGHT) {
        console.log("Action : Went RIGHT");
      } else if (direction == Direction.LEFT) {
        console.log("Action : Went LEFT");
      } else if (direction == Direction.BOTTOM) {
        console.log("Action : Went BOTTOM");
      }

      GenerateDFSMaze(newCell);
    }
    allUnvisitedNeighbours = getAllNeighbours(start);
  }
  return;
}
function findDirectionAccordingToCell(startingCell, newCell) {
  var yDiff = startingCell.j - newCell.j;
  var xDiff = startingCell.i - newCell.i;
  console.log("xDiff : " + xDiff + ", yDiff : " + yDiff);
  // Goes from Left to Right(Right Direction)
  if (xDiff == -1) {
    return Direction.RIGHT;
  } else if (xDiff == 1) {
    return Direction.LEFT;
  } else if (yDiff == -1) {
    return Direction.BOTTOM;
  } else if (yDiff == 1) {
    return Direction.UP;
  } else {
    return null;
  }
}
function getRandomNeighbour(allNeighbours) {
  if (!allNeighbours) {
    return null;
  }
  var index = Math.floor(Math.random() * allNeighbours.length);
  var neighbourCell = allNeighbours[index];

  allNeighbours.splice(index, 1);
  console.log("Picked [" + neighbourCell.i + ", " + neighbourCell.j + "]");
  return neighbourCell;
}

function getAllNeighbours(cell) {
  var allNeighbours = [];
  var allUnvisitedNeighbours = [];
  var i = cell.i;
  var j = cell.j;
  if (j - 1 >= 0) {
    allNeighbours.push(maze[i][j - 1]);
  }
  if (i + 1 <= ROWS - 1) {
    allNeighbours.push(maze[i + 1][j]);
  }
  if (j + 1 <= COLS - 1) {
    allNeighbours.push(maze[i][j + 1]);
  }
  if (i - 1 >= 0) {
    allNeighbours.push(maze[i - 1][j]);
  }
  for (let x = 0; x < allNeighbours.length; x++) {
    if (!allNeighbours[x].visited) {
      allUnvisitedNeighbours.push(allNeighbours[x]);
      console.log(allNeighbours[x].i + ", " + allNeighbours[x].j);
    }
  }
  return allUnvisitedNeighbours;
}