const SIZE = 4;

let board = [];
let score = 0;
let bestScore = Number(localStorage.getItem("2048-best-score")) || 0;
let gameEnded = false;


// Get HTML elements
const gameBoard = document.getElementById("game-board");
const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("best-score");
const newGameButton = document.getElementById("new-game");


// ============================
// START GAME
// ============================

function startGame() {

    board = createEmptyBoard();

    score = 0;
    gameEnded = false;

    addRandomTile();
    addRandomTile();

    updateGame();
}


// ============================
// CREATE EMPTY BOARD
// ============================

function createEmptyBoard() {

    return Array.from(
        { length: SIZE },
        () => Array(SIZE).fill(0)
    );
}


// ============================
// ADD RANDOM TILE
// ============================

function addRandomTile() {

    const emptyCells = [];

    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE; col++) {

            if (board[row][col] === 0) {

                emptyCells.push({
                    row: row,
                    col: col
                });
            }
        }
    }

    if (emptyCells.length === 0) {
        return;
    }

    const randomIndex =
        Math.floor(Math.random() * emptyCells.length);

    const cell = emptyCells[randomIndex];

    board[cell.row][cell.col] =
        Math.random() < 0.9 ? 2 : 4;
}


// ============================
// UPDATE GAME
// ============================

function updateGame() {

    renderBoard();

    scoreElement.textContent = score;

    if (score > bestScore) {

        bestScore = score;

        localStorage.setItem(
            "2048-best-score",
            bestScore
        );
    }

    bestScoreElement.textContent = bestScore;
}


// ============================
// RENDER BOARD
// ============================

function renderBoard() {

    gameBoard.innerHTML = "";

    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE; col++) {

            const cell = document.createElement("div");

            cell.classList.add("cell");

            const value = board[row][col];

            if (value !== 0) {

                cell.textContent = value;

                cell.classList.add(`tile-${value}`);
            }

            gameBoard.appendChild(cell);
        }
    }
}


// ============================
// MOVE LEFT
// ============================

function moveLeft() {

    let moved = false;

    for (let row = 0; row < SIZE; row++) {

        const original = [...board[row]];

        let line = compress(board[row]);

        line = merge(line);

        line = fillZeros(line);

        board[row] = line;

        if (!arraysEqual(original, line)) {

            moved = true;
        }
    }

    return moved;
}


// ============================
// MOVE RIGHT
// ============================

function moveRight() {

    let moved = false;

    for (let row = 0; row < SIZE; row++) {

        const original = [...board[row]];

        let line = [...board[row]].reverse();

        line = compress(line);

        line = merge(line);

        line = fillZeros(line);

        line.reverse();

        board[row] = line;

        if (!arraysEqual(original, line)) {

            moved = true;
        }
    }

    return moved;
}


// ============================
// MOVE UP
// ============================

function moveUp() {

    let moved = false;

    for (let col = 0; col < SIZE; col++) {

        const original = [];

        for (let row = 0; row < SIZE; row++) {

            original.push(board[row][col]);
        }

        let line = compress(original);

        line = merge(line);

        line = fillZeros(line);

        for (let row = 0; row < SIZE; row++) {

            board[row][col] = line[row];
        }

        if (!arraysEqual(original, line)) {

            moved = true;
        }
    }

    return moved;
}


// ============================
// MOVE DOWN
// ============================

function moveDown() {

    let moved = false;

    for (let col = 0; col < SIZE; col++) {

        const original = [];

        for (let row = 0; row < SIZE; row++) {

            original.push(board[row][col]);
        }

        let line = original.reverse();

        line = compress(line);

        line = merge(line);

        line = fillZeros(line);

        line.reverse();

        for (let row = 0; row < SIZE; row++) {

            board[row][col] = line[row];
        }

        if (!arraysEqual(original, line)) {

            moved = true;
        }
    }

    return moved;
}


// ============================
// REMOVE ZEROS
// ============================

function compress(line) {

    return line.filter(value => value !== 0);
}


// ============================
// MERGE SAME TILES
// ============================

function merge(line) {

    const result = [];

    let i = 0;

    while (i < line.length) {

        if (
            i < line.length - 1 &&
            line[i] === line[i + 1]
        ) {

            const newValue = line[i] * 2;

            result.push(newValue);

            score += newValue;

            i += 2;

        } else {

            result.push(line[i]);

            i++;
        }
    }

    return result;
}


// ============================
// ADD ZEROS
// ============================

function fillZeros(line) {

    while (line.length < SIZE) {

        line.push(0);
    }

    return line;
}


// ============================
// COMPARE ARRAYS
// ============================

function arraysEqual(first, second) {

    return first.every(
        (value, index) =>
            value === second[index]
    );
}


// ============================
// KEYBOARD CONTROLS
// ============================

document.addEventListener("keydown", function(event) {

    if (gameEnded) {
        return;
    }

    let moved = false;

    switch (event.key) {

        case "ArrowLeft":
            moved = moveLeft();
            break;

        case "ArrowRight":
            moved = moveRight();
            break;

        case "ArrowUp":
            moved = moveUp();
            break;

        case "ArrowDown":
            moved = moveDown();
            break;

        default:
            return;
    }

    event.preventDefault();

    if (moved) {

        addRandomTile();

        updateGame();

        checkGameState();
    }
});


// ============================
// CHECK GAME STATE
// ============================

function checkGameState() {

    if (hasWon()) {

        alert("🎉 You reached 2048!");

        gameEnded = true;

        return;
    }

    if (!canMove()) {

        alert("Game Over!");

        gameEnded = true;
    }
}


// ============================
// CHECK WIN
// ============================

function hasWon() {

    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE; col++) {

            if (board[row][col] >= 2048) {

                return true;
            }
        }
    }

    return false;
}


// ============================
// CHECK POSSIBLE MOVES
// ============================

function canMove() {

    // Check empty cells
    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE; col++) {

            if (board[row][col] === 0) {

                return true;
            }
        }
    }


    // Check horizontal matches
    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE - 1; col++) {

            if (
                board[row][col] ===
                board[row][col + 1]
            ) {

                return true;
            }
        }
    }


    // Check vertical matches
    for (let row = 0; row < SIZE - 1; row++) {

        for (let col = 0; col < SIZE; col++) {

            if (
                board[row][col] ===
                board[row + 1][col]
            ) {

                return true;
            }
        }
    }

    return false;
}


// ============================
// NEW GAME BUTTON
// ============================

newGameButton.addEventListener(
    "click",
    startGame
);


// ============================
// INITIALIZE
// ============================

bestScoreElement.textContent = bestScore;

startGame();