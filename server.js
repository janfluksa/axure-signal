'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const app = express();

const server = app.listen(PORT, () => {
  console.log('listening on *:' + PORT);
});

app.use(express.static('static'));

const io = socketIO(server);

    
io.on('connection', function(socket){

  socket.on('signal', function(msg){
    io.emit('signal', msg);
    console.log("signal \x1b[36m" + msg.signal + " (WEBSOCKET: " + socket.id + ")\x1b[0m"+" received with message: \x1b[36m" + msg.message + "\x1b[0m");
    // socket.broadcast.emit('signal', msg);
  });


});

app.all("/", (req,res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/signal/:signal/:message', (req, res) => {

  var change = {"signal": req.params.signal, "message": req.params.message};

  io.emit('signal', change);
  console.log("Signal \x1b[36m" + req.params.signal +" (HTTP GET) \x1b[0m received with message: \x1b[36m" + req.params.message + "\x1b[0m");
  res.json(change);

});


app.get('/signal/:signal', (req, res) => {

  var change = {"signal": req.params.signal, "message": "ok"};

  io.emit('signal', change);
  console.log("Signal \x1b[36m" + req.params.signal +" (HTTP GET) \x1b[0m received with message: \x1b[36m" + req.params.message + "\x1b[0m");
  res.json(change);
  
});