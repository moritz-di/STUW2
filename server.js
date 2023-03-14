var express = require('express');
var app = express();
var server = app.listen(3000);


app.use(express.static('public'));

console.log("lessgoo");

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);

var totalClients = 0;



function newConnection(socket){
  totalClients++;
  console.log('New connection: ' + socket.id + ' / Client nr.: ' + totalClients);
  
  console.log(io.engine.clientsCount);
  
  socket.emit('clientCount', io.engine.clientsCount);

  socket.on('paddleLeft', paddleLeft);

  function paddleLeft(data){
    //console.log(data);
    socket.broadcast.emit('paddleLeft', data);
  }

  socket.on('paddleRight', paddleRight);

  function paddleRight(data){
    //console.log(data);
    socket.broadcast.emit('paddleRight', data);
  }

  socket.on('ballPos', ballPos);

  function ballPos(data){
    //console.log(data);
    socket.broadcast.emit('ballPos', data);
  }

}