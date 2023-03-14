var socket;

function setup() {
  createCanvas(800, 500);
  noStroke();
  fill('#ffffff');
  
  
  socket = io.connect('localhost:3000');
  
  socket.on('ballPos', getBallPos);
  socket.on('paddleLeft', showPaddles);
  socket.on('paddleRight', showPaddles);
  socket.on('clientCount', checkClientCount)
}

// STOLEN CODE
// https://editor.p5js.org/annawasson/sketches/BQFIoo6s2

var thisClient = 0;
var opponentPaddlePosLeft = 0;
var opponentPaddlePosRight = 0;
var xBall = Math.floor(Math.random() * 300) + 50;
var yBall = 50;
var thisBallPosX;
var thisBallPosX;
var speedXtreme = 1;
var xSpeed = (2, 7)*1.5;
var ySpeed = (-7, -2)*1.5;
var scorePlayerLeft = 0;
var scorePlayerRight = 0;
var info = 'test';

function checkClientCount(clientCount){
  thisClient = clientCount;
  if (clientCount == 1){
    console.log('client nr. 1')
  } else if (clientCount == 2){
    console.log('client nr. 2')
  } else {
    console.log('too many clients');
  }
  info = 'Welcome Player' + clientCount;
}

function getBallPos(data){
  thisBallPosX = data.ballPosX;
  thisBallPosY = data.ballPosY;
}

function showPaddles(data){
  opponentPaddlePosLeft = data.paddlePosLeft;
  opponentPaddlePosRight = data.paddlePosRight;
}

function paddleDisplay(){
  if (thisClient == 1){
    rect(50, mouseY, 15, 100);
    rect(width - 50, opponentPaddlePosRight, 15, 100);
    sendPaddleLeftPos();

  } else if (thisClient == 2){
    rect(50, opponentPaddlePosLeft, 15, 100);
    rect(width - 50, mouseY, 15, 100);
    sendPaddleRightPos();

  }

}

function sendPaddleLeftPos(){
  var data = {
    paddlePosLeft: mouseY
  }
  socket.emit('paddleLeft', data);
}

function sendPaddleRightPos(){
  var data = {
    paddlePosRight: mouseY
  }
  socket.emit('paddleRight', data);
}



function draw() {
  // Background
  background(0);

  // functions
  
  ballMove();
  showBall();
  paddleDisplay();
  borderBounce();
  thisPaddleBounce();
  opponentPaddleBounce();
  scoreCount();

  //Score
  textSize(18);
  textAlign(LEFT);
  text("Player 1 - Score: " + scorePlayerLeft, 10, 25);
  textAlign(CENTER);
  text(info, width / 2, 25);
  textAlign(RIGHT);
  text("Player 2 - Score: " + scorePlayerRight, width - 10, 25);

}



// display ball
function showBall() {
  if (thisClient == 1){
    ellipse(xBall, yBall, 20, 20);

    var data = {
      ballPosX: xBall,
      ballPosY: yBall
    }
    socket.emit('ballPos', data);  
  } 
  else if (thisClient == 2){
    ellipse(thisBallPosX, thisBallPosY, 20, 20); 
  }
}

// ball movement
function ballMove() {
  xBall += xSpeed;
  yBall += ySpeed;
}



// bounce off borders
function borderBounce() {
  if (xBall < 10 || xBall > width - 10) {
    xSpeed *= -1;
  }
  if (yBall < 10 || yBall > height - 10) {
    ySpeed *= -1;
  }
}

function scoreCount(){
  if(xBall < 10){
    info = 'Goal for Player 2'
    scorePlayerRight++;
  } else if (xBall > width - 10){
    info = 'Goal for Player 1'
    scorePlayerLeft++;
  }
}


// this paddle bounce
function thisPaddleBounce() {
  if (thisClient == 1){
    if ((yBall > mouseY && yBall < mouseY + 50) && (xBall - 10 <= 65)) {
      xSpeed *= -1;
      }
  } else if (thisClient == 2){
    if ((yBall > mouseY && yBall < mouseY + 50) && (xBall - 10 >= width - 65)){
      xSpeed *= -1;
    }
  }
}

// opponent paddle bounce
function opponentPaddleBounce() {
  if (thisClient == 1){
    if ((yBall > opponentPaddlePosRight && yBall < opponentPaddlePosRight + 50) && (xBall - 10 >= width - 65)){
      xSpeed *= -1;
    }
  } else if (thisClient == 2){
    if ((yBall > opponentPaddlePosLeft && yBall < opponentPaddlePosLeft + 50) && (xBall - 10 <= 65)){
      xSpeed *= -1;
    }
  }
}