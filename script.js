// Get canvas and context
const canvas = document.getElementById('snake');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore'); // NEW
const aiToggleButton = document.getElementById('aiToggle');

// Game constants
const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const COLS = CANVAS_SIZE / GRID_SIZE;
const ROWS = CANVAS_SIZE / GRID_SIZE;
const PLAYER_SPEED = 100;
const AI_SPEED = 20;

// Game state
let snake;
let food;
let score;
let highScore = 0; // NEW
let direction;
let isAiActive = true;
let gameInterval;
let isPaused = false;
let isGameOver = false;

// --- High Score Logic ---

function loadHighScore() {
    const storedHighScore = localStorage.getItem('snakeHighScore');
    if (storedHighScore) {
        highScore = parseInt(storedHighScore, 10);
    }
    highScoreElement.innerText = highScore;
}

function checkHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreElement.innerText = highScore;
    }
}

// --- Helper Functions ---

function createRandomPosition() {
    return {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS)
    };
}

function drawRect(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    context.strokeStyle = '#222';
    context.strokeRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
}

function checkCollision(head, body) {
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
        return true;
    }
    // Check all body segments except the head (index 0) and the tail (last index)
    for (let i = 1; i < body.length - 1; i++) {
        if (head.x === body[i].x && head.y === body[i].y) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    score = 0;
    scoreElement.innerText = score;
    food = createRandomPosition();
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food = createRandomPosition();
    }
    isGameOver = false;
    isPaused = false;
    startGameLoop();
}

function startGameLoop() {
    clearInterval(gameInterval);
    const currentSpeed = isAiActive ? AI_SPEED : PLAYER_SPEED;
    gameInterval = setInterval(gameTick, currentSpeed);
}

function gameOver() {
    isGameOver = true;
    checkHighScore(); // NEW: Check if we have a new high score
    clearInterval(gameInterval);
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    context.fillStyle = '#fff';
    context.font = '30px "Courier New", Courier, monospace';
    context.textAlign = 'center';
    context.fillText('GAME OVER', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 20);
    context.font = '20px "Courier New", Courier, monospace';
    context.fillText('Score: ' + score, CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 20);
    context.fillText('Press any key to restart', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 50);

    document.addEventListener('keydown', restartHandler);
}

function restartHandler() {
    document.removeEventListener('keydown', restartHandler);
    resetGame();
}

// --- Drawing Functions ---

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    drawRect(food.x, food.y, '#FF0000');
    snake.forEach((segment, index) => {
        drawRect(segment.x, segment.y, index === 0 ? '#0F0' : '#090');
    });
}

// --- Game Logic ---

function gameTick() {
    if (isPaused || isGameOver) return;

    if (isAiActive) {
        const nextDirection = findPathToFood();
        if (nextDirection) {
            direction = nextDirection;
        } else {
            findSafePath();
        }
    }

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (checkCollision(head, snake)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.innerText = score; // NEW: Update score display
        food = createRandomPosition();
        while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            food = createRandomPosition();
        }
    } else {
        snake.pop();
    }

    draw();
}

// --- AI LOGIC (BFS Pathfinding with ENHANCED SAFETY CHECK) ---
// The rest of the AI logic from the previous step remains unchanged.
// ... (All AI functions like getNeighbors, findPathToFood, isPathTrulySafe, etc. go here) ...
function getNeighbors(node, snakeBody) {
    const neighbors = [];
    const possibleMoves = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
    for (const move of possibleMoves) {
        const newX = node.x + move.x;
        const newY = node.y + move.y;
        if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
            let isCollision = false;
            for (let i = 0; i < snakeBody.length - 1; i++) {
                if (newX === snakeBody[i].x && newY === snakeBody[i].y) { isCollision = true; break; }
            }
            if (!isCollision) {
                neighbors.push({ x: newX, y: newY, parent: node, move: move });
            }
        }
    }
    return neighbors;
}
function findPathToFood() {
    const queue = [];
    const visited = new Set();
    const startNode = { x: snake[0].x, y: snake[0].y, parent: null, move: null };
    queue.push(startNode);
    visited.add(`${startNode.x},${startNode.y}`);
    while (queue.length > 0) {
        const currentNode = queue.shift();
        if (currentNode.x === food.x && currentNode.y === food.y) {
            let path = [];
            let temp = currentNode;
            while (temp.parent) { path.unshift(temp.move); temp = temp.parent; }
            if (isPathTrulySafe(path)) { return path[0]; }
        }
        for (const neighbor of getNeighbors(currentNode, snake)) {
            const key = `${neighbor.x},${neighbor.y}`;
            if (!visited.has(key)) { visited.add(key); queue.push(neighbor); }
        }
    }
    return null;
}
function isPathTrulySafe(pathToFoodMoves) {
    let simulatedSnake = JSON.parse(JSON.stringify(snake));
    for (let i = 0; i < pathToFoodMoves.length; i++) {
        const move = pathToFoodMoves[i];
        const currentHead = simulatedSnake[0];
        const newHead = { x: currentHead.x + move.x, y: currentHead.y + move.y };
        simulatedSnake.unshift(newHead);
        const isEatingMove = (i === pathToFoodMoves.length - 1);
        if (!isEatingMove) { simulatedSnake.pop(); }
    }
    return canReachTail(simulatedSnake);
}
function canReachTail(currentSnakeState) {
    const queue = [];
    const visited = new Set();
    const startNode = { x: currentSnakeState[0].x, y: currentSnakeState[0].y };
    const tailNode = currentSnakeState[currentSnakeState.length - 1];
    queue.push(startNode);
    visited.add(`${startNode.x},${startNode.y}`);
    while (queue.length > 0) {
        const currentNode = queue.shift();
        if (currentNode.x === tailNode.x && currentNode.y === tailNode.y) { return true; }
        const neighbors = getNeighbors(currentNode, currentSnakeState);
        for (const neighbor of neighbors) {
            const key = `${neighbor.x},${neighbor.y}`;
            if (!visited.has(key)) { visited.add(key); queue.push({ x: neighbor.x, y: neighbor.y }); }
        }
    }
    return false;
}
function findSafePath() {
    let bestMove = null;
    let longestPath = -1;
    const currentHead = snake[0];
    const possibleMoves = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
    for (const move of possibleMoves) {
        const nextHead = { x: currentHead.x + move.x, y: currentHead.y + move.y };
        if (checkCollision(nextHead, snake)) continue;
        let tempSnake = JSON.parse(JSON.stringify(snake));
        tempSnake.unshift(nextHead);
        tempSnake.pop();
        if (canReachTail(tempSnake)) {
            const pathLength = getPathLengthToTail(tempSnake);
            if (pathLength > longestPath) { longestPath = pathLength; bestMove = move; }
        }
    }
    if (!bestMove) {
        for (const move of possibleMoves) {
            const nextHead = { x: currentHead.x + move.x, y: currentHead.y + move.y };
            if (!checkCollision(nextHead, snake)) { bestMove = move; break; }
        }
    }
    if (bestMove) { direction = { x: bestMove.x, y: bestMove.y }; }
}
function getPathLengthToTail(currentSnakeState) {
    const queue = [];
    const visited = new Set();
    const startNode = { x: currentSnakeState[0].x, y: currentSnakeState[0].y, dist: 0 };
    const tailNode = currentSnakeState[currentSnakeState.length - 1];
    queue.push(startNode);
    visited.add(`${startNode.x},${startNode.y}`);
    while (queue.length > 0) {
        const currentNode = queue.shift();
        if (currentNode.x === tailNode.x && currentNode.y === tailNode.y) { return currentNode.dist; }
        const neighbors = getNeighbors(currentNode, currentSnakeState);
        for (const neighbor of neighbors) {
            const key = `${neighbor.x},${neighbor.y}`;
            if (!visited.has(key)) { visited.add(key); queue.push({ x: neighbor.x, y: neighbor.y, dist: currentNode.dist + 1 }); }
        }
    }
    return -1;
}

// --- Event Listeners ---

document.addEventListener('keydown', event => {
    if (isGameOver) return;

    if (event.key.toLowerCase() === 'p') {
        isPaused = !isPaused;
        if (!isPaused) startGameLoop();
        else clearInterval(gameInterval);
        return;
    }

    if (isAiActive || isPaused) return;

    if (event.key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -1 };
    else if (event.key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 1 };
    else if (event.key === 'ArrowLeft' && direction.x === 0) direction = { x: -1, y: 0 };
    else if (event.key === 'ArrowRight' && direction.x === 0) direction = { x: 1, y: 0 };
});

aiToggleButton.addEventListener('click', () => {
    isAiActive = !isAiActive;
    aiToggleButton.textContent = isAiActive ? 'AI is ON' : 'Player Mode';
    aiToggleButton.classList.toggle('player-mode', !isAiActive);
    startGameLoop();
});

// --- Initialization ---
loadHighScore(); // NEW: Load high score on startup
resetGame();
draw();