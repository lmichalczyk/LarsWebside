const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restartButton');

const paddleHeight = 100;
const paddleWidth = 10;
const ballSize = 10;

let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 3;

let leftScore = 0;
let rightScore = 0;
let gameRunning = true;

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fill();
}

function drawText(text, x, y, color, size) {
    ctx.fillStyle = color;
    ctx.font = `${size}px Arial`;
    ctx.fillText(text, x, y);
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 3;
}

function update() {
    if (!gameRunning) return;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY < 0 || ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    if (
        (ballX < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) ||
        (ballX > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight)
    ) {
        ballSpeedX = -ballSpeedX;
    }

    if (ballX < 0) {
        rightScore++;
        resetBall();
    } else if (ballX > canvas.width) {
        leftScore++;
        resetBall();
    }

    scoreElement.textContent = `${leftScore} - ${rightScore}`;

    if (leftScore >= 10 || rightScore >= 10) {
        gameRunning = false;
        restartButton.style.display = 'inline-block';
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(0, leftPaddleY, paddleWidth, paddleHeight, 'black');
    drawRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight, 'black');
    drawCircle(ballX, ballY, ballSize, 'black');

    if (!gameRunning) {
        const winner = leftScore > rightScore ? 'Venstre' : 'Høyre';
        drawText(`${winner} spiller vant!`, canvas.width / 2 - 100, canvas.height / 2, 'black', 24);
    }

    requestAnimationFrame(update);
}

// Tastaturkontroller
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    switch (e.key) {
        case 'w':
            leftPaddleY = Math.max(0, leftPaddleY - 20);
            break;
        case 's':
            leftPaddleY = Math.min(canvas.height - paddleHeight, leftPaddleY + 20);
            break;
        case 'ArrowUp':
            rightPaddleY = Math.max(0, rightPaddleY - 20);
            break;
        case 'ArrowDown':
            rightPaddleY = Math.min(canvas.height - paddleHeight, rightPaddleY + 20);
            break;
    }
});

restartButton.addEventListener('click', () => {
    leftScore = 0;
    rightScore = 0;
    resetBall();
    gameRunning = true;
    restartButton.style.display = 'none';
    scoreElement.textContent = '0 - 0';
});

update();
