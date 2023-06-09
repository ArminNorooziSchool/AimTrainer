// Global Variables
let targetSize = 30;

// Canvas and Graphics Content
let cnv = document.getElementById("my-canvas");
let ctx = cnv.getContext("2d");
cnv.width = 800;
cnv.height = 600;

let startButton = document.getElementById("start-button");
startButton.addEventListener("click", startGame);

let currentScoreSpan = document.getElementById("current-score");
let highScoreSpan = document.getElementById("high-score");

let state;
let targets = [];
let currentScore = 0;
let highScore = 0;

window.addEventListener("load", draw);

// Draw
function draw() {
  if (state === "start") {
    drawStart();
  } else if (state === "gameon") {
    runGame();
  } else if (state === "gameover") {
    drawGameOver();
  }

  // Next Animation Frame
  requestAnimationFrame(draw);
}

// Game Start
function startGame() {
  state = "gameon";
  startButton.disabled = true;
  currentScore = 0;
  currentScoreSpan.textContent = currentScore;
  highScoreSpan.textContent = highScore;

  // Game duration timeout & target generation
  setTimeout(endGame, 30000);
  generateTarget();
}

// Generating targets
function generateTarget() {
  let target = {
    x: Math.random() * (cnv.width - targetSize),
    y: Math.random() * (cnv.height - targetSize),
    w: targetSize,
    h: targetSize,
    timeout: setTimeout(function () {
      removeTarget(target);
    }, 1500),
  };

  targets.push(target);
}

// Target removal and regeneration
function removeTarget(target) {
  let index = targets.indexOf(target);
  if (index !== -1) {
    clearTimeout(target.timeout);
    targets.splice(index, 1);
  }
  generateTarget();
}

// Game logic
function runGame() {
  drawGame();
}

// Drawing the game on the canvas
function drawGame() {
  ctx.clearRect(0, 0, cnv.width, cnv.height);

  for (let i = 0; i < targets.length; i++) {
    let target = targets[i];
    ctx.fillStyle = "red";
    ctx.fillRect(target.x, target.y, target.w, target.h);
  }
}

// Start screen
function drawStart() {
  ctx.clearRect(0, 0, cnv.width, cnv.height);
  ctx.font = "40px Consolas";
  ctx.fillStyle = "lightblue";
  ctx.fillText("CLICK TO START", 300, 285);
}

// Gameover screen
function drawGameOver() {
  ctx.clearRect(0, 0, cnv.width, cnv.height);
  ctx.font = "40px Consolas";
  ctx.fillStyle = "lightblue";
  ctx.fillText("GAME OVER", 350, 285);
}

// Ending the game
function endGame() {
  state = "gameover";
  startButton.disabled = false;

  // High score updater
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreSpan.textContent = highScore;
  }
}

// Mousedown Handler
cnv.addEventListener("mousedown", mousedownHandler);

// Event handler for mouse clicks
function mousedownHandler(event) {
  if (state !== "gameon") {
    return;
  } else {
    // Mouse coordinates (x, y, w, h)
    let rect = cnv.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    var mouseW = cnv.width;
    var mouseH = cnv.height;
  }

  // Collision Detection
  for (let targetL = targets.length - 1; targetL >= 0; targetL--) {
    let target = targets[targetL];
    if (
      mouseX < target.x + target.w &&
      mouseX + mouseW > target.x &&
      mouseY < target.y + target.h &&
      mouseY + mouseH > target.y
    ) {
      removeTarget(target);
      currentScore++;
      currentScoreSpan.textContent = currentScore;
      break;
    }
  }
}

//Game reset
function reset() {
  state = "start";
  targets;
  currentScore = 0;
  highScore = 0;
  currentScoreSpan.textContent = currentScore;
  highScoreSpan.textContent = highScore;
}

reset();
