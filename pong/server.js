const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

io.on('connection', function (socket) {
  console.log('A client connected');

  socket.on('paddleMoved', function (data) {
    socket.broadcast.emit('paddleMoved', data);
  });

  socket.on('ballBounced', function (data) {
    socket.broadcast.emit('ballBounced', data);
  });

  socket.on('scored', function (data) {
    socket.broadcast.emit('scored', data);
  });

  socket.on('disconnect', function () {
    console.log('A client disconnected');
  });
});

server.listen(3000, function () {
  console.log('Server started. Listening on port 3000.');
});
