-- Procedural Maze Generation
-- Setting size of Screen
love.window.setMode(1000, 1000);


-- Number of Rows and Columns
local ROWS = 15;
local COLS = 15;
-- Size of each square(width, height)
local squareWidth = 50;
local squareHeight = 50;
-- Getting Dimensions of screen (generally good practice)
local windowWidth, windowHeight = love.graphics.getDimensions()
-- Calculating the center to print the top left first square
local centerPositionOfX = (windowWidth / 2) - (ROWS * squareWidth / 2);
local centerPositionOfY = (windowHeight / 2) - (COLS * squareHeight / 2);

function love.load()
end

function love.update(dt)
end

function love.draw()
    initializeEmptySquares()
end

function initializeEmptySquares()
    for i = 1, ROWS do
        for j = 1, COLS do
            love.graphics.rectangle("line", centerPositionOfX + 50 * (i - 1), centerPositionOfY + 50 * (j - 1),
                squareWidth, squareHeight)
        end
    end
end
