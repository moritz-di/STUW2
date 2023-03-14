// Set up the canvas
const canvasWidth = 600;
const canvasHeight = 400;
let canvas;

// Set up the game objects
let ball;
let paddles = [];

// Set up the socket
let socket;

function setup() {
  // Create the canvas
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');

  // Create the ball
  ball = new Ball();

  // Create the paddles
  paddles[0] = new Paddle(20, height / 2 - 50);
  paddles[1] = new Paddle(width - 40, height / 2 - 50);

  // Connect to the server
  socket = io.connect('http://localhost:8080');

  // Set up the socket listeners
  socket.on('paddleMoved', function (data) {
    paddles[data.index].y = data.y;
  });

  socket.on('ballMoved', function (data) {
    ball.x = data.x;
    ball.y = data.y;
    ball.xSpeed = data.xSpeed;
    ball.ySpeed = data.ySpeed;
  });
}

function draw() {
  // Clear the background
  background(0);

  // Update the ball and paddles
  ball.update();
  for (let i = 0; i < paddles.length; i++) {
    paddles[i].update();
  }

  // Draw the ball and paddles
  ball.draw();
  for (let i = 0; i < paddles.length; i++) {
    paddles[i].draw();
  }

  // Check for collisions
  for (let i = 0; i < paddles.length; i++) {
    if (ball.collidesWithPaddle(paddles[i])) {
      ball.bounceOffPaddle(paddles[i]);
      socket.emit('ballBounced', i);
    }
  }

  // Check for scoring
  if (ball.x < 0) {
    socket.emit('scored', 1);
    ball.reset();
  } else if (ball.x > width) {
    socket.emit('scored', 0);
    ball.reset();
  }
}

function mouseMoved() {
  // Send the paddle position to the server
  let data = {
    index: 0,
    y: mouseY
  };
  socket.emit('paddleMoved', data);
}

// Ball class
class Ball {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.size = 20;
    this.xSpeed = random([-5, 5]);
    this.ySpeed = random([-5, 5]);
  }

  update() {
    // Move the ball
   
